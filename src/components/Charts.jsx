import { categoryPalette } from '../data/mockData';
import { formatCompactCurrency, formatCurrency } from '../utils/finance';

export function BalanceTrendChart({ data }) {
  if (!data.length) {
    return <EmptyChart message="No monthly trend available yet." />;
  }

  const balances = data.map((item) => item.balance);
  const maxBalance = Math.max(...balances);
  const minBalance = Math.min(...balances);
  const range = maxBalance - minBalance || 1;

  const points = data
    .map((item, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 100;
      const y = 90 - ((item.balance - minBalance) / range) * 70;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="trend-chart">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Balance trend chart">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(37, 99, 235, 0.42)" />
            <stop offset="100%" stopColor="rgba(37, 99, 235, 0.02)" />
          </linearGradient>
        </defs>
        <polyline points={`0,95 ${points} 100,95`} fill="url(#trendFill)" stroke="none" />
        <polyline points={points} fill="none" stroke="#2563eb" strokeWidth="2.4" />
        {data.map((item, index) => {
          const x = (index / Math.max(data.length - 1, 1)) * 100;
          const y = 90 - ((item.balance - minBalance) / range) * 70;
          return <circle key={item.label} cx={x} cy={y} r="2.4" fill="#0f172a" stroke="#fff" strokeWidth="1.5" />;
        })}
      </svg>

      <div className="chart-label-row">
        {data.map((item) => (
          <div key={item.label} className="chart-label-item">
            <strong>{item.label}</strong>
            <span>{formatCompactCurrency(item.balance)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CategoryBreakdownChart({ data }) {
  if (!data.length) {
    return <EmptyChart message="No expense categories to compare yet." />;
  }

  return (
    <div className="donut-layout">
      <div className="donut" style={{ background: buildDonutGradient(data) }}>
        <div className="donut-center">
          <span>Total</span>
          <strong>{formatCurrency(data.reduce((sum, item) => sum + item.amount, 0))}</strong>
        </div>
      </div>

      <div className="legend-list">
        {data.slice(0, 6).map((item) => (
          <div key={item.category} className="legend-item">
            <div className="legend-title-row">
              <span className="legend-dot" style={{ backgroundColor: categoryPalette[item.category] || '#475569' }} />
              <span>{item.category}</span>
            </div>
            <div className="legend-meta">
              <strong>{formatCurrency(item.amount)}</strong>
              <span>{item.share.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyChart({ message }) {
  return (
    <div className="chart-empty">
      <div className="chart-empty-icon">0</div>
      <p>{message}</p>
    </div>
  );
}

function buildDonutGradient(data) {
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  let cursor = 0;

  const segments = data.slice(0, 6).map((item) => {
    const start = cursor;
    const sweep = total ? (item.amount / total) * 360 : 0;
    cursor += sweep;
    const color = categoryPalette[item.category] || '#475569';
    return `${color} ${start}deg ${cursor}deg`;
  });

  return `conic-gradient(${segments.join(', ')})`;
}
