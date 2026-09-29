"use client";

import { useState } from "react";
import type { Machine, Alert } from "../data/machineData";
import { ALERTS, getStatusLabel, getHealthColor } from "../data/machineData";
import { CircularGauge, Sparkline } from "./Charts";

// ===== MACHINE CARD =====
interface MachineCardProps {
  machine: Machine;
  onClick: (machine: Machine) => void;
  selected: boolean;
}

const TEMP_SPARK = [55, 60, 62, 65, 68, 71, 74, 78, 82, 87, 90, 87]; // generic warning trend
const VIB_SPARK = [1.2, 1.4, 1.5, 1.8, 2.0, 2.4, 3.0, 3.8, 4.2, 4.8, 5.0, 4.8];

function getSensorSpark(machineId: string, type: "temp" | "vib") {
  // Different sparklines per machine for realism
  const seed = machineId.charCodeAt(1);
  const base = type === "temp" ? 40 : 0.5;
  return Array.from({ length: 12 }, (_, i) => {
    const noise = Math.sin(i * 0.8 + seed) * 5 + Math.random() * 3;
    return Math.max(base, base + noise + i * 0.3);
  });
}

export function MachineCard({ machine, onClick, selected }: MachineCardProps) {
  const statusColorMap: Record<string, string> = {
    online: "var(--status-online)",
    warning: "var(--status-warning)",
    critical: "var(--status-critical)",
    offline: "var(--status-offline)",
    maintenance: "var(--status-maintenance)",
  };
  const statusColor = statusColorMap[machine.status];
  const tempSpark = TEMP_SPARK.map((v) => v * (machine.temperature / 90));
  const vibSpark = VIB_SPARK.map((v) => v * (machine.vibration / 5));

  return (
    <article
      id={`machine-card-${machine.id}`}
      className={`machine-card status-${machine.status}`}
      onClick={() => onClick(machine)}
      style={{
        outline: selected ? `2px solid var(--accent-blue)` : "none",
        outlineOffset: "2px",
      }}
      role="button"
      tabIndex={0}
      aria-label={`${machine.name} - Status: ${getStatusLabel(machine.status)}`}
      onKeyDown={(e) => e.key === "Enter" && onClick(machine)}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              marginBottom: "0.15rem",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              fontWeight: 500,
            }}
          >
            {machine.id}
          </div>
          <div
            style={{
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {machine.name}
          </div>
          <div
            style={{
              fontSize: "0.72rem",
              color: "var(--text-secondary)",
              marginTop: "0.1rem",
            }}
          >
            {machine.location}
          </div>
        </div>

        {/* Status badge */}
        <span className={`badge badge-${machine.status}`}>
          <span
            className={
              machine.status === "critical"
                ? "pulse-dot pulse-red"
                : machine.status === "warning"
                ? "pulse-dot pulse-yellow"
                : machine.status === "online"
                ? "pulse-dot pulse-green"
                : ""
            }
          />
          {getStatusLabel(machine.status)}
        </span>
      </div>

      {/* Health score gauge + sensors */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "0.875rem",
        }}
      >
        <CircularGauge
          value={machine.healthScore}
          size={70}
          strokeWidth={7}
          unit="%"
          label="Health"
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "0.65rem",
              color: "var(--text-muted)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.2rem",
            }}
          >
            Skor Kesehatan
          </div>
          <Sparkline
            data={[...Array(12)].map((_, i) => (machine.healthScore + Math.sin(i) * 5))}
            color={getHealthColor(machine.healthScore)}
            height={36}
          />
        </div>
      </div>

      {/* Sensor grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.5rem",
          marginBottom: "0.75rem",
        }}
      >
        <SensorItem
          label="Suhu"
          value={machine.temperature}
          unit="°C"
          warn={85}
          critical={100}
        />
        <SensorItem
          label="Getaran"
          value={machine.vibration}
          unit="mm/s"
          warn={5}
          critical={8}
        />
        <SensorItem
          label="Efisiensi"
          value={machine.efficiency}
          unit="%"
          warn={75}
          critical={60}
          reverse
        />
        <SensorItem
          label="Level Oli"
          value={machine.oilLevel}
          unit="%"
          warn={40}
          critical={20}
          reverse
        />
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "0.75rem",
          borderTop: "1px solid var(--border-primary)",
        }}
      >
        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
          Uptime:{" "}
          <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
            {machine.uptime}%
          </span>
        </div>
        {machine.alerts > 0 && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              background: "rgba(248, 81, 73, 0.12)",
              border: "1px solid rgba(248, 81, 73, 0.25)",
              color: "var(--status-critical)",
              fontSize: "0.7rem",
              fontWeight: 700,
              padding: "0.15rem 0.5rem",
              borderRadius: "999px",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"/>
            </svg>
            {machine.alerts} alert
          </span>
        )}
      </div>
    </article>
  );
}

// Sensor value display
function SensorItem({
  label,
  value,
  unit,
  warn,
  critical,
  reverse = false,
}: {
  label: string;
  value: number;
  unit: string;
  warn: number;
  critical: number;
  reverse?: boolean;
}) {
  let color = "var(--status-online)";
  if (!reverse) {
    if (value >= critical) color = "var(--status-critical)";
    else if (value >= warn) color = "var(--status-warning)";
  } else {
    if (value <= critical) color = "var(--status-critical)";
    else if (value <= warn) color = "var(--status-warning)";
  }

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid var(--border-primary)",
        borderRadius: "8px",
        padding: "0.5rem 0.625rem",
      }}
    >
      <div
        style={{
          fontSize: "0.62rem",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "0.15rem",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "0.95rem",
          fontWeight: 700,
          color,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
        <span style={{ fontSize: "0.65rem", fontWeight: 400, color: "var(--text-muted)", marginLeft: "2px" }}>
          {unit}
        </span>
      </div>
    </div>
  );
}

// ===== MACHINE DETAIL PANEL =====
interface MachineDetailProps {
  machine: Machine;
  onClose: () => void;
}

export function MachineDetail({ machine, onClose }: MachineDetailProps) {
  const machineAlerts = ALERTS.filter((a) => a.machineId === machine.id);
  const nextMaintenanceDays = Math.ceil(
    (new Date(machine.nextMaintenance).getTime() - Date.now()) / 86400000
  );

  const sensors = [
    { label: "Suhu", value: machine.temperature, unit: "°C", max: 150, warn: 85, crit: 100 },
    { label: "Getaran", value: machine.vibration, unit: "mm/s", max: 15, warn: 5, crit: 8 },
    { label: "Tekanan", value: machine.pressure, unit: "bar", max: 1000, warn: 300, crit: 500 },
    { label: "RPM", value: machine.rpm, unit: "rpm", max: 3000, warn: 2500, crit: 2800 },
    { label: "Daya", value: machine.powerConsumption, unit: "kW", max: 150, warn: 100, crit: 130 },
    { label: "Level Oli", value: machine.oilLevel, unit: "%", max: 100, warn: 40, crit: 20 },
  ];

  return (
    <div
      id="machine-detail-panel"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-primary)",
        borderRadius: "16px",
        padding: "1.5rem",
        height: "100%",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
              {machine.id}
            </span>
            <span className={`badge badge-${machine.status}`}>
              {getStatusLabel(machine.status)}
            </span>
          </div>
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: "0.15rem",
            }}
          >
            {machine.name}
          </h2>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            {machine.type} • {machine.location}
          </div>
        </div>
        <button
          id="machine-detail-close"
          onClick={onClose}
          aria-label="Tutup detail mesin"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--border-primary)",
            borderRadius: "8px",
            padding: "0.4rem",
            cursor: "pointer",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Health overview */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          padding: "1rem",
          background: "rgba(255,255,255,0.03)",
          borderRadius: "12px",
          marginBottom: "1.25rem",
          border: "1px solid var(--border-primary)",
        }}
      >
        <CircularGauge value={machine.healthScore} size={90} strokeWidth={9} unit="%" label="Health" />
        <div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>
            Skor Kesehatan Mesin
          </div>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: getHealthColor(machine.healthScore),
              lineHeight: 1,
            }}
          >
            {machine.healthScore}%
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            Tren:{" "}
            <span
              style={{
                color:
                  machine.trend === "improving"
                    ? "var(--status-online)"
                    : machine.trend === "degrading"
                    ? "var(--status-critical)"
                    : "var(--text-secondary)",
              }}
            >
              {machine.trend === "improving"
                ? "↑ Membaik"
                : machine.trend === "degrading"
                ? "↓ Memburuk"
                : "→ Stabil"}
            </span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
            Uptime 30 hari
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${machine.uptime}%`,
                  background: `linear-gradient(90deg, var(--status-online), var(--accent-cyan))`,
                }}
              />
            </div>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {machine.uptime}%
            </div>
          </div>
        </div>
      </div>

      {/* Sensor readings */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div className="section-title">Pembacaan Sensor</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
          {sensors.map((s) => {
            let barColor = "var(--status-online)";
            const pct = (s.value / s.max) * 100;
            if (s.label === "Level Oli") {
              if (s.value <= s.crit) barColor = "var(--status-critical)";
              else if (s.value <= s.warn) barColor = "var(--status-warning)";
            } else {
              if (s.value >= s.crit) barColor = "var(--status-critical)";
              else if (s.value >= s.warn) barColor = "var(--status-warning)";
            }

            return (
              <div
                key={s.label}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "10px",
                  padding: "0.75rem",
                  border: "1px solid var(--border-primary)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                    alignItems: "baseline",
                  }}
                >
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{s.label}</span>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: barColor,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {s.value}
                    <span style={{ fontSize: "0.65rem", fontWeight: 400, color: "var(--text-muted)", marginLeft: "2px" }}>
                      {s.unit}
                    </span>
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(pct, 100)}%`,
                      background: barColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Maintenance info */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div className="section-title">Jadwal Pemeliharaan</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.625rem",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: "10px",
              padding: "0.75rem",
              border: "1px solid var(--border-primary)",
            }}
          >
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.2rem" }}>
              Pemeliharaan Terakhir
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>
              {new Date(machine.lastMaintenance).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
          <div
            style={{
              background:
                nextMaintenanceDays < 0
                  ? "rgba(248, 81, 73, 0.08)"
                  : nextMaintenanceDays < 7
                  ? "rgba(210, 153, 34, 0.08)"
                  : "rgba(255,255,255,0.03)",
              borderRadius: "10px",
              padding: "0.75rem",
              border:
                nextMaintenanceDays < 0
                  ? "1px solid rgba(248,81,73,0.25)"
                  : nextMaintenanceDays < 7
                  ? "1px solid rgba(210,153,34,0.25)"
                  : "1px solid var(--border-primary)",
            }}
          >
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.2rem" }}>
              Jadwal Berikutnya
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color:
                  nextMaintenanceDays < 0
                    ? "var(--status-critical)"
                    : nextMaintenanceDays < 7
                    ? "var(--status-warning)"
                    : "var(--text-primary)",
              }}
            >
              {new Date(machine.nextMaintenance).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              {nextMaintenanceDays < 0 && (
                <span style={{ display: "block", fontSize: "0.65rem" }}>
                  Terlambat {Math.abs(nextMaintenanceDays)} hari!
                </span>
              )}
              {nextMaintenanceDays >= 0 && nextMaintenanceDays < 7 && (
                <span style={{ display: "block", fontSize: "0.65rem" }}>
                  {nextMaintenanceDays} hari lagi
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Machine alerts */}
      {machineAlerts.length > 0 && (
        <div>
          <div className="section-title">Alert Aktif ({machineAlerts.length})</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {machineAlerts.map((alert) => (
              <AlertItem key={alert.id} alert={alert} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ===== ALERT ITEM =====
interface AlertItemProps {
  alert: Alert;
  compact?: boolean;
  onAcknowledge?: (id: string) => void;
}

export function AlertItem({ alert, compact = false, onAcknowledge }: AlertItemProps) {
  const severityConfig = {
    critical: {
      color: "var(--status-critical)",
      bgClass: "alert-critical",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"/>
        </svg>
      ),
      label: "Kritis",
    },
    warning: {
      color: "var(--status-warning)",
      bgClass: "alert-warning",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L1 21h22L12 2zm0 3.516L21.03 19H2.97L12 5.516zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
        </svg>
      ),
      label: "Peringatan",
    },
    info: {
      color: "var(--accent-blue)",
      bgClass: "alert-info",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/>
        </svg>
      ),
      label: "Info",
    },
  };

  const cfg = severityConfig[alert.severity];
  const ts = new Date(alert.timestamp);
  const timeStr = ts.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const dateStr = ts.toLocaleDateString("id-ID", { day: "numeric", month: "short" });

  return (
    <div
      id={`alert-${alert.id}`}
      className={`alert-item ${cfg.bgClass}`}
      style={{ opacity: alert.acknowledged ? 0.6 : 1 }}
      role="alert"
      aria-label={`${cfg.label}: ${alert.message}`}
    >
      <div style={{ color: cfg.color, flexShrink: 0, marginTop: "1px" }}>{cfg.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {!compact && (
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
              marginBottom: "0.15rem",
            }}
          >
            {alert.machineName}
          </div>
        )}
        <div
          style={{
            fontSize: "0.8rem",
            color: "var(--text-primary)",
            lineHeight: 1.4,
          }}
        >
          {alert.message}
        </div>
        <div
          style={{
            fontSize: "0.68rem",
            color: "var(--text-muted)",
            marginTop: "0.25rem",
          }}
        >
          {dateStr} • {timeStr}
          {alert.acknowledged && (
            <span
              style={{
                marginLeft: "0.5rem",
                color: "var(--status-online)",
                fontWeight: 600,
              }}
            >
              ✓ Dikonfirmasi
            </span>
          )}
        </div>
      </div>
      {!alert.acknowledged && onAcknowledge && (
        <button
          id={`ack-alert-${alert.id}`}
          onClick={() => onAcknowledge(alert.id)}
          aria-label={`Konfirmasi alert ${alert.id}`}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--border-primary)",
            borderRadius: "6px",
            padding: "0.25rem 0.5rem",
            cursor: "pointer",
            color: "var(--text-muted)",
            fontSize: "0.65rem",
            fontWeight: 600,
            flexShrink: 0,
            transition: "all 0.15s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(63,185,80,0.1)";
            e.currentTarget.style.color = "var(--status-online)";
            e.currentTarget.style.borderColor = "rgba(63,185,80,0.3)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.color = "var(--text-muted)";
            e.currentTarget.style.borderColor = "var(--border-primary)";
          }}
        >
          Konfirmasi
        </button>
      )}
    </div>
  );
}
