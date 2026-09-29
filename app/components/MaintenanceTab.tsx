"use client";

import { useState } from "react";
import { MACHINES } from "../data/machineData";

interface MaintenanceTask {
  id: string;
  machineId: string;
  machineName: string;
  taskType: "preventive" | "corrective" | "predictive" | "inspection";
  description: string;
  scheduledDate: string;
  estimatedDuration: string;
  assignedTo: string;
  priority: "high" | "medium" | "low";
  status: "overdue" | "upcoming" | "scheduled" | "in-progress" | "completed";
}

const MAINTENANCE_TASKS: MaintenanceTask[] = [
  {
    id: "MT001",
    machineId: "M004",
    machineName: "Industrial Compressor D4",
    taskType: "corrective",
    description: "Penggantian seal kompresor yang bocor & flush oli — kondisi kritis",
    scheduledDate: "2026-09-29",
    estimatedDuration: "6 jam",
    assignedTo: "Tim A - Budi Santoso",
    priority: "high",
    status: "overdue",
  },
  {
    id: "MT002",
    machineId: "M009",
    machineName: "Pump Station I9",
    taskType: "corrective",
    description: "Perbaikan sistem kelistrikan pompa dan reconneksi sensor",
    scheduledDate: "2026-09-29",
    estimatedDuration: "4 jam",
    assignedTo: "Tim B - Agus Wijaya",
    priority: "high",
    status: "in-progress",
  },
  {
    id: "MT003",
    machineId: "M002",
    machineName: "Hydraulic Press B2",
    taskType: "preventive",
    description: "Pengisian oli hidraulik dan inspeksi seal tekanan",
    scheduledDate: "2026-09-30",
    estimatedDuration: "2 jam",
    assignedTo: "Tim A - Budi Santoso",
    priority: "high",
    status: "upcoming",
  },
  {
    id: "MT004",
    machineId: "M006",
    machineName: "Milling Machine F6",
    taskType: "preventive",
    description: "Penggantian spindle bearing dan kalibrasi CNC",
    scheduledDate: "2026-09-29",
    estimatedDuration: "8 jam",
    assignedTo: "Tim C - Dewi Rahayu",
    priority: "medium",
    status: "in-progress",
  },
  {
    id: "MT005",
    machineId: "M008",
    machineName: "Boiler Unit H8",
    taskType: "predictive",
    description: "Inspeksi dan pembersihan ruang bakar berdasarkan tren efisiensi",
    scheduledDate: "2026-10-01",
    estimatedDuration: "5 jam",
    assignedTo: "Tim D - Rudi Hermanto",
    priority: "medium",
    status: "scheduled",
  },
  {
    id: "MT006",
    machineId: "M001",
    machineName: "CNC Lathe Alpha",
    taskType: "inspection",
    description: "Inspeksi rutin bulanan — cek backlash, level pelumas, coolant",
    scheduledDate: "2026-10-10",
    estimatedDuration: "2 jam",
    assignedTo: "Tim C - Dewi Rahayu",
    priority: "low",
    status: "scheduled",
  },
  {
    id: "MT007",
    machineId: "M005",
    machineName: "Welding Robot E5",
    taskType: "preventive",
    description: "Kalibrasi torch welding dan penggantian nozzle",
    scheduledDate: "2026-10-05",
    estimatedDuration: "3 jam",
    assignedTo: "Tim B - Agus Wijaya",
    priority: "low",
    status: "scheduled",
  },
];

const TASK_TYPE_CONFIG = {
  preventive: { label: "Preventif", color: "var(--accent-blue)", bg: "rgba(56,139,253,0.1)" },
  corrective: { label: "Korektif", color: "var(--status-critical)", bg: "rgba(248,81,73,0.1)" },
  predictive: { label: "Prediktif", color: "var(--accent-purple)", bg: "rgba(188,140,255,0.1)" },
  inspection: { label: "Inspeksi", color: "var(--accent-cyan)", bg: "rgba(57,197,207,0.1)" },
};

const STATUS_CONFIG = {
  overdue: { label: "Terlambat", color: "var(--status-critical)", bg: "rgba(248,81,73,0.1)" },
  upcoming: { label: "Segera", color: "var(--status-warning)", bg: "rgba(210,153,34,0.1)" },
  scheduled: { label: "Terjadwal", color: "var(--accent-blue)", bg: "rgba(56,139,253,0.1)" },
  "in-progress": { label: "Berjalan", color: "var(--status-maintenance)", bg: "rgba(188,140,255,0.1)" },
  completed: { label: "Selesai", color: "var(--status-online)", bg: "rgba(63,185,80,0.1)" },
};

export default function MaintenanceTab() {
  const [filter, setFilter] = useState<"all" | MaintenanceTask["status"]>("all");

  const filtered = MAINTENANCE_TASKS.filter(
    (t) => filter === "all" || t.status === filter
  );

  const overdue = MAINTENANCE_TASKS.filter((t) => t.status === "overdue").length;
  const upcoming = MAINTENANCE_TASKS.filter((t) => t.status === "upcoming").length;
  const inProgress = MAINTENANCE_TASKS.filter((t) => t.status === "in-progress").length;
  const scheduled = MAINTENANCE_TASKS.filter((t) => t.status === "scheduled").length;

  const filterBtns: { label: string; value: "all" | MaintenanceTask["status"]; count: number; color: string }[] = [
    { label: "Semua", value: "all", count: MAINTENANCE_TASKS.length, color: "var(--accent-blue)" },
    { label: "Terlambat", value: "overdue", count: overdue, color: "var(--status-critical)" },
    { label: "Segera", value: "upcoming", count: upcoming, color: "var(--status-warning)" },
    { label: "Berjalan", value: "in-progress", count: inProgress, color: "var(--status-maintenance)" },
    { label: "Terjadwal", value: "scheduled", count: scheduled, color: "var(--accent-blue)" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {[
          { label: "Tugas Terlambat", value: overdue, color: "var(--status-critical)", icon: "⏰" },
          { label: "Berjalan Sekarang", value: inProgress, color: "var(--status-maintenance)", icon: "🔧" },
          { label: "Segera (≤3 hari)", value: upcoming, color: "var(--status-warning)", icon: "📅" },
          { label: "Terjadwal", value: scheduled, color: "var(--accent-blue)", icon: "📋" },
        ].map((s) => (
          <div key={s.label} className="glass-card" style={{ padding: "1rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>{s.icon}</div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {filterBtns.map((f) => (
          <button
            key={f.value}
            id={`maint-filter-${f.value}`}
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
            <span
              style={{
                background: filter === f.value ? f.color : "rgba(255,255,255,0.08)",
                color: filter === f.value ? "white" : "var(--text-muted)",
                borderRadius: "999px",
                padding: "0px 5px",
                fontSize: "0.65rem",
                fontWeight: 700,
              }}
            >
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="glass-card" style={{ padding: "1.25rem" }}>
        <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>
          Daftar Tugas Pemeliharaan
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filtered.map((task) => {
            const typeConfig = TASK_TYPE_CONFIG[task.taskType];
            const statusConfig = STATUS_CONFIG[task.status];
            const priorityColor =
              task.priority === "high"
                ? "var(--status-critical)"
                : task.priority === "medium"
                ? "var(--status-warning)"
                : "var(--accent-blue)";

            return (
              <div
                key={task.id}
                id={`maint-task-${task.id}`}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${
                    task.status === "overdue" ? "rgba(248,81,73,0.25)" : "var(--border-primary)"
                  }`,
                  borderRadius: "12px",
                  padding: "1rem 1.25rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  transition: "all 0.15s",
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(56,139,253,0.04)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-accent)";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    task.status === "overdue" ? "rgba(248,81,73,0.25)" : "var(--border-primary)";
                }}
              >
                {/* Priority indicator */}
                <div
                  style={{
                    width: "4px",
                    alignSelf: "stretch",
                    borderRadius: "2px",
                    background: priorityColor,
                    flexShrink: 0,
                  }}
                />

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "0.75rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                        <span
                          style={{
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            color: typeConfig.color,
                            background: typeConfig.bg,
                            padding: "2px 8px",
                            borderRadius: "999px",
                            border: `1px solid ${typeConfig.color}30`,
                          }}
                        >
                          {typeConfig.label}
                        </span>
                        <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{task.id}</span>
                      </div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>
                        {task.machineName}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                        {task.description}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: statusConfig.color,
                        background: statusConfig.bg,
                        padding: "3px 10px",
                        borderRadius: "999px",
                        border: `1px solid ${statusConfig.color}30`,
                        flexShrink: 0,
                      }}
                    >
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Meta info */}
                  <div
                    style={{
                      display: "flex",
                      gap: "1.5rem",
                      flexWrap: "wrap",
                      marginTop: "0.625rem",
                    }}
                  >
                    {[
                      {
                        label: "Tanggal",
                        value: new Date(task.scheduledDate).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }),
                        icon: "📅",
                      },
                      { label: "Durasi", value: task.estimatedDuration, icon: "⏱" },
                      { label: "Teknisi", value: task.assignedTo, icon: "👤" },
                    ].map((meta) => (
                      <div key={meta.label} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        <span style={{ fontSize: "0.72rem" }}>{meta.icon}</span>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{meta.label}:</span>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                          {meta.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                {task.status !== "completed" && (
                  <button
                    id={`maint-action-${task.id}`}
                    aria-label={`Tindakan untuk ${task.machineName}`}
                    style={{
                      background: "rgba(56,139,253,0.1)",
                      border: "1px solid rgba(56,139,253,0.2)",
                      borderRadius: "8px",
                      padding: "0.5rem 0.875rem",
                      cursor: "pointer",
                      color: "var(--accent-blue)",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      flexShrink: 0,
                      transition: "all 0.15s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "rgba(56,139,253,0.2)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "rgba(56,139,253,0.1)";
                    }}
                  >
                    {task.status === "in-progress" ? "Update" : "Mulai"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Maintenance calendar overview */}
      <div className="glass-card" style={{ padding: "1.25rem" }}>
        <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>
          Jadwal Pemeliharaan — Oktober 2026
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.375rem" }}>
          {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
            <div
              key={d}
              style={{
                textAlign: "center",
                fontSize: "0.65rem",
                color: "var(--text-muted)",
                fontWeight: 600,
                padding: "0.25rem",
              }}
            >
              {d}
            </div>
          ))}
          {Array.from({ length: 31 }, (_, i) => {
            const day = i + 1;
            const hasMaintenance = [1, 5, 10, 12, 29].includes(day);
            const isToday = day === 29;
            return (
              <div
                key={day}
                id={`calendar-day-${day}`}
                style={{
                  textAlign: "center",
                  padding: "0.5rem 0.25rem",
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  fontWeight: isToday ? 800 : 400,
                  background: isToday
                    ? "var(--accent-blue)"
                    : hasMaintenance
                    ? "rgba(188,140,255,0.12)"
                    : "rgba(255,255,255,0.02)",
                  color: isToday
                    ? "white"
                    : hasMaintenance
                    ? "var(--status-maintenance)"
                    : "var(--text-muted)",
                  border: hasMaintenance && !isToday
                    ? "1px solid rgba(188,140,255,0.2)"
                    : "1px solid transparent",
                  cursor: hasMaintenance ? "pointer" : "default",
                  transition: "all 0.1s",
                  position: "relative",
                }}
              >
                {day}
                {hasMaintenance && !isToday && (
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      bottom: "3px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      background: "var(--status-maintenance)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.875rem", fontSize: "0.7rem" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--text-muted)" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: "var(--accent-blue)" }} />
            Hari Ini
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--text-muted)" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: "rgba(188,140,255,0.3)" }} />
            Ada Jadwal
          </span>
        </div>
      </div>
    </div>
  );
}
