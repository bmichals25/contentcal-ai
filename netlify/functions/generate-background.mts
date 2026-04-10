import type { Context } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = Netlify.env.get("VITE_SUPABASE_URL")!;
const supabaseKey = Netlify.env.get("VITE_SUPABASE_ANON_KEY")!;
const openaiKey = Netlify.env.get("OPENAI_API_KEY")!;

const supabase = createClient(supabaseUrl, supabaseKey);

function getDaysInMonth(year: number, month: number): string[] {
  const days: string[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    days.push(date);
  }
  return days;
}

async function generateWeekContent(businessInfo: string, dates: string[], weekNum: number, totalWeeks: number): Promise<any[]> {
  const dateList = dates.join(", ");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: `You are an expert social media manager and content strategist. Generate a detailed content calendar for the specified dates.\n\nFor each date, create 2 content pieces across different platforms. Mix up the platforms and content types strategically.\n\nPLATFORMS & CONTENT TYPES:\n- instagram: post, story, reel, carousel\n- twitter: post, thread\n- linkedin: post, article\n- tiktok: video_script\n- blog: article\n- youtube: video_script\n\nFor EACH content item, provide:\n- scheduled_date: The exact date (YYYY-MM-DD format)\n- platform: One of the platforms above\n- content_type: Matching content type for the platform\n- title: Catchy, specific title (not generic)\n- idea: 1-2 sentence description of the content concept and angle\n- draft_content: The full ready-to-post caption/text (200-400 words for articles, 50-150 words for social posts, include emojis for social). Make this genuinely useful and ready to copy-paste.\n- script: For video_script types ONLY - a full video/audio script with [HOOK], [BODY], and [CTA] sections. Include speaking directions. For non-video types, set to null.\n- hashtags: 5-10 relevant hashtags (with # prefix)\n- notes: Brief production notes\n\nIMPORTANT:\n- Make content specific to this business, not generic\n- Vary the topics, angles, and formats throughout the week\n- Include educational, promotional, behind-the-scenes, and engagement content\n- Week ${weekNum} of ${totalWeeks} - theme the content progression naturally\n- Each post should feel unique and valuable\n\nReturn JSON: { "items": [...] }` },
        { role: "user", content: `BUSINESS INFO:\n${businessInfo}\n\nGenerate content for these dates: ${dateList}` },
      ],
      temperature: 0.8,
      max_tokens: 4000,
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error(`OpenAI error for week ${weekNum}:`, errText);
    throw new Error(`OpenAI API error: ${res.status}`);
  }
  const data = await res.json();
  const parsed = JSON.parse(data.choices[0].message.content);
  return parsed.items || [];
}

export default async (req: Request, context: Context) => {
  try {
    const { business_id, calendar_id } = await req.json();
    if (!business_id || !calendar_id) { console.error("Missing business_id or calendar_id"); return; }
    const { data: business, error: bizErr } = await supabase.from("contentcal_businesses").select("*").eq("id", business_id).single();
    if (bizErr || !business) {
      console.error("Failed to fetch business:", bizErr);
      await supabase.from("contentcal_calendars").update({ status: "error" }).eq("id", calendar_id);
      return;
    }
    const { data: calendar, error: calErr } = await supabase.from("contentcal_calendars").select("*").eq("id", calendar_id).single();
    if (calErr || !calendar) { console.error("Failed to fetch calendar:", calErr); return; }
    const businessInfo = `Business: ${business.business_name}\nIndustry: ${business.industry}\nDescription: ${business.description}\nTarget Audience: ${business.target_audience}\nBrand Tone: ${business.brand_tone}\nKey Products/Services: ${(business.key_products || []).join(", ")}\nWebsite: ${business.website_url}`;
    const allDays = getDaysInMonth(calendar.year, calendar.month);
    const weeks: string[][] = [];
    for (let i = 0; i < allDays.length; i += 7) { weeks.push(allDays.slice(i, i + 7)); }
    let totalItems = 0;
    for (let i = 0; i < weeks.length; i++) {
      try {
        console.log(`Generating week ${i + 1} of ${weeks.length}...`);
        const items = await generateWeekContent(businessInfo, weeks[i], i + 1, weeks.length);
        if (items.length > 0) {
          const insertData = items.map((item: any) => ({
            calendar_id, scheduled_date: item.scheduled_date, platform: item.platform,
            content_type: item.content_type, title: item.title, idea: item.idea,
            draft_content: item.draft_content, script: item.script || null,
            hashtags: item.hashtags || [], notes: item.notes || null, status: "draft",
          }));
          const { error: insertErr } = await supabase.from("contentcal_content_items").insert(insertData);
          if (insertErr) { console.error(`Insert error for week ${i + 1}:`, insertErr); }
          else { totalItems += insertData.length; console.log(`Week ${i + 1}: inserted ${insertData.length} items`); }
        }
      } catch (weekErr) { console.error(`Error generating week ${i + 1}:`, weekErr); }
    }
    await supabase.from("contentcal_calendars").update({ status: "complete", total_items: totalItems }).eq("id", calendar_id);
    console.log(`Calendar generation complete! ${totalItems} items created.`);
  } catch (err) { console.error("Background generation error:", err); }
};
