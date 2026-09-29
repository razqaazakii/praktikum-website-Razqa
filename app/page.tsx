"use client";

import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import DashboardTab from "./components/DashboardTab";
import MachinesTab from "./components/MachinesTab";
import AlertsTab from "./components/AlertsTab";
import AnalyticsTab from "./components/AnalyticsTab";
import MaintenanceTab from "./components/MaintenanceTab";

type Tab = "dashboard" | "machines" | "alerts" | "analytics" | "maintenance" | "settings";

// ===== SETTINGS TAB (placeholder) =====
function SettingsTab() {
  const settings = [
    {
      group: "Ambang Batas Sensor",
      items: [
        { label: "Suhu Kritis (°C)", id: "thresh-temp-crit", defaultVal: "100", type: "number" },
        { label: "Suhu Peringatan (°C)", id: "thresh-temp-warn", defaultVal: "85", type: "number" },
        { label: "Getaran Kritis (mm/s)", id: "thresh-vib-crit", defaultVal: "8", type: "number" },
        { label: "Getaran Peringatan (mm/s)", id: "thresh-vib-warn", defaultVal: "5", type: "number" },
        { label: "Oli Minimum (%)", id: "thresh-oil-min", defaultVal: "20", type: "number" },
      ],
    },
    {
      group: "Notifikasi",
      items: [
        { label: "Email Notifikasi", id: "notif-email", defaultVal: "admin@razqatech.com", type: "email" },
        { label: "Interval Pembaruan Data (detik)", id: "notif-interval", defaultVal: "5", type: "number" },
        { label: "Nomor WhatsApp Darurat", id: "notif-wa", defaultVal: "+62 812-XXXX-XXXX", type: "tel" },
      ],
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "600px" }}>
      {settings.map((group) => (
        <div key={group.group} className="glass-card" style={{ padding: "1.5rem" }}>
          <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
            {group.group}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {group.items.map((item) => (
              <div key={item.id}>
                <label
                  htmlFor={item.id}
                  style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "0.375rem", fontWeight: 500 }}
                >
                  {item.label}
                </label>
                <input
                  id={item.id}
                  type={item.type}
                  defaultValue={item.defaultVal}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "8px",
                    padding: "0.625rem 0.875rem",
                    color: "var(--text-primary)",
                    fontSize: "0.875rem",
                    outline: "none",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--border-accent)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border-primary)")}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        id="settings-save-btn"
        style={{
          background: "linear-gradient(135deg, var(--accent-blue), #1a4a8a)",
          border: "none",
          borderRadius: "10px",
          padding: "0.875rem 1.5rem",
          color: "white",
          fontSize: "0.875rem",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(56,139,253,0.3)",
          transition: "all 0.15s",
          alignSelf: "flex-start",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(56,139,253,0.4)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(56,139,253,0.3)";
        }}
      >
        Simpan Pengaturan
      </button>
    </div>
  );
}

// ===== MAIN PAGE =====
export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [lastUpdated, setLastUpdated] = useState("");
  const [sidebarWidth, setSidebarWidth] = useState(260);

  // Simulate real-time updates
  useEffect(() => {
    const updateTime = () => {
      setLastUpdated(
        new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 5000);
    return () => clearInterval(interval);
  }, []);

  // Sidebar responsive observer
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) setSidebarWidth(72);
      else setSidebarWidth(260);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab onNavigate={(tab) => setActiveTab(tab as Tab)} />;
      case "machines":
        return <MachinesTab />;
      case "alerts":
        return <AlertsTab />;
      case "analytics":
        return <AnalyticsTab />;
      case "maintenance":
        return <MaintenanceTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <DashboardTab onNavigate={(tab) => setActiveTab(tab as Tab)} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as Tab)}
      />

      {/* Main content */}
      <div
        style={{
          flex: 1,
          marginLeft: `${sidebarWidth}px`,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          transition: "margin-left 0.25s ease",
        }}
      >
        {/* Sticky navbar */}
        <Navbar activeTab={activeTab} lastUpdated={lastUpdated} />

        {/* Page content */}
        <main
          id="main-content"
          role="main"
          style={{
            flex: 1,
            padding: "1.5rem",
            maxWidth: "1600px",
            width: "100%",
          }}
        >
          {renderTab()}
        </main>

        {/* Footer */}
        <footer
          style={{
            borderTop: "1px solid var(--border-primary)",
            padding: "0.75rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.72rem",
            color: "var(--text-muted)",
          }}
        >
          <span>© 2026 MachineVision Pro · Razqa Tech · Semua hak cipta dilindungi</span>
          <span className="font-mono">
            v1.0.0 · Sistem aktif · Latensi sensor: &lt;50ms
          </span>
        </footer>
      </div>
    </div>
  );
}