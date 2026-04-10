import type { Context, Config } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = Netlify.env.get("VITE_SUPABASE_URL")!;
const supabaseKey = Netlify.env.get("VITE_SUPABASE_ANON_KEY")!;
const openaiKey = Netlify.env.get("OPENAI_API_KEY")!;

const supabase = createClient(supabaseUrl, supabaseKey);

function extractTextFromHtml(html: string): string {
  let text = html.replace(/<script[\s\S]*?<\/script>/gi, " ");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, " ");
  text = text.replace(/<svg[\s\S]*?<\/svg>/gi, " ");
  const titleMatch = text.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : "";
  const metaDescMatch = text.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  const metaDesc = metaDescMatch ? metaDescMatch[1].trim() : "";
  text = text.replace(/<[^>]+>/g, " ");
  text = text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
  text = text.replace(/\s+/g, " ").trim();
  const truncated = text.substring(0, 6000);
  return `TITLE: ${title}\nMETA DESCRIPTION: ${metaDesc}\n\nPAGE CONTENT:\n${truncated}`;
}

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
  }
  try {
    const { url } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ error: "URL is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const fetchRes = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ContentCalAI/1.0)", Accept: "text/html" },
      redirect: "follow",
    });
    if (!fetchRes.ok) {
      return new Response(JSON.stringify({ error: `Failed to fetch website: ${fetchRes.status}` }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const html = await fetchRes.text();
    const extractedText = extractTextFromHtml(html);
    const analysisRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `You are a business analyst and content strategist. Analyze the following website content and extract key business information. Return a JSON object with these exact fields:\n{\n  "business_name": "The company/brand name",\n  "industry": "The industry/sector",\n  "description": "A 2-3 sentence description of what the business does",\n  "target_audience": "Who their ideal customers are",\n  "brand_tone": "The brand voice/tone",\n  "key_products": ["Array of their main products or services, max 5 items"]\n}\nBe concise and accurate.` },
          { role: "user", content: `Analyze this website (${url}):\n\n${extractedText}` },
        ],
        temperature: 0.3,
        max_tokens: 800,
      }),
    });
    if (!analysisRes.ok) {
      const errText = await analysisRes.text();
      console.error("OpenAI error:", errText);
      return new Response(JSON.stringify({ error: "Failed to analyze website with AI" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
    const analysisData = await analysisRes.json();
    const analysis = JSON.parse(analysisData.choices[0].message.content);
    const { data: business, error: bizError } = await supabase
      .from("contentcal_businesses")
      .insert({ website_url: url, business_name: analysis.business_name, industry: analysis.industry, description: analysis.description, target_audience: analysis.target_audience, brand_tone: analysis.brand_tone, key_products: analysis.key_products, raw_content: extractedText.substring(0, 5000) })
      .select().single();
    if (bizError) throw bizError;
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const calMonth = nextMonth.getMonth() + 1;
    const calYear = nextMonth.getFullYear();
    const { data: calendar, error: calError } = await supabase
      .from("contentcal_calendars")
      .insert({ business_id: business.id, month: calMonth, year: calYear, status: "generating" })
      .select().single();
    if (calError) throw calError;
    return new Response(JSON.stringify({ business, calendar }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    console.error("Analyze error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};

export const config: Config = { path: "/.netlify/functions/analyze" };
