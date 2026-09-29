"use client";

import { useState } from "react";

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: "machines",
    label: "Mesin",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
        <circle cx="12" cy="12" r="7" />
      </svg>
    ),
  },
  {
    id: "alerts",
    label: "Peringatan",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    badge: 3,
  },
  {
    id: "analytics",
    label: "Analitik",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: "maintenance",
    label: "Pemeliharaan",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Pengaturan",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="sidebar"
      style={{ width: collapsed ? "72px" : "260px" }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div
        style={{
          padding: "1.25rem 1rem",
          borderBottom: "1px solid var(--border-primary)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          justifyContent: collapsed ? "center" : "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Logo icon */}
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #388bfd, #1a4a8a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 16px rgba(56,139,253,0.4)",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {!collapsed && (
            <div className="logo-text">
              <div
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  lineHeight: 1.1,
                }}
              >
                MachineVision
              </div>
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "var(--accent-blue)",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                PRO
              </div>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            id="sidebar-collapse-btn"
            onClick={() => setCollapsed(true)}
            aria-label="Collapse sidebar"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              padding: "0.25rem",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              transition: "color 0.15s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.color = "var(--text-primary)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.color = "var(--text-muted)")
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        {collapsed && (
          <button
            id="sidebar-expand-btn"
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              padding: "0.25rem",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ padding: "1rem 0.75rem", flex: 1 }}>
        {!collapsed && (
          <div className="section-title" style={{ paddingLeft: "0.5rem" }}>
            Navigasi
          </div>
        )}
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                id={`nav-${item.id}`}
                className={`sidebar-link ${activeTab === item.id ? "active" : ""}`}
                onClick={() => onTabChange(item.id)}
                aria-label={item.label}
                aria-current={activeTab === item.id ? "page" : undefined}
                style={{
                  width: "100%",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  justifyContent: collapsed ? "center" : "flex-start",
                  textAlign: "left",
                }}
              >
                <span style={{ flexShrink: 0, position: "relative" }}>
                  {item.icon}
                  {item.badge && collapsed && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-4px",
                        right: "-4px",
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        background: "var(--status-critical)",
                        fontSize: "0.6rem",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </span>
                {!collapsed && (
                  <span className="sidebar-label" style={{ flex: 1 }}>
                    {item.label}
                  </span>
                )}
                {!collapsed && item.badge && (
                  <span
                    style={{
                      background: "var(--status-critical)",
                      color: "white",
                      fontSize: "0.65rem",
                      padding: "1px 6px",
                      borderRadius: "999px",
                      fontWeight: 700,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* System status */}
      {!collapsed && (
        <div
          style={{
            padding: "1rem",
            borderTop: "1px solid var(--border-primary)",
          }}
        >
          <div
            style={{
              background: "rgba(63, 185, 80, 0.08)",
              border: "1px solid rgba(63, 185, 80, 0.2)",
              borderRadius: "10px",
              padding: "0.75rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.375rem",
              }}
            >
              <span className="pulse-dot pulse-green" />
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--status-online)",
                }}
              >
                Sistem Aktif
              </span>
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--text-muted)",
              }}
            >
              9 mesin terhubung
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
