import { useState, useEffect } from "react";
import Countdown from "./components/Countdown";
import FormKelulusan from "./components/FormKelulusan";

function App() {
  // Ganti tanggal ini sesuai kebutuhan uji coba
  const targetDate = new Date("2025-05-04T12:00:00");

  const [isTimeUp, setIsTimeUp] = useState(() => new Date() >= targetDate);

  // Update waktu jika user refresh setelah waktu habis
  useEffect(() => {
    const checkTime = () => {
      if (new Date() >= targetDate) {
        setIsTimeUp(true);
      }
    };
    
    checkTime(); // Cek langsung saat mount
    
    // Opsional: Cek setiap menit jika user membiarkan tab terbuka
    const interval = setInterval(checkTime, 60000); 
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    // BG diperhalus: Slate ke Violet tipis
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-slate-100 flex items-center justify-center p-4 md:p-8 antialiased selection:bg-violet-100 text-slate-900">
      
      {/* Overlay hiasan background (opsional, untuk estetika) */}
      <div className="fixed inset-0 z-0 opacity-40">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full flex justify-center">
        {!isTimeUp ? (
          <Countdown targetDate={targetDate} onFinish={() => setIsTimeUp(true)} />
        ) : (
          <FormKelulusan />
        )}
      </div>
    </div>
  );
}

export default App;