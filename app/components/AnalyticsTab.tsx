"use client";

import { MACHINES, SPARKLINE_DATA } from "../data/machineData";
import { LineChart, BarChart, Sparkline } from "./Charts";

// Failure mode analysis
const failureModes = [
  { label: "Overheating", count: 34, color: "var(--status-critical)" },
  { label: "Getaran Berlebih", count: 28, color: "var(--status-warning)" },
  { label: "Tekanan Abnormal", count: 19, color: "var(--accent-orange)" },
  { label: "Oli Rendah", count: 15, color: "var(--accent-yellow)" },
  { label: "Kegagalan Listrik", count: 10, color: "var(--accent-purple)" },
  { label: "Keausan Mekanik", count: 8, color: "var(--accent-cyan)" },
];

// Weekly downtime data
const weeklyDowntime = [
  { label: "Sen", value: 2.5, color: "var(--status-warning)" },
  { label: "Sel", value: 1.2, color: "var(--status-online)" },
  { label: "Rab", value: 3.8, color: "var(--status-critical)" },
  { label: "Kam", value: 0.8, color: "var(--status-online)" },
  { label: "Jum", value: 4.1, color: "var(--status-critical)" },
  { label: "Sab", value: 1.5, color: "var(--status-warning)" },
  { label: "Min", value: 0.5, color: "var(--status-online)" },
];

// MTBF data per machine type
const mtbfData = [
  { label: "CNC", value: 720, color: "var(--accent-blue)" },
  { label: "Hidraulik", value: 480, color: "var(--status-warning)" },
  { label: "Kompresor", value: 360, color: "var(--status-critical)" },
  { label: "Konveyor", value: 1200, color: "var(--status-online)" },
  { label: "Robot", value: 840, color: "var(--accent-purple)" },
  { label: "Boiler", value: 600, color: "var(--accent-cyan)" },
];

// Predictive health scores per machine
const healthTrendData = {
  label: "Health Score Trend (30 hari)",
  values: [88, 87, 85, 86, 84, 83, 81, 80, 79, 78, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60, 59, 58, 57],
};

const DAYS_30 = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - 29 + i);
  return i % 5 === 0 ? `${d.getDate()}/${d.getMonth() + 1}` : "";
});

// OEE metrics
const oeeData = {
  availability: 87.3,
  performance: 82.1,
  quality: 95.6,
  oee: 68.6,
};

export default function AnalyticsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* OEE Section */}
      <div>
        <h2 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>
          Overall Equipment Effectiveness (OEE)
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
          {[
            { label: "Availability", value: oeeData.availability, desc: "% waktu mesin tersedia", target: 90, color: "var(--accent-blue)" },
            { label: "Performance", value: oeeData.performance, desc: "% kecepatan aktual vs ideal", target: 85, color: "var(--accent-cyan)" },
            { label: "Quality", value: oeeData.quality, desc: "% produk tanpa cacat", target: 98, color: "var(--status-online)" },
            { label: "OEE Total", value: oeeData.oee, desc: "Efektivitas keseluruhan", target: 75, color: "var(--accent-purple)" },
          ].map((metric) => {
            const isAboveTarget = metric.value >= metric.target;
            return (
              <div
                key={metric.label}
                className="glass-card"
                style={{ padding: "1.25rem", textAlign: "center" }}
              >
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
                  {metric.label}
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: isAboveTarget ? metric.color : "var(--status-warning)",
                    lineHeight: 1,
                    marginBottom: "0.375rem",
                  }}
                >
                  {metric.value}%
                </div>
                <div className="progress-bar" style={{ marginBottom: "0.5rem" }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${metric.value}%`,
                      background: isAboveTarget ? metric.color : "var(--status-warning)",
                    }}
                  />
                </div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
                  Target: {metric.target}%{" "}
                  <span style={{ color: isAboveTarget ? "var(--status-online)" : "var(--status-warning)" }}>
                    {isAboveTarget ? "✓" : "↓"}
                  </span>
                </div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  {metric.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* Health trend */}
        <div className="glass-card" style={{ padding: "1.25rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Prediksi Degradasi Mesin
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              Rata-rata health score fleet — 30 hari terakhir
            </div>
          </div>
          <LineChart
            data={[healthTrendData]}
            labels={DAYS_30}
            colors={["var(--status-critical)"]}
            height={160}
            yMax={100}
          />
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.625rem",
              background: "rgba(248, 81, 73, 0.08)",
              border: "1px solid rgba(248, 81, 73, 0.2)",
              borderRadius: "8px",
              fontSize: "0.72rem",
              color: "var(--status-critical)",
            }}
          >
            ⚠ Proyeksi: Jika tren berlanjut, health score akan mencapai 40% dalam ~25 hari.
            Pemeliharaan preventif segera diperlukan.
          </div>
        </div>

        {/* Weekly downtime */}
        <div className="glass-card" style={{ padding: "1.25rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Downtime Mingguan
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              Total jam berhenti per hari (jam/hari)
            </div>
          </div>
          <BarChart data={weeklyDowntime} height={160} maxValue={6} unit="j" />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.75rem" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--status-critical)" }}>14.4j</div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Total Minggu Ini</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--status-warning)" }}>2.06j</div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Rata-rata/Hari</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--status-online)" }}>9.6j</div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Minggu Lalu</div>
            </div>
          </div>
        </div>
      </div>

      {/* Failure mode + MTBF */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* Failure mode analysis */}
        <div className="glass-card" style={{ padding: "1.25rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Analisis Mode Kegagalan
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              Frekuensi penyebab gangguan — 90 hari terakhir
            </div>
          </div>
          {failureModes.map((f, i) => {
            const total = failureModes.reduce((a, b) => a + b.count, 0);
            const pct = ((f.count / total) * 100).toFixed(1);
            return (
              <div key={f.label} style={{ marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", width: "16px", textAlign: "right" }}>
                      {i + 1}.
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{f.label}</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "baseline" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: f.color }}>{f.count}</span>
                    <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{pct}%</span>
                  </div>
                </div>
                <div className="progress-bar" style={{ height: "5px" }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${pct}%`,
                      background: f.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* MTBF per machine type */}
        <div className="glass-card" style={{ padding: "1.25rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>
              MTBF per Tipe Mesin
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              Mean Time Between Failures (jam)
            </div>
          </div>
          <BarChart data={mtbfData} height={180} unit="j" />
        </div>
      </div>

      {/* Machine performance table */}
      <div className="glass-card" style={{ padding: "1.25rem" }}>
        <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>
          Ringkasan Performa Mesin
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            role="table"
            aria-label="Performa mesin"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.8rem",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-primary)" }}>
                {["Mesin", "Health", "Efisiensi", "Uptime", "Downtime", "Alert", "Tren"].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    style={{
                      textAlign: "left",
                      padding: "0.625rem 0.75rem",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MACHINES.map((m, i) => (
                <tr
                  key={m.id}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                    transition: "background 0.1s",
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(56,139,253,0.05)";
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)";
                  }}
                >
                  <td style={{ padding: "0.625rem 0.75rem" }}>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{m.name}</div>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{m.id}</div>
                  </td>
                  <td style={{ padding: "0.625rem 0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div className="progress-bar" style={{ width: "60px", height: "4px" }}>
                        <div
                          className="progress-fill"
                          style={{
                            width: `${m.healthScore}%`,
                            background:
                              m.healthScore >= 80
                                ? "var(--status-online)"
                                : m.healthScore >= 60
                                ? "var(--status-warning)"
                                : "var(--status-critical)",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          color:
                            m.healthScore >= 80
                              ? "var(--status-online)"
                              : m.healthScore >= 60
                              ? "var(--status-warning)"
                              : "var(--status-critical)",
                        }}
                      >
                        {m.healthScore}%
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "0.625rem 0.75rem", color: "var(--text-secondary)" }}>{m.efficiency}%</td>
                  <td style={{ padding: "0.625rem 0.75rem", color: "var(--text-secondary)" }}>{m.uptime}%</td>
                  <td style={{ padding: "0.625rem 0.75rem", color: "var(--text-secondary)" }}>
                    {((100 - m.uptime) / 100 * 720).toFixed(1)}j
                  </td>
                  <td style={{ padding: "0.625rem 0.75rem" }}>
                    {m.alerts > 0 ? (
                      <span
                        style={{
                          background: "rgba(248,81,73,0.1)",
                          color: "var(--status-critical)",
                          border: "1px solid rgba(248,81,73,0.2)",
                          padding: "1px 6px",
                          borderRadius: "999px",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                        }}
                      >
                        {m.alerts}
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: "0.625rem 0.75rem" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color:
                          m.trend === "improving"
                            ? "var(--status-online)"
                            : m.trend === "degrading"
                            ? "var(--status-critical)"
                            : "var(--text-muted)",
                      }}
                    >
                      {m.trend === "improving" ? "↑ Membaik" : m.trend === "degrading" ? "↓ Memburuk" : "→ Stabil"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
