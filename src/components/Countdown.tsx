import { useEffect, useState, useMemo } from "react";

type CountdownProps = {
  targetDate: Date;
  onFinish: () => void;
};

// --- KOMPONEN KECIL: STATBOX (Sudah diperbaiki responsivitasnya) ---
const StatBox = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl sm:rounded-2xl p-2 sm:p-4 border border-slate-100 shadow-inner flex-1 min-w-[60px] max-w-[80px]">
    <span className="text-2xl sm:text-4xl font-black text-violet-700 tabular-nums tracking-tighter sm:tracking-tight">
      {value}
    </span>
    <span className="text-[8px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
      {label}
    </span>
  </div>
);

export default function Countdown({ targetDate, onFinish }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<number>(() => targetDate.getTime() - new Date().getTime());

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish();
      return;
    }

    const timer = setInterval(() => {
      const remaining = targetDate.getTime() - new Date().getTime();
      if (remaining <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
        onFinish();
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate, onFinish, timeLeft]);

  const { d, h, m, s } = useMemo(() => {
    const totalSeconds = Math.max(0, Math.floor(timeLeft / 1000));
    return {
      d: String(Math.floor(totalSeconds / (3600 * 24))).padStart(2, '0'),
      h: String(Math.floor((totalSeconds % (3600 * 24)) / 3600)).padStart(2, '0'),
      m: String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0'),
      s: String(totalSeconds % 60).padStart(2, '0'),
    };
  }, [timeLeft]);

  if (timeLeft <= 0) return null;

  return (
    <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-[32px] p-6 sm:p-10 text-center max-w-lg w-full border border-white transform transition-all animate-pop-up mx-auto">
      
      {/* Icon Jam */}
      <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4 sm:mb-6 border-4 border-white shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mb-2 tracking-tight px-2">
        Pengumuman Kelulusan
      </h1>
      <p className="text-slate-500 mb-8 sm:mb-10 text-xs sm:text-sm max-w-[280px] sm:max-w-sm mx-auto leading-relaxed">
        Gerbang masa depanmu akan dibuka sebentar lagi. Mohon bersabar menunggu waktu selesai.
      </p>
      
      {/* Container Angka - Gunakan Flex Gap yang dinamis */}
      <div className="flex items-center justify-between gap-1 sm:gap-4 px-1 sm:px-0">
        <StatBox value={d} label="Hari" />
        <span className="text-xl sm:text-2xl font-bold text-slate-300 mb-4">:</span>
        <StatBox value={h} label="Jam" />
        <span className="text-xl sm:text-2xl font-bold text-slate-300 mb-4">:</span>
        <StatBox value={m} label="Menit" />
        <span className="text-xl sm:text-2xl font-bold text-slate-300 mb-4">:</span>
        <StatBox value={s} label="Detik" />
      </div>
      
      <p className="text-[10px] sm:text-xs text-slate-400 mt-8 sm:mt-10 font-bold uppercase tracking-widest">
        Tahun Ajaran 2025/2026
      </p>
    </div>
  );
}