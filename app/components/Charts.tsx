"use client";

import { getHealthColor } from "../data/machineData";

interface MetricCardProps {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  trend?: number; // percentage change
  trendLabel?: string;
  color: "blue" | "green" | "red" | "yellow" | "purple" | "cyan";
  icon: React.ReactNode;
  footer?: React.ReactNode;
}

export function MetricCard({
  id,
  title,
  value,
  unit,
  subtitle,
  trend,
  trendLabel,
  color,
  icon,
  footer,
}: MetricCardProps) {
  const trendPositive = trend !== undefined && trend >= 0;
  const trendColor = trendPositive ? "var(--status-online)" : "var(--status-critical)";

  const colorMap: Record<string, string> = {
    blue: "var(--accent-blue)",
    green: "var(--status-online)",
    red: "var(--status-critical)",
    yellow: "var(--status-warning)",
    purple: "var(--accent-purple)",
    cyan: "var(--accent-cyan)",
  };
  const accentColor = colorMap[color];

  return (
    <article
      id={id}
      className={`metric-card ${color}`}
      style={{
        boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 0 0 ${accentColor}`,
      }}
    >
      {/* Glowing bg accent */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: accentColor,
          opacity: 0.04,
          filter: "blur(30px)",
          transform: "translate(20px, -20px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "1rem",
          position: "relative",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "0.5rem",
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
            <span
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {value}
            </span>
            {unit && (
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  fontWeight: 500,
                }}
              >
                {unit}
              </span>
            )}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                marginTop: "0.25rem",
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* Icon box */}
        <div
          aria-hidden="true"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: `${accentColor}18`,
            border: `1px solid ${accentColor}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accentColor,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>

      {/* Trend */}
      {trend !== undefined && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            marginBottom: footer ? "0.75rem" : 0,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.2rem",
              padding: "0.2rem 0.5rem",
              borderRadius: "999px",
              background: `${trendColor}18`,
              border: `1px solid ${trendColor}30`,
              fontSize: "0.72rem",
              fontWeight: 700,
              color: trendColor,
            }}
          >
            {trendPositive ? (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
            {Math.abs(trend)}%
          </span>
          {trendLabel && (
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              {trendLabel}
            </span>
          )}
        </div>
      )}

      {footer && footer}
    </article>
  );
}

// ===== CIRCULAR GAUGE =====
interface CircularGaugeProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  unit?: string;
  colorOverride?: string;
}

export function CircularGauge({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  label,
  unit = "%",
  colorOverride,
}: CircularGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const offset = circumference * (1 - pct);
  const color = colorOverride || getHealthColor((value / max) * 100);

  return (
    <div
      className="circular-gauge"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label}: ${value}${unit}`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      {/* Center text */}
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          lineHeight: 1,
        }}
      >
        <span
          style={{
            fontSize: size > 70 ? "1.1rem" : "0.85rem",
            fontWeight: 800,
            color: "var(--text-primary)",
          }}
        >
          {Math.round(value)}
        </span>
        {unit && (
          <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginTop: "1px" }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

// ===== SPARKLINE CHART =====
interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  fill?: boolean;
}

export function Sparkline({
  data,
  color = "var(--accent-blue)",
  height = 48,
  fill = true,
}: SparklineProps) {
  if (!data.length) return null;
  const width = 200;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const fillD = `${pathD} L ${width},${height} L 0,${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{ width: "100%", height }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`spark-grad-${color.replace(/[^a-z]/gi, "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {fill && (
        <path
          d={fillD}
          fill={`url(#spark-grad-${color.replace(/[^a-z]/gi, "")})`}
        />
      )}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ===== LINE CHART =====
interface LineChartProps {
  data: { label: string; values: number[] }[];
  labels: string[];
  colors?: string[];
  height?: number;
  yMax?: number;
  unit?: string;
}

export function LineChart({
  data,
  labels,
  colors = ["var(--accent-blue)", "var(--accent-green)", "var(--accent-yellow)"],
  height = 160,
  yMax,
  unit = "",
}: LineChartProps) {
  const width = 600;
  const padL = 40;
  const padR = 16;
  const padT = 16;
  const padB = 28;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const allVals = data.flatMap((d) => d.values);
  const maxVal = yMax ?? Math.max(...allVals) * 1.1;
  const minVal = 0;
  const range = maxVal - minVal || 1;

  const getX = (i: number, total: number) =>
    padL + (i / (total - 1)) * chartW;
  const getY = (v: number) =>
    padT + chartH - ((v - minVal) / range) * chartH;

  // Y gridlines
  const yTicks = 4;
  const yTickVals = Array.from(
    { length: yTicks + 1 },
    (_, i) => minVal + (range / yTicks) * i
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", height }}
      role="img"
      aria-label="Line chart"
    >
      <defs>
        {data.map((_, ci) => (
          <linearGradient key={ci} id={`line-grad-${ci}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors[ci % colors.length]} stopOpacity={0.25} />
            <stop offset="100%" stopColor={colors[ci % colors.length]} stopOpacity={0} />
          </linearGradient>
        ))}
      </defs>

      {/* Grid */}
      {yTickVals.map((val, i) => {
        const y = getY(val);
        return (
          <g key={i}>
            <line
              x1={padL} y1={y} x2={padL + chartW} y2={y}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1"
            />
            <text
              x={padL - 6} y={y + 4}
              textAnchor="end"
              fontSize="9"
              fill="var(--text-muted)"
            >
              {Math.round(val)}{unit}
            </text>
          </g>
        );
      })}

      {/* X labels */}
      {labels.map((lbl, i) => (
        <text
          key={i}
          x={getX(i, labels.length)}
          y={padT + chartH + 18}
          textAnchor="middle"
          fontSize="9"
          fill="var(--text-muted)"
        >
          {lbl}
        </text>
      ))}

      {/* Area + line per series */}
      {data.map((series, ci) => {
        const pts = series.values.map((v, i) => ({
          x: getX(i, series.values.length),
          y: getY(v),
        }));
        const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
        const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${padT + chartH} L ${pts[0].x} ${padT + chartH} Z`;

        return (
          <g key={ci}>
            <path d={areaPath} fill={`url(#line-grad-${ci})`} />
            <path
              d={linePath}
              fill="none"
              stroke={colors[ci % colors.length]}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Data points */}
            {pts.map((p, pi) => (
              <circle
                key={pi}
                cx={p.x} cy={p.y} r="3"
                fill={colors[ci % colors.length]}
                opacity={0.8}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

// ===== BAR CHART =====
interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  maxValue?: number;
  unit?: string;
}

export function BarChart({ data, height = 140, maxValue, unit = "" }: BarChartProps) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value)) * 1.2;
  const width = 600;
  const padL = 8;
  const padR = 8;
  const padT = 8;
  const padB = 24;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;
  const barW = (chartW / data.length) * 0.55;
  const gap = chartW / data.length;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", height }}
      role="img"
      aria-label="Bar chart"
    >
      {data.map((d, i) => {
        const barH = ((d.value / max) * chartH);
        const x = padL + i * gap + (gap - barW) / 2;
        const y = padT + chartH - barH;
        const color = d.color ?? "var(--accent-blue)";
        return (
          <g key={i}>
            {/* Bar bg */}
            <rect
              x={x} y={padT}
              width={barW} height={chartH}
              rx="4"
              fill="rgba(255,255,255,0.04)"
            />
            {/* Bar fill */}
            <rect
              x={x} y={y}
              width={barW} height={barH}
              rx="4"
              fill={color}
              opacity={0.8}
            />
            {/* Value label */}
            <text
              x={x + barW / 2} y={y - 4}
              textAnchor="middle"
              fontSize="9"
              fill={color}
              fontWeight="600"
            >
              {d.value}{unit}
            </text>
            {/* X label */}
            <text
              x={x + barW / 2} y={padT + chartH + 16}
              textAnchor="middle"
              fontSize="9"
              fill="var(--text-muted)"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
