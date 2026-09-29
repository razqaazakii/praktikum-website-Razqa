"use client";

import { useState } from "react";
import { ALERTS, type Alert } from "../data/machineData";
import { AlertItem } from "./MachineComponents";

export default function AlertsTab() {
  const [alerts, setAlerts] = useState(ALERTS);
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "info">("all");
  const [showAcknowledged, setShowAcknowledged] = useState(false);

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const handleAcknowledgeAll = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, acknowledged: true })));
  };

  const filtered = alerts.filter((a) => {
    const matchSeverity = filter === "all" || a.severity === filter;
    const matchAck = showAcknowledged ? true : !a.acknowledged;
    return matchSeverity && matchAck;
  });

  const critCount = alerts.filter((a) => a.severity === "critical" && !a.acknowledged).length;
  const warnCount = alerts.filter((a) => a.severity === "warning" && !a.acknowledged).length;
  const infoCount = alerts.filter((a) => a.severity === "info" && !a.acknowledged).length;

  const filterConfig = [
    { label: "Semua", value: "all" as const, count: critCount + warnCount + infoCount, color: "var(--accent-blue)" },
    { label: "Kritis", value: "critical" as const, count: critCount, color: "var(--status-critical)" },
    { label: "Peringatan", value: "warning" as const, count: warnCount, color: "var(--status-warning)" },
    { label: "Info", value: "info" as const, count: infoCount, color: "var(--accent-blue)" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Summary banner */}
      {critCount > 0 && (
        <div
          style={{
            background: "rgba(248, 81, 73, 0.08)",
            border: "1px solid rgba(248, 81, 73, 0.3)",
            borderRadius: "12px",
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
          role="alert"
          aria-live="assertive"
        >
          <div
            className="blink-fast"
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "var(--status-critical)",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--status-critical)" }}>
              {critCount} Alert Kritis Memerlukan Tindakan Segera!
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              Periksa mesin yang bermasalah dan ambil tindakan sebelum terjadi downtime.
            </div>
          </div>
          <button
            id="acknowledge-all-btn"
            onClick={handleAcknowledgeAll}
            style={{
              background: "rgba(248, 81, 73, 0.15)",
              border: "1px solid rgba(248, 81, 73, 0.3)",
              borderRadius: "8px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              color: "var(--status-critical)",
              fontSize: "0.8rem",
              fontWeight: 600,
              flexShrink: 0,
              transition: "all 0.15s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(248, 81, 73, 0.25)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(248, 81, 73, 0.15)";
            }}
          >
            Konfirmasi Semua
          </button>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        {/* Severity filter */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {filterConfig.map((f) => (
            <button
              key={f.value}
              id={`alert-filter-${f.value}`}
              onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
              style={{
                background: filter === f.value ? `${f.color}18` : "rgba(255,255,255,0.03)",
                border: filter === f.value ? `1px solid ${f.color}40` : "1px solid var(--border-primary)",
                borderRadius: "999px",
                padding: "0.375rem 0.875rem",
                cursor: "pointer",
                color: filter === f.value ? f.color : "var(--text-muted)",
                fontSize: "0.78rem",
                fontWeight: filter === f.value ? 700 : 500,
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
              }}
            >
              {f.label}
              {f.count > 0 && (
                <span
                  style={{
                    background: f.value === filter ? f.color : "rgba(255,255,255,0.08)",
                    color: f.value === filter ? "white" : "var(--text-muted)",
                    borderRadius: "999px",
                    padding: "0px 5px",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                  }}
                >
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Show acknowledged toggle */}
        <label
          htmlFor="show-acknowledged-toggle"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
            fontSize: "0.78rem",
            color: "var(--text-secondary)",
            userSelect: "none",
          }}
        >
          <div
            onClick={() => setShowAcknowledged((v) => !v)}
            id="show-acknowledged-toggle"
            role="switch"
            aria-checked={showAcknowledged}
            aria-label="Tampilkan alert yang sudah dikonfirmasi"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setShowAcknowledged((v) => !v)}
            style={{
              width: "36px",
              height: "20px",
              borderRadius: "999px",
              background: showAcknowledged ? "var(--accent-blue)" : "rgba(255,255,255,0.1)",
              position: "relative",
              transition: "background 0.15s",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "3px",
                left: showAcknowledged ? "19px" : "3px",
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                background: "white",
                transition: "left 0.15s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}
            />
          </div>
          Tampilkan yang dikonfirmasi
        </label>
      </div>

      {/* Alert list */}
      <div
        className="glass-card"
        style={{ padding: "1.25rem" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Daftar Alert{" "}
            <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: "0.8rem" }}>
              ({filtered.length} ditampilkan)
            </span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "var(--text-muted)",
              fontSize: "0.875rem",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              style={{ display: "block", margin: "0 auto 1rem", opacity: 0.3 }}
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <div>Tidak ada alert yang perlu ditampilkan.</div>
            <div style={{ fontSize: "0.75rem", marginTop: "0.25rem", opacity: 0.7 }}>
              Semua sistem berjalan normal.
            </div>
          </div>
        ) : (
          <div>
            {filtered.map((alert) => (
              <AlertItem
                key={alert.id}
                alert={alert}
                onAcknowledge={handleAcknowledge}
              />
            ))}
          </div>
        )}
      </div>

      {/* Alert Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        {[
          {
            label: "Total Alert Hari Ini",
            value: alerts.length,
            color: "var(--accent-blue)",
            icon: "📊",
          },
          {
            label: "Sudah Dikonfirmasi",
            value: alerts.filter((a) => a.acknowledged).length,
            color: "var(--status-online)",
            icon: "✅",
          },
          {
            label: "Rata-rata Respons",
            value: "8 mnt",
            color: "var(--status-warning)",
            icon: "⏱",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-card"
            style={{ padding: "1rem", textAlign: "center" }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>{stat.icon}</div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: stat.color,
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
