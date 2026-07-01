"use client";

function LineChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const width = 400;
  const height = 120;
  const padding = 10;
  
  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - (val / max) * (height - padding * 2);
    return { x, y };
  });

  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx1 = prev.x + (curr.x - prev.x) / 2;
    const cpy1 = prev.y;
    const cpx2 = curr.x - (curr.x - prev.x) / 2;
    const cpy2 = curr.y;
    path += ` C ${cpx1},${cpy1} ${cpx2},${cpy2} ${curr.x},${curr.y}`;
  }

  const areaPath = `${path} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;
  
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40" preserveAspectRatio="none">
      <defs>
        <linearGradient id="line-area-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="line-stroke-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgb(139, 92, 246)" />
          <stop offset="100%" stopColor="rgb(99, 102, 241)" />
        </linearGradient>
      </defs>
      
      {[0.25, 0.5, 0.75].map((p) => (
        <line key={p} x1={padding} y1={height - padding - p * (height - padding * 2)} x2={width - padding} y2={height - padding - p * (height - padding * 2)} stroke="white" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4 4" />
      ))}

      <path d={areaPath} fill="url(#line-area-gradient)" />
      <path d={path} fill="none" stroke="url(#line-stroke-gradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BarChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const width = 400;
  const height = 120;
  const padding = 10;
  const barWidth = (width - padding * 2) / data.length - 4;
  
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40" preserveAspectRatio="none">
      <defs>
        <linearGradient id="bar-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(16, 185, 129)" />
          <stop offset="100%" stopColor="rgb(5, 150, 105)" />
        </linearGradient>
      </defs>
      
      {[0.25, 0.5, 0.75].map((p) => (
        <line key={p} x1={padding} y1={height - padding - p * (height - padding * 2)} x2={width - padding} y2={height - padding - p * (height - padding * 2)} stroke="white" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4 4" />
      ))}

      {data.map((val, i) => {
        const barHeight = (val / max) * (height - padding * 2);
        const x = padding + i * ((width - padding * 2) / data.length) + 2;
        const y = height - padding - barHeight;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={barHeight} rx="4" fill="url(#bar-gradient)" className="transition-all hover:opacity-80" />
            <rect x={x} y={y} width={barWidth} height="2" rx="1" fill="white" fillOpacity="0.3" />
          </g>
        );
      })}
    </svg>
  );
}

export function ChartsGrid({ propertyData, appointmentData }: { propertyData: number[]; appointmentData: number[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-all hover:bg-white/[0.04] hover:border-white/20">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Property Growth</h3>
            <p className="text-sm text-zinc-400">New listings over the last 30 days</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
        </div>
        <LineChart data={propertyData} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-all hover:bg-white/[0.04] hover:border-white/20">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Appointments</h3>
            <p className="text-sm text-zinc-400">Booked viewings over the last 30 days</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
        </div>
        <BarChart data={appointmentData} />
      </div>
    </div>
  );
}