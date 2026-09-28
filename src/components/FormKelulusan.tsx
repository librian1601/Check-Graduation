import { useState, FormEvent, useEffect } from "react";
import confetti from "canvas-confetti";

// --- ASET ---
import educationLogo from '../assets/education.png'; 
import loadingLogo from '../assets/loading-logo.png'; 

// --- TIPE DATA SESUAI RESPONSE API ---
interface ApiSiswa {
  id: number;
  nis: string;
  nisn: string;
  name: string;
  gender: string;
  major: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  status: string;
  data: ApiSiswa[];
}

interface SiswaUI {
  nis: string;
  nama: string;
  ket: string;
  kompetensi: string;
}

export default function FormKelulusan() {
  const [nis, setNis] = useState<string>("");
  const [hasilError, setHasilError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalData, setModalData] = useState<SiswaUI | null>(null);
  const [showModalAnimate, setShowModalAnimate] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const API_TOKEN = import.meta.env.VITE_API_TOKEN;

  // --- EFEK ANIMASI & CONFETTI ---
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => setShowModalAnimate(true), 100);
      if (modalData?.ket === "LULUS") {
        triggerConfetti();
      }
    } else {
      setShowModalAnimate(false);
    }
  }, [isModalOpen, modalData]);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  // --- LOGIKA FETCH DATA ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHasilError(null);

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${API_TOKEN}`,
          "Accept": "application/json",
          // Content-Type dihapus untuk GET agar menghindari preflight berlebih
        },
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error("Token API tidak valid.");
        throw new Error(`Gagal menghubungi server (Status: ${response.status})`);
      }

      const result: ApiResponse = await response.json();
      const siswaDitemukan = result.data.find(
        (item) => item.nis.trim().toLowerCase() === nis.trim().toLowerCase()
      );

      if (siswaDitemukan) {
        setTimeout(() => {
          setModalData({
            nis: siswaDitemukan.nis,
            nama: siswaDitemukan.name,
            ket: siswaDitemukan.status,
            kompetensi: siswaDitemukan.major,
          });
          setIsModalOpen(true);
          setLoading(false);
        }, 500);
      } else {
        setHasilError("Data tidak ditemukan. Pastikan NIS benar.");
        setLoading(false);
      }
    } catch (err: any) {
      setHasilError(err.message || "Terjadi kesalahan koneksi.");
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModalAnimate(false);
    setTimeout(() => {
      setIsModalOpen(false);
      setModalData(null);
    }, 400);
  };

  return (
    <>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        .animate-float { animation: float 5s ease-in-out infinite; }
        @keyframes popUp { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-pop-up { animation: popUp 0.5s ease-out forwards; }
      `}</style>

      <div className="flex flex-col items-center justify-center relative z-10 w-full px-4 max-w-xl mx-auto py-10">
        
        <div className="mb-10 animate-float text-center shrink-0">
          <img src={loadingLogo} alt="Logo" className="w-44 md:w-52 h-auto drop-shadow-[0_10px_10px_rgba(124,58,237,0.3)] mx-auto" />
        </div>

        {/* --- FORM CARD --- */}
        <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-10 w-full max-w-md border border-slate-100 animate-pop-up">
          <h2 className="text-3xl font-extrabold text-slate-950 mb-3 text-center tracking-tight">Cek Kelulusan</h2>
          <p className="text-slate-600 text-center mb-8 text-sm leading-relaxed">Masukkan NIS Anda untuk melihat pengumuman.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nis" className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Nomor Induk Siswa</label>
              <input
                id="nis"
                type="text"
                placeholder="Contoh: 21938/042/016"
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-400 outline-none transition-all text-base font-medium"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.97] disabled:opacity-70"
            >
              {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : "Cek Sekarang"}
            </button>
          </form>

          {hasilError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 animate-pop-up text-center text-xs font-bold">{hasilError}</div>
          )}
        </div>

        {/* --- MODAL HASIL (FIXED RESPONSIVE SCROLL) --- */}
        {isModalOpen && modalData && (
          <div 
            className={`fixed inset-0 z-50 flex justify-center items-center p-2 sm:p-4 overflow-y-auto transition-all duration-500 ${
              showModalAnimate ? 'bg-slate-900/80 backdrop-blur-sm' : 'bg-transparent pointer-events-none'
            }`} 
            onClick={closeModal}
          >
            <div 
              className={`bg-white rounded-[30px] w-full max-w-[380px] shadow-2xl overflow-hidden relative transform transition-all duration-500 ${
                showModalAnimate ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
              }`} 
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* 1. Header - Diperpendek (h-28 -> h-20) */}
              <div className="h-20 sm:h-28 bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-pink-500 relative shrink-0">
                <button onClick={closeModal} className="absolute top-3 right-3 bg-white/20 hover:bg-white/30 text-white rounded-full p-1.5 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 2. Avatar - Diperkecil (w-16 -> w-12 di mobile) */}
              <div className="relative -mt-10 sm:-mt-14 flex justify-center shrink-0">
                <div className="bg-white p-1.5 sm:p-2.5 rounded-full shadow-lg border-[5px] border-white">
                  <img src={educationLogo} alt="Icon" className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
                </div>
              </div>

              {/* 3. Modal Body - Spacing lebih rapat (pb-8 -> pb-4) */}
              <div className="pt-2 pb-4 px-6 sm:px-8 text-center">
                <h2 className="text-xl sm:text-2xl font-black text-slate-950 mb-1 tracking-tight leading-tight uppercase">
                  {modalData.nama}
                </h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Hasil Kelulusan</p>

                <div className="mb-4">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border shadow-sm ${
                    modalData.ket === "LULUS" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                  }`}>
                    {modalData.ket}
                  </span>
                </div>

                {/* Info Detail - Lebih Compact */}
                <div className="grid grid-cols-1 gap-2 text-left">
                  <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3 border border-slate-100">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-violet-600 shrink-0 border border-slate-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Jurusan</p>
                      <p className="text-[11px] font-extrabold text-slate-800 leading-tight truncate break-words">{modalData.kompetensi}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3 border border-slate-100">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-fuchsia-600 shrink-0 border border-slate-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">NIS</p>
                      <p className="text-[11px] font-extrabold text-slate-800 font-mono tracking-wider">{modalData.nis}</p>
                    </div>
                  </div>
                </div>

                {/* BKK Section - Diperamping */}
                {modalData.ket === "LULUS" && (
                  <div className="mt-4 pt-3 border-t border-dashed border-slate-200">
                    <div className="bg-emerald-50/70 rounded-xl p-3 border border-emerald-100 text-left">
                      <p className="text-[10px] text-emerald-700 leading-tight font-medium mb-3">
                        Selamat! Pelajari pembuatan akun & tracer study untuk karir di portal BKK SMKN 5 Surabaya.
                      </p>
                      <a href="https://portal-perusahaan.smkn5-sby.sch.id/guides/" target="_blank" className="w-full bg-emerald-600 text-white text-[10px] font-bold py-2.5 rounded-lg flex items-center justify-center gap-2">
                        Pelajari Sekarang
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={closeModal} className="w-full bg-slate-50 py-3.5 text-center transition-colors border-t border-slate-100 outline-none shrink-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tutup Jendela</span>
              </button>

            </div>
          </div>
        )}

        <p className="mt-12 text-slate-400 text-[10px] font-bold uppercase tracking-widest text-center">Graduation Portal SMKN 5 Surabaya &copy; 2026</p>
      </div>
    </>
  );
}