import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calendar/:calendarId" element={<CalendarPage />} />
      </Routes>
    </div>
  );
}

export default App;
