"use client";

import { useState } from "react";

// ===== TYPES =====
export type MachineStatus =
  | "online"
  | "warning"
  | "critical"
  | "offline"
  | "maintenance";

export interface Machine {
  id: string;
  name: string;
  type: string;
  location: string;
  status: MachineStatus;
  temperature: number;
  vibration: number;
  pressure: number;
  rpm: number;
  efficiency: number;
  uptime: number;
  lastMaintenance: string;
  nextMaintenance: string;
  healthScore: number;
  alerts: number;
  powerConsumption: number;
  oilLevel: number;
  trend: "stable" | "improving" | "degrading";
}

export interface Alert {
  id: string;
  machineId: string;
  machineName: string;
  severity: "critical" | "warning" | "info";
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

// ===== MOCK DATA =====
export const MACHINES: Machine[] = [
  {
    id: "M001",
    name: "CNC Lathe Alpha",
    type: "CNC Machine",
    location: "Line A - Bay 1",
    status: "online",
    temperature: 68,
    vibration: 2.1,
    pressure: 145,
    rpm: 1800,
    efficiency: 94,
    uptime: 99.1,
    lastMaintenance: "2026-09-10",
    nextMaintenance: "2026-10-10",
    healthScore: 96,
    alerts: 0,
    powerConsumption: 22.4,
    oilLevel: 88,
    trend: "stable",
  },
  {
    id: "M002",
    name: "Hydraulic Press B2",
    type: "Hydraulic Press",
    location: "Line B - Bay 2",
    status: "warning",
    temperature: 87,
    vibration: 4.8,
    pressure: 210,
    rpm: 0,
    efficiency: 74,
    uptime: 91.3,
    lastMaintenance: "2026-08-15",
    nextMaintenance: "2026-09-15",
    healthScore: 61,
    alerts: 3,
    powerConsumption: 45.2,
    oilLevel: 52,
    trend: "degrading",
  },
  {
    id: "M003",
    name: "Conveyor Belt C3",
    type: "Conveyor System",
    location: "Assembly - Line C",
    status: "online",
    temperature: 42,
    vibration: 1.2,
    pressure: 0,
    rpm: 320,
    efficiency: 97,
    uptime: 99.8,
    lastMaintenance: "2026-09-20",
    nextMaintenance: "2026-11-20",
    healthScore: 98,
    alerts: 0,
    powerConsumption: 8.6,
    oilLevel: 95,
    trend: "stable",
  },
  {
    id: "M004",
    name: "Industrial Compressor D4",
    type: "Air Compressor",
    location: "Utility Room D",
    status: "critical",
    temperature: 112,
    vibration: 9.6,
    pressure: 280,
    rpm: 2200,
    efficiency: 48,
    uptime: 72.4,
    lastMaintenance: "2026-07-01",
    nextMaintenance: "2026-08-01",
    healthScore: 31,
    alerts: 7,
    powerConsumption: 78.9,
    oilLevel: 18,
    trend: "degrading",
  },
  {
    id: "M005",
    name: "Welding Robot E5",
    type: "Robotic Arm",
    location: "Welding Station E",
    status: "online",
    temperature: 55,
    vibration: 3.2,
    pressure: 0,
    rpm: 0,
    efficiency: 91,
    uptime: 97.5,
    lastMaintenance: "2026-09-05",
    nextMaintenance: "2026-10-05",
    healthScore: 89,
    alerts: 1,
    powerConsumption: 32.1,
    oilLevel: 76,
    trend: "stable",
  },
  {
    id: "M006",
    name: "Milling Machine F6",
    type: "CNC Machine",
    location: "Line F - Bay 6",
    status: "maintenance",
    temperature: 25,
    vibration: 0,
    pressure: 0,
    rpm: 0,
    efficiency: 0,
    uptime: 85.2,
    lastMaintenance: "2026-09-29",
    nextMaintenance: "2026-10-29",
    healthScore: 55,
    alerts: 0,
    powerConsumption: 0,
    oilLevel: 62,
    trend: "improving",
  },
  {
    id: "M007",
    name: "Injection Mold G7",
    type: "Injection Molding",
    location: "Plastics - Bay G",
    status: "online",
    temperature: 195,
    vibration: 1.8,
    pressure: 850,
    rpm: 0,
    efficiency: 88,
    uptime: 96.3,
    lastMaintenance: "2026-09-12",
    nextMaintenance: "2026-10-12",
    healthScore: 84,
    alerts: 0,
    powerConsumption: 65.3,
    oilLevel: 91,
    trend: "stable",
  },
  {
    id: "M008",
    name: "Boiler Unit H8",
    type: "Steam Boiler",
    location: "Power Plant H",
    status: "warning",
    temperature: 165,
    vibration: 2.9,
    pressure: 520,
    rpm: 0,
    efficiency: 79,
    uptime: 94.1,
    lastMaintenance: "2026-09-01",
    nextMaintenance: "2026-10-01",
    healthScore: 70,
    alerts: 2,
    powerConsumption: 120.5,
    oilLevel: 84,
    trend: "stable",
  },
  {
    id: "M009",
    name: "Pump Station I9",
    type: "Centrifugal Pump",
    location: "Utility Block I",
    status: "offline",
    temperature: 22,
    vibration: 0,
    pressure: 0,
    rpm: 0,
    efficiency: 0,
    uptime: 61.8,
    lastMaintenance: "2026-08-20",
    nextMaintenance: "2026-09-20",
    healthScore: 20,
    alerts: 5,
    powerConsumption: 0,
    oilLevel: 30,
    trend: "degrading",
  },
];

export const ALERTS: Alert[] = [
  {
    id: "A001",
    machineId: "M004",
    machineName: "Industrial Compressor D4",
    severity: "critical",
    message: "Suhu mesin melebihi batas kritis (112°C). Segera hentikan operasi!",
    timestamp: "2026-09-29T11:42:00",
    acknowledged: false,
  },
  {
    id: "A002",
    machineId: "M004",
    machineName: "Industrial Compressor D4",
    severity: "critical",
    message: "Level getaran ekstrem terdeteksi: 9.6 mm/s (ambang: 7.5 mm/s)",
    timestamp: "2026-09-29T11:40:00",
    acknowledged: false,
  },
  {
    id: "A003",
    machineId: "M009",
    machineName: "Pump Station I9",
    severity: "critical",
    message: "Mesin offline - koneksi sensor terputus selama 4 jam 22 menit",
    timestamp: "2026-09-29T07:20:00",
    acknowledged: false,
  },
  {
    id: "A004",
    machineId: "M002",
    machineName: "Hydraulic Press B2",
    severity: "warning",
    message: "Level oli rendah: 52% (minimum: 40%). Jadwalkan pengisian.",
    timestamp: "2026-09-29T10:15:00",
    acknowledged: false,
  },
  {
    id: "A005",
    machineId: "M002",
    machineName: "Hydraulic Press B2",
    severity: "warning",
    message: "Tekanan hidraulik melebihi batas operasi normal: 210 bar",
    timestamp: "2026-09-29T09:50:00",
    acknowledged: true,
  },
  {
    id: "A006",
    machineId: "M008",
    machineName: "Boiler Unit H8",
    severity: "warning",
    message: "Efisiensi pembakaran menurun: 79% (target: ≥85%)",
    timestamp: "2026-09-29T08:30:00",
    acknowledged: true,
  },
  {
    id: "A007",
    machineId: "M005",
    machineName: "Welding Robot E5",
    severity: "info",
    message: "Jadwal kalibrasi torch welding dalam 5 hari",
    timestamp: "2026-09-29T06:00:00",
    acknowledged: true,
  },
];

// ===== SPARKLINE DATA =====
export const SPARKLINE_DATA = {
  temperature: [65, 67, 68, 72, 71, 68, 70, 69, 71, 73, 74, 72],
  vibration: [2.1, 2.3, 2.0, 3.1, 4.2, 5.8, 6.1, 7.2, 8.0, 8.9, 9.2, 9.6],
  efficiency: [97, 96, 94, 92, 88, 84, 82, 79, 75, 72, 68, 61],
  production: [82, 85, 88, 90, 87, 84, 89, 92, 88, 85, 86, 88],
};

// ===== HELPER HOOKS =====
export function useRealTimeData() {
  // In a real app, this would connect to WebSocket or SSE
  return {
    lastUpdated: new Date().toLocaleTimeString("id-ID"),
    connectionStatus: "connected" as const,
  };
}

// ===== STATUS HELPERS =====
export function getStatusLabel(status: MachineStatus): string {
  const labels: Record<MachineStatus, string> = {
    online: "Online",
    warning: "Peringatan",
    critical: "Kritis",
    offline: "Offline",
    maintenance: "Pemeliharaan",
  };
  return labels[status];
}

export function getHealthColor(score: number): string {
  if (score >= 80) return "var(--status-online)";
  if (score >= 60) return "var(--status-warning)";
  if (score >= 40) return "var(--accent-orange)";
  return "var(--status-critical)";
}

export function getProgressColor(value: number, max: number): string {
  const pct = (value / max) * 100;
  if (pct < 60) return "var(--status-online)";
  if (pct < 80) return "var(--status-warning)";
  return "var(--status-critical)";
}
