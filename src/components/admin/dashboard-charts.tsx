"use client";

import { formatGH } from "@/lib/utils";

const TONES = ["#E23A2E", "#F59E0B", "#38BDF8", "#34D399", "#8B5CF6", "#F472B6", "#94A3B8", "#22D3EE"];

export function RevenueAreaChart({ points }: { points: { label: string; revenue: number; pos: number }[] }) {
  const W = 760;
  const H = 220;
  const pad = { top: 16, right: 8, bottom: 24, left: 8 };
  const max = Math.max(...points.map((p) => p.revenue), 1);
  const x = (i: number) => pad.left + (i * (W - pad.left - pad.right)) / Math.max(points.length - 1, 1);
  const y = (v: number) => pad.top + (H - pad.top - pad.bottom) * (1 - v / max);

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p.revenue)}`).join(" ");
  const area = `${path} L ${x(points.length - 1)} ${H - pad.bottom} L ${x(0)} ${H - pad.bottom} Z`;
  const posPath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p.pos)}`).join(" ");

  const step = Math.ceil(points.length / 8);
  const grid = Array.from({ length: 5 }, (_, i) => {
    const v = (max * i) / 4;
    return { v, y: y(v) };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Revenue over time">
      <defs>
        <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E23A2E" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#E23A2E" stopOpacity="0" />
        </linearGradient>
      </defs>
      {grid.map((g, i) => (
        <g key={i}>
          <line x1={pad.left} x2={W - pad.right} y1={g.y} y2={g.y} stroke="#E8ECEF" strokeWidth="1" />
          <text x={W - pad.right} y={g.y - 4} textAnchor="end" className="fill-[#94A3B8]" fontSize="10">
            GH₵{(g.v / 1000).toFixed(0)}k
          </text>
        </g>
      ))}
      <path d={area} fill="url(#revFill)" />
      <path d={path} fill="none" stroke="#E23A2E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={posPath} fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
      {points.map((p, i) =>
        i % step === 0 || i === points.length - 1 ? (
          <text key={i} x={x(i)} y={H - 6} textAnchor="middle" className="fill-[#64748B]" fontSize="10">
            {p.label}
          </text>
        ) : null
      )}
      <circle cx={x(points.length - 1)} cy={y(points[points.length - 1].revenue)} r="4" fill="#E23A2E" stroke="white" strokeWidth="2" />
    </svg>
  );
}

export function OrdersBarChart({ points }: { points: { label: string; orders: number; pos: number }[] }) {
  const W = 760;
  const H = 180;
  const pad = { top: 10, right: 8, bottom: 24, left: 8 };
  const max = Math.max(...points.map((p) => p.orders + p.pos), 1);
  const bw = Math.min((W - pad.left - pad.right) / points.length / 2.6, 12);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Orders per day">
      {Array.from({ length: 5 }, (_, i) => {
        const v = (max * i) / 4;
        const yy = pad.top + (H - pad.top - pad.bottom) * (1 - v / max);
        return <line key={i} x1={pad.left} x2={W - pad.right} y1={yy} y2={yy} stroke="#E8ECEF" strokeWidth="1" />;
      })}
      {points.map((p, i) => {
        const cx = pad.left + (i + 0.5) * ((W - pad.left - pad.right) / points.length);
        const ho = (H - pad.top - pad.bottom) * (p.orders / max);
        const hp = (H - pad.top - pad.bottom) * (p.pos / max);
        return (
          <g key={i}>
            <rect x={cx - bw - 1.5} y={H - pad.bottom - ho} width={bw} height={Math.max(ho, p.orders ? 2 : 0)} rx="3" fill="#0F172A" />
            <rect x={cx + 1.5} y={H - pad.bottom - hp} width={bw} height={Math.max(hp, p.pos ? 2 : 0)} rx="3" fill="#E23A2E" />
          </g>
        );
      })}
      <text x={pad.left} y={H - 30} className="fill-[#64748B]" fontSize="10">
        dark = online orders, red = in-store sales
      </text>
    </svg>
  );
}

export function DonutChart({ slices }: { slices: { name: string; value: number }[] }) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const R = 80;
  const C = 2 * Math.PI * R;
  let acc = 0;

  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <svg viewBox="0 0 200 200" className="h-44 w-44 -rotate-90">
        <circle cx="100" cy="100" r={R} fill="none" stroke="#EEF1F4" strokeWidth="22" />
        {slices.map((s, i) => {
          const frac = s.value / total;
          const dash = frac * C;
          const offset = -acc * C;
          acc += frac;
          return <circle key={i} cx="100" cy="100" r={R} fill="none" stroke={TONES[i % TONES.length]} strokeWidth="22" strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={offset} />;
        })}
      </svg>
      <ul className="space-y-2">
        {slices.map((s, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: TONES[i % TONES.length] }} />
            <span className="text-carbon-700">{s.name}</span>
            <span className="ml-auto pl-4 font-semibold text-carbon-900">{formatGH(s.value)}</span>
            <span className="w-10 text-right text-xs text-carbon-400">{Math.round((s.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TopProductsList({ products }: { products: { name: string; quantity: number; revenue: number }[] }) {
  const max = Math.max(...products.map((p) => p.quantity), 1);
  return (
    <ul className="space-y-4">
      {products.map((p, i) => (
        <li key={i}>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="truncate pr-3 font-medium text-carbon-800">
              <span className="mr-2 font-bold text-carbon-400">{String(i + 1).padStart(2, "0")}</span>
              {p.name}
            </span>
            <span className="shrink-0 text-carbon-500">
              {p.quantity} sold · <span className="font-semibold text-carbon-900">{formatGH(p.revenue)}</span>
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-carbon-100">
            <div className="h-full rounded-full bg-gradient-to-r from-race-500 to-amber-400" style={{ width: `${(p.quantity / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function PaymentMixBar({ mix }: { mix: { name: string; value: number }[] }) {
  const total = mix.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full">
        {mix.map((m, i) => (
          <div key={i} style={{ width: `${(m.value / total) * 100}%`, backgroundColor: TONES[i % TONES.length] }} />
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {mix.map((m, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: TONES[i % TONES.length] }} />
            <span className="text-carbon-700">{m.name}</span>
            <span className="ml-auto font-semibold text-carbon-900">{formatGH(m.value)}</span>
            <span className="w-10 text-right text-xs text-carbon-400">{Math.round((m.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}