"use client";

import { useState } from "react";
import { MACHINES, type Machine, type MachineStatus } from "../data/machineData";
import { MachineCard, MachineDetail } from "./MachineComponents";

const STATUS_FILTERS: { label: string; value: MachineStatus | "all" }[] = [
  { label: "Semua", value: "all" },
  { label: "Online", value: "online" },
  { label: "Peringatan", value: "warning" },
  { label: "Kritis", value: "critical" },
  { label: "Offline", value: "offline" },
  { label: "Maintenance", value: "maintenance" },
];

export default function MachinesTab() {
  const [selectedStatus, setSelectedStatus] = useState<MachineStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [sortBy, setSortBy] = useState<"health" | "name" | "status">("health");

  const filtered = MACHINES.filter((m) => {
    const matchStatus = selectedStatus === "all" || m.status === selectedStatus;
    const matchSearch =
      searchQuery === "" ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  }).sort((a, b) => {
    if (sortBy === "health") return a.healthScore - b.healthScore;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "status") {
      const order = { critical: 0, offline: 1, warning: 2, maintenance: 3, online: 4 };
      return order[a.status] - order[b.status];
    }
    return 0;
  });

  const statusCounts = {
    all: MACHINES.length,
    online: MACHINES.filter((m) => m.status === "online").length,
    warning: MACHINES.filter((m) => m.status === "warning").length,
    critical: MACHINES.filter((m) => m.status === "critical").length,
    offline: MACHINES.filter((m) => m.status === "offline").length,
    maintenance: MACHINES.filter((m) => m.status === "maintenance").length,
  };

  const statusColors: Record<string, string> = {
    all: "var(--accent-blue)",
    online: "var(--status-online)",
    warning: "var(--status-warning)",
    critical: "var(--status-critical)",
    offline: "var(--status-offline)",
    maintenance: "var(--status-maintenance)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
          <div
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              pointerEvents: "none",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            id="machine-search-input"
            type="search"
            placeholder="Cari mesin, lokasi, atau tipe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Cari mesin"
            style={{
              width: "100%",
              background: "var(--bg-card)",
              border: "1px solid var(--border-primary)",
              borderRadius: "10px",
              padding: "0.625rem 0.875rem 0.625rem 2.25rem",
              color: "var(--text-primary)",
              fontSize: "0.875rem",
              outline: "none",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--border-accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-primary)")}
          />
        </div>

        {/* Sort */}
        <select
          id="machine-sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          aria-label="Urutkan mesin"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-primary)",
            borderRadius: "10px",
            padding: "0.625rem 1rem",
            color: "var(--text-secondary)",
            fontSize: "0.8rem",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option value="health">Urutkan: Health Score</option>
          <option value="status">Urutkan: Status</option>
          <option value="name">Urutkan: Nama</option>
        </select>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {STATUS_FILTERS.map((f) => {
          const count = statusCounts[f.value as keyof typeof statusCounts];
          const isActive = selectedStatus === f.value;
          const color = statusColors[f.value];
          return (
            <button
              key={f.value}
              id={`filter-${f.value}`}
              onClick={() => setSelectedStatus(f.value)}
              aria-pressed={isActive}
              style={{
                background: isActive ? `${color}18` : "rgba(255,255,255,0.03)",
                border: isActive ? `1px solid ${color}40` : "1px solid var(--border-primary)",
                borderRadius: "999px",
                padding: "0.375rem 0.875rem",
                cursor: "pointer",
                color: isActive ? color : "var(--text-muted)",
                fontSize: "0.78rem",
                fontWeight: isActive ? 700 : 500,
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
              }}
            >
              {f.label}
              <span
                style={{
                  background: isActive ? color : "rgba(255,255,255,0.08)",
                  color: isActive ? "white" : "var(--text-muted)",
                  borderRadius: "999px",
                  padding: "0px 5px",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid + Detail panel */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: selectedMachine ? "1fr 380px" : "1fr",
          gap: "1rem",
          alignItems: "start",
        }}
      >
        {/* Machine grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: selectedMachine
              ? "repeat(auto-fill, minmax(240px, 1fr))"
              : "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                gridColumn: "1/-1",
                textAlign: "center",
                padding: "3rem",
                color: "var(--text-muted)",
                fontSize: "0.875rem",
              }}
            >
              Tidak ada mesin yang cocok dengan filter.
            </div>
          ) : (
            filtered.map((machine) => (
              <MachineCard
                key={machine.id}
                machine={machine}
                onClick={(m) =>
                  setSelectedMachine(selectedMachine?.id === m.id ? null : m)
                }
                selected={selectedMachine?.id === machine.id}
              />
            ))
          )}
        </div>

        {/* Detail panel */}
        {selectedMachine && (
          <div style={{ position: "sticky", top: "80px" }}>
            <MachineDetail
              machine={selectedMachine}
              onClose={() => setSelectedMachine(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
