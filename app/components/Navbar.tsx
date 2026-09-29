"use client";

interface NavbarProps {
  activeTab: string;
  lastUpdated: string;
}

const tabTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Dashboard Utama",
    subtitle: "Ringkasan kondisi semua mesin secara real-time",
  },
  machines: {
    title: "Monitor Mesin",
    subtitle: "Pantau kondisi detail setiap mesin",
  },
  alerts: {
    title: "Manajemen Peringatan",
    subtitle: "Kelola dan respons notifikasi kondisi mesin",
  },
  analytics: {
    title: "Analitik & Laporan",
    subtitle: "Tren performa dan prediksi pemeliharaan",
  },
  maintenance: {
    title: "Jadwal Pemeliharaan",
    subtitle: "Rencanakan dan kelola pemeliharaan preventif",
  },
  settings: {
    title: "Pengaturan Sistem",
    subtitle: "Konfigurasi ambang batas dan notifikasi",
  },
};

export default function Navbar({ activeTab, lastUpdated }: NavbarProps) {
  const info = tabTitles[activeTab] ?? tabTitles.dashboard;
  const now = new Date();
  const dateStr = now.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="navbar" role="banner">
      {/* Left - Page title */}
      <div style={{ flex: 1 }}>
        <h1
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.2,
          }}
        >
          {info.title}
        </h1>
        <p
          style={{
            fontSize: "0.72rem",
            color: "var(--text-secondary)",
            marginTop: "1px",
          }}
        >
          {info.subtitle}
        </p>
      </div>

      {/* Center - Date/time */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1px",
        }}
      >
        <div
          style={{
            fontSize: "0.75rem",
            color: "var(--text-secondary)",
          }}
        >
          {dateStr}
        </div>
        <div
          className="font-mono"
          style={{
            fontSize: "0.75rem",
            color: "var(--accent-blue)",
            fontWeight: 600,
          }}
        >
          Diperbarui: {lastUpdated}
        </div>
      </div>

      {/* Right - Actions */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "0.75rem",
        }}
      >
        {/* Connection Status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.375rem 0.75rem",
            borderRadius: "999px",
            background: "rgba(63, 185, 80, 0.1)",
            border: "1px solid rgba(63, 185, 80, 0.2)",
          }}
        >
          <span className="pulse-dot pulse-green" />
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "var(--status-online)",
            }}
          >
            Live
          </span>
        </div>

        {/* Notification bell */}
        <button
          id="navbar-notification-btn"
          aria-label="Lihat notifikasi"
          style={{
            position: "relative",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--border-primary)",
            borderRadius: "10px",
            padding: "0.5rem",
            cursor: "pointer",
            color: "var(--text-secondary)",
            transition: "all 0.15s",
            display: "flex",
            alignItems: "center",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(56,139,253,0.1)";
            e.currentTarget.style.borderColor = "var(--border-accent)";
            e.currentTarget.style.color = "var(--accent-blue)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.borderColor = "var(--border-primary)";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {/* Badge */}
          <span
            className="blink-fast"
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "var(--status-critical)",
              border: "1.5px solid var(--bg-secondary)",
            }}
          />
        </button>

        {/* User avatar */}
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #388bfd, #bc8cff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "white",
            cursor: "pointer",
            flexShrink: 0,
            boxShadow: "0 0 12px rgba(56,139,253,0.3)",
          }}
          title="Admin Operator"
        >
          AO
        </div>
      </div>
    </header>
  );
}
