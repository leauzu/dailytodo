import type { ProgressItem } from "@/lib/types";

type Props = {
  data: ProgressItem[];
  range: string;
};

function labelForDate(date: string, range: string): string {
  const d = new Date(`${date}T00:00:00`);
  if (range === "week") {
    return d.toLocaleDateString("en-US", { weekday: "short" });
  }
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

export default function AreaChart({ data, range }: Props) {
  const width = 420;
  const height = 220;
  const padX = 28;
  const padY = 22;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  if (!data.length) {
    return (
      <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Empty consistency chart">
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="axis-label">
          Loading chart...
        </text>
      </svg>
    );
  }

  const points = data.map((item, index) => {
    const x = data.length === 1 ? padX : padX + (index / (data.length - 1)) * chartW;
    const y = padY + chartH - (item.percent / 100) * chartH;
    return { x, y, ...item };
  });

  const line = points.map((p, index) => `${index === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
  const area = `${line} L ${points[points.length - 1].x.toFixed(2)} ${height - padY} L ${points[0].x.toFixed(2)} ${height - padY} Z`;

  const labelIndexes = new Set<number>();
  labelIndexes.add(0);
  labelIndexes.add(points.length - 1);
  if (points.length > 4) {
    labelIndexes.add(Math.floor(points.length / 2));
  }

  return (
    <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Consistency area chart">
      <defs>
        <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(37, 99, 235, .32)" />
          <stop offset="100%" stopColor="rgba(37, 99, 235, .02)" />
        </linearGradient>
      </defs>

      {[0, 25, 50, 75, 100].map((value) => {
        const y = padY + chartH - (value / 100) * chartH;
        return (
          <g key={value}>
            <line x1={padX} x2={width - padX} y1={y} y2={y} stroke="rgba(17,24,39,.08)" />
            <text x={4} y={y + 4} className="axis-label">{value}</text>
          </g>
        );
      })}

      <path d={area} fill="url(#areaGradient)" />
      <path d={line} fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

      {points.map((point, index) => {
        const show = labelIndexes.has(index);
        return show ? (
          <g key={point.date}>
            <circle cx={point.x} cy={point.y} r="4" fill="#2563eb" />
            <text x={point.x} y={height - 4} textAnchor="middle" className="axis-label">
              {labelForDate(point.date, range)}
            </text>
          </g>
        ) : null;
      })}
    </svg>
  );
}
