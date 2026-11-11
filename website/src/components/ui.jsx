// Small shared building blocks: icons, buttons, photos, "to be confirmed" markers.
import { Link } from 'react-router-dom';
import { photo } from '../lib/data.js';

const PATHS = {
  person: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  doc: <><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5M10 13h6M10 17h6" /></>,
  ledger: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M4 9h16M9 9v11" /></>,
  trend: <><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></>,
  building: <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" />,
  check: <><path d="M6 3h9l4 4v14H6z" /><path d="M9 13l2 2 4-4" /></>,
  shield: <><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" /><path d="M9 12l2 2 4-4" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  chat: <><path d="M4 5h16v11H9l-5 4z" /><path d="M8 10h8" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  pin: <><path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  user: <><circle cx="12" cy="9" r="4.5" /><path d="M3.5 22c0-5 4-8 8.5-8s8.5 3 8.5 8" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
};

export function Icon({ name, size = 22, className = '' }) {
  return (
    <svg className={`icon ${className}`} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {PATHS[name]}
    </svg>
  );
}

export function Btn({ to, href, children, variant = 'green', arrow = true, className = '', ...rest }) {
  const cls = `btn btn--${variant} ${className}`;
  const inner = (
    <>
      <span className="btn__label"><span>{children}</span><span aria-hidden="true">{children}</span></span>
      {arrow && <span className="btn__ar"><Icon name="arrow" size={14} /></span>}
    </>
  );
  if (to) return <Link className={cls} to={to} {...rest}>{inner}</Link>;
  if (href) return <a className={cls} href={href} {...rest}>{inner}</a>;
  return <button className={cls} {...rest}>{inner}</button>;
}

export function Photo({ k, alt = '', className = '', eager = false, style }) {
  const src = photo(k);
  if (!src) return <span className={`ph ${className}`} role="img" aria-label={alt} style={style} />;
  return <img className={className} src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" style={style} />;
}

export function Tbc({ label = 'To be confirmed' }) {
  return <span className="todo">{label}</span>;
}

export const val = (v, label) => (v ? v : <Tbc label={label} />);

export function Eyebrow({ children, light = false }) {
  return <p className={`eyebrow${light ? ' eyebrow--light' : ''}`}>{children}</p>;
}
