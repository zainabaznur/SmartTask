import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar - Sticky Glass Effect */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-semibold text-slate-900 text-base tracking-tight">Smart Task</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <Link href="/login" className="btn-secondary text-sm">Masuk</Link>
            <Link href="/register" className="btn-primary text-sm">Mulai Gratis</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
          Algoritma EDF — Earliest Deadline First
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 leading-tight tracking-tight mb-6">
          Prioritas Tugas Otomatis,<br />
          <span className="text-blue-700">Deadline Nol Kelalaian</span>
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto mb-10">
          Satu dasbor untuk semua tugas kuliah dan organisasimu. Smart Task mengurutkan
          otomatis berdasarkan deadline terdekat, dan mengirim notifikasi Telegram
          sebelum kamu terlambat. 
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/register" className="btn-primary px-6 py-2.5 text-base">
            Mulai Gratis
          </Link>
          <Link href="/login" className="btn-secondary px-6 py-2.5 text-base">
            Lihat Dashboard 
          </Link>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-center text-slate-900 mb-2 tracking-tight">
            Masalah yang kamu hadapi
          </h2>
          <p className="text-center text-slate-500 mb-10 text-sm">Tiga hambatan produktivitas mahasiswa yang paling umum</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                svg: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                ),
                color: "bg-red-50 text-red-600",
                title: "Fragmentasi Prioritas",
                desc: "Tugas kuliah dan organisasi tersebar di berbagai platform. Susah menentukan mana yang harus dikerjakan duluan.",
              },
              {
                svg: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                ),
                color: "bg-amber-50 text-amber-600",
                title: "Human Error",
                desc: "Lupa deadline karena tidak ada sistem pengingat yang terintegrasi. Satu kelalaian bisa merusak nilai semester.",
              },
              {
                svg: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                color: "bg-purple-50 text-purple-600",
                title: "Decision Fatigue",
                desc: "Menghabiskan energi untuk memutuskan urutan pengerjaan, bukan untuk mengerjakan tugasnya.",
              },
            ].map((item) => (
              <div key={item.title} className="card">
                <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center mb-3`}>
                  {item.svg}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 text-sm">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-center text-slate-900 mb-2 tracking-tight">
            Fitur yang membuatnya berbeda
          </h2>
          <p className="text-center text-slate-500 mb-10 text-sm">Dirancang khusus untuk ritme kerja mahasiswa aktif</p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                svg: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                color: "bg-blue-50 text-blue-700",
                title: "Algoritma EDF",
                desc: "Earliest Deadline First — tugas dengan deadline terdekat selalu muncul di posisi teratas. Tidak perlu berpikir, langsung kerjakan.",
              },
              {
                svg: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                ),
                color: "bg-purple-50 text-purple-700",
                title: "Dual-Path Kategori",
                desc: "Pisahkan tugas Kuliah dan Organisasi dengan filter tab. Satu dasbor, dua jalur, satu pandangan utuh.",
              },
              {
                svg: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                ),
                color: "bg-orange-50 text-orange-700",
                title: "Notifikasi Bertahap",
                desc: "Telegram reminder 3 hari, 1 hari, dan 3 jam sebelum deadline. Idempoten — tidak ada duplikat pesan.",
              },
              {
                svg: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                ),
                color: "bg-green-50 text-green-700",
                title: "Kode Warna Urgensi",
                desc: "Hijau (aman), Kuning (24 jam), Merah (3 jam). Visual instan tanpa perlu membaca tanggal.",
              },
            ].map((f) => (
              <div key={f.title} className="card flex gap-4">
                <div className={`w-10 h-10 rounded-lg ${f.color} flex items-center justify-center flex-shrink-0`}>
                  {f.svg}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1 text-sm">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-700 py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold text-white mb-3 tracking-tight">
            Mulai kelola tugasmu sekarang
          </h2>
          <p className="text-blue-200 mb-8 text-sm leading-relaxed">
            Gratis selamanya untuk mahasiswa. Tidak perlu kartu kredit.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/register"
              className="bg-white text-blue-700 hover:bg-blue-50 rounded-lg px-6 py-2.5 text-sm font-medium transition-colors"
            >
              Mulai Gratis
            </Link>
            <Link
              href="/login"
              className="border border-blue-400 text-white hover:bg-blue-600 rounded-lg px-6 py-2.5 text-sm font-medium transition-colors"
            >
              Lihat Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
            
            {/* Kiri - Social Links */}
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <a
                href="mailto:smarttask.team@gmail.com"
                className="text-slate-400 hover:text-slate-600 transition-colors"
                title="Email"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <a
                href="https://github.com/zainabaznur"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-600 transition-colors"
                title="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>

            {/* Tengah - Copyright */}
            <div className="text-center">
              <p className="text-xs text-slate-400">
                &copy; {new Date().getFullYear()} Smart Task. Dibuat untuk mahasiswa Indonesia.
              </p>
            </div>

            {/* Kanan - Lokasi */}
            <div className="flex items-center gap-1 justify-center md:justify-end text-xs text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Jakarta, Indonesia
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}