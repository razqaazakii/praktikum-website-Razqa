"use client";

import { MACHINES, ALERTS, SPARKLINE_DATA } from "../data/machineData";
import { MetricCard, Sparkline, LineChart, BarChart } from "./Charts";
import { AlertItem } from "./MachineComponents";

// ===== OVERVIEW STATS =====
const totalMachines = MACHINES.length;
const onlineMachines = MACHINES.filter((m) => m.status === "online").length;
const warningMachines = MACHINES.filter((m) => m.status === "warning").length;
const criticalMachines = MACHINES.filter((m) => m.status === "critical").length;
const offlineMachines = MACHINES.filter((m) => m.status === "offline").length;
const maintenanceMachines = MACHINES.filter((m) => m.status === "maintenance").length;
const avgHealthScore = Math.round(MACHINES.reduce((a, b) => a + b.healthScore, 0) / totalMachines);
const avgEfficiency = Math.round(MACHINES.filter((m) => m.status === "online" || m.status === "warning").reduce((a, b) => a + b.efficiency, 0) / (onlineMachines + warningMachines));
const totalAlerts = ALERTS.filter((a) => !a.acknowledged).length;
const criticalAlerts = ALERTS.filter((a) => a.severity === "critical" && !a.acknowledged).length;
const totalPower = MACHINES.reduce((a, b) => a + b.powerConsumption, 0).toFixed(1);

// Chart data
const HOURS = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

const efficiencyTrend = {
  label: "Efisiensi Rata-rata (%)",
  values: [92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81],
};

const tempTrend = {
  label: "Suhu Rata-rata (°C)",
  values: [61, 62, 64, 65, 67, 68, 70, 72, 74, 76, 78, 79],
};

const productionData = [
  { label: "Line A", value: 94, color: "var(--accent-blue)" },
  { label: "Line B", value: 74, color: "var(--status-warning)" },
  { label: "Line C", value: 97, color: "var(--status-online)" },
  { label: "Line D", value: 48, color: "var(--status-critical)" },
  { label: "Line E", value: 91, color: "var(--accent-purple)" },
  { label: "Line F", value: 0, color: "var(--status-offline)" },
];

const recentAlerts = ALERTS.slice(0, 4);

// ===== SUMMARY TICKER =====
const tickerMessages = [
  "⚠ M004 - Suhu kritis 112°C",
  "🔴 M009 - Mesin offline 4j 22m",
  "⚠ M002 - Level oli rendah 52%",
  "✅ M003 - Efisiensi optimal 97%",
  "ℹ M005 - Kalibrasi torch dalam 5 hari",
  "⚠ M008 - Efisiensi boiler 79% (target 85%)",
];

interface DashboardTabProps {
  onNavigate: (tab: string) => void;
}

export default function DashboardTab({ onNavigate }: DashboardTabProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Live ticker */}
      <div className="ticker-wrap">
        <div className="ticker-content">
          {tickerMessages.map((msg, i) => (
            <span
              key={i}
              style={{
                fontSize: "0.8rem",
                color: "var(--text-secondary)",
                marginRight: "3rem",
              }}
            >
              {msg}
            </span>
          ))}
          {/* Repeat for seamless loop */}
          {tickerMessages.map((msg, i) => (
            <span
              key={`r-${i}`}
              style={{
                fontSize: "0.8rem",
                color: "var(--text-secondary)",
                marginRight: "3rem",
              }}
            >
              {msg}
            </span>
          ))}
        </div>
      </div>

      {/* ── Row 1: KPI metric cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {/* Total mesin aktif */}
        <MetricCard
          id="kpi-online"
          title="Mesin Aktif"
          value={onlineMachines}
          unit={`/ ${totalMachines}`}
          subtitle={`${warningMachines} peringatan, ${maintenanceMachines} maintenance`}
          trend={+2.1}
          trendLabel="vs kemarin"
          color="green"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
            </svg>
          }
          footer={
            <div className="progress-bar" style={{ marginTop: "0.5rem" }}>
              <div
                className="progress-fill"
                style={{
                  width: `${(onlineMachines / totalMachines) * 100}%`,
                  background: "linear-gradient(90deg, var(--status-online), var(--accent-cyan))",
                }}
              />
            </div>
          }
        />

        {/* Alert kritis */}
        <MetricCard
          id="kpi-critical"
          title="Alert Kritis"
          value={criticalAlerts}
          unit="aktif"
          subtitle={`${totalAlerts} total alert belum dikonfirmasi`}
          trend={criticalAlerts > 0 ? -criticalAlerts * 10 : 0}
          trendLabel="perlu tindakan"
          color="red"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          }
          footer={
            <div style={{ marginTop: "0.5rem" }}>
              <Sparkline data={[1, 2, 1, 3, 2, 4, 3, criticalAlerts]} color="var(--status-critical)" height={32} />
            </div>
          }
        />

        {/* Rata-rata health score */}
        <MetricCard
          id="kpi-health"
          title="Health Score Rata-rata"
          value={avgHealthScore}
          unit="%"
          subtitle="Rata-rata semua mesin"
          trend={avgHealthScore >= 70 ? +1.5 : -3.2}
          trendLabel="30 hari terakhir"
          color="blue"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          }
          footer={
            <div style={{ marginTop: "0.5rem" }}>
              <Sparkline data={[88, 86, 84, 82, 80, 79, 78, 77, 76, avgHealthScore]} color="var(--accent-blue)" height={32} />
            </div>
          }
        />

        {/* Efisiensi produksi */}
        <MetricCard
          id="kpi-efficiency"
          title="Efisiensi Produksi"
          value={avgEfficiency}
          unit="%"
          subtitle="Rata-rata mesin beroperasi"
          trend={-2.3}
          trendLabel="vs target 90%"
          color="yellow"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          }
          footer={
            <div style={{ marginTop: "0.5rem" }}>
              <Sparkline data={SPARKLINE_DATA.efficiency} color="var(--status-warning)" height={32} />
            </div>
          }
        />

        {/* Daya konsumsi */}
        <MetricCard
          id="kpi-power"
          title="Konsumsi Daya"
          value={totalPower}
          unit="kW"
          subtitle="Total semua mesin"
          color="purple"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12.55a11 11 0 0 1 14.08 0" />
              <path d="M1.42 9a16 16 0 0 1 21.16 0" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
          }
          footer={
            <div style={{ marginTop: "0.5rem" }}>
              <Sparkline data={[340, 345, 350, 348, 352, 358, 362, 368, 373, 375, parseFloat(totalPower)]} color="var(--accent-purple)" height={32} />
            </div>
          }
        />

        {/* Mesin offline */}
        <MetricCard
          id="kpi-offline"
          title="Mesin Offline"
          value={offlineMachines + criticalMachines}
          unit="mesin"
          subtitle={`${criticalMachines} kritis, ${offlineMachines} mati total`}
          color="cyan"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
              <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
              <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
              <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
          }
          footer={
            <div style={{ marginTop: "0.5rem" }}>
              <div style={{ display: "flex", gap: "0.25rem" }}>
                {MACHINES.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      flex: 1,
                      height: "4px",
                      borderRadius: "2px",
                      background:
                        m.status === "online"
                          ? "var(--status-online)"
                          : m.status === "warning"
                          ? "var(--status-warning)"
                          : m.status === "critical"
                          ? "var(--status-critical)"
                          : m.status === "maintenance"
                          ? "var(--status-maintenance)"
                          : "var(--status-offline)",
                    }}
                    title={`${m.name}: ${m.status}`}
                  />
                ))}
              </div>
            </div>
          }
        />
      </div>

      {/* ── Row 2: Charts ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "1rem",
        }}
      >
        {/* Trend chart */}
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
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>
                Tren Performa Harian
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                Efisiensi & suhu rata-rata per jam — Hari ini
              </div>
            </div>
            {/* Legend */}
            <div style={{ display: "flex", gap: "1rem", fontSize: "0.72rem" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--text-secondary)" }}>
                <span style={{ width: "20px", height: "2px", background: "var(--accent-blue)", display: "inline-block", borderRadius: "1px" }} />
                Efisiensi (%)
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--text-secondary)" }}>
                <span style={{ width: "20px", height: "2px", background: "var(--status-warning)", display: "inline-block", borderRadius: "1px" }} />
                Suhu (°C)
              </span>
            </div>
          </div>
          <LineChart
            data={[efficiencyTrend, tempTrend]}
            labels={HOURS}
            colors={["var(--accent-blue)", "var(--status-warning)"]}
            height={180}
          />
        </div>

        {/* Machine status donut */}
        <div
          className="glass-card"
          style={{ padding: "1.25rem" }}
        >
          <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>
            Status Mesin
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.625rem",
            }}
          >
            {[
              { label: "Online", count: onlineMachines, color: "var(--status-online)" },
              { label: "Peringatan", count: warningMachines, color: "var(--status-warning)" },
              { label: "Kritis", count: criticalMachines, color: "var(--status-critical)" },
              { label: "Offline", count: offlineMachines, color: "var(--status-offline)" },
              { label: "Maintenance", count: maintenanceMachines, color: "var(--status-maintenance)" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.3rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: s.color,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                      {s.label}
                    </span>
                  </div>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: s.color }}>
                    {s.count}
                  </span>
                </div>
                <div className="progress-bar" style={{ height: "4px" }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${(s.count / totalMachines) * 100}%`,
                      background: s.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div
            style={{
              marginTop: "1rem",
              padding: "0.75rem",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "10px",
              border: "1px solid var(--border-primary)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)" }}>
              {Math.round((onlineMachines / totalMachines) * 100)}%
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              Availability Rate
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: Production by line + Alerts ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* Production efficiency by line */}
        <div className="glass-card" style={{ padding: "1.25rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>
                Efisiensi per Lini Produksi
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                Produktivitas saat ini (%)
              </div>
            </div>
          </div>
          <BarChart data={productionData} height={160} maxValue={100} unit="%" />
        </div>

        {/* Recent alerts */}
        <div className="glass-card" style={{ padding: "1.25rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Alert Terbaru
            </div>
            <button
              id="view-all-alerts-btn"
              onClick={() => onNavigate("alerts")}
              style={{
                background: "none",
                border: "1px solid var(--border-primary)",
                borderRadius: "6px",
                padding: "0.25rem 0.75rem",
                cursor: "pointer",
                color: "var(--accent-blue)",
                fontSize: "0.72rem",
                fontWeight: 600,
                transition: "all 0.15s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(56,139,253,0.1)";
                e.currentTarget.style.borderColor = "var(--border-accent)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.borderColor = "var(--border-primary)";
              }}
            >
              Lihat Semua
            </button>
          </div>
          <div>
            {recentAlerts.map((alert) => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
