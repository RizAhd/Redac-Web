// Small shared building blocks: icons, buttons, photos, "to be confirmed" markers.
import { Link } from 'react-router-dom';
import { photo } from '../lib/data.js';
import {
  Receipt, ChartLineUp, Calculator, BookOpenText, TrendUp, Buildings, Stamp, ShieldCheck, CalendarCheck, ChatsCircle,
  FileText, SealCheck, User, UserCircle, UsersThree, Storefront, Handshake, Phone, EnvelopeSimple, MapPin, Clock,
  ArrowRight, Plus, Check,
} from '@phosphor-icons/react';

// Icons: Phosphor (phosphoricons.com, MIT). Two-tone for feature icons, bold for small UI marks.
const ICONS = {
  receipt: Receipt, report: ChartLineUp, calculator: Calculator, book: BookOpenText, trend: TrendUp,
  building: Buildings, stamp: Stamp, shield: ShieldCheck,
  calendar: CalendarCheck, chat: ChatsCircle, doc: FileText, check: SealCheck,
  person: User, user: UserCircle, team: UsersThree, chart: ChartLineUp, shop: Storefront, handshake: Handshake,
  ledger: BookOpenText, phone: Phone, mail: EnvelopeSimple, pin: MapPin, clock: Clock,
  arrow: ArrowRight, plus: Plus, tick: Check,
};
const BOLD = new Set(['arrow', 'plus', 'tick']);

export function Icon({ name, size = 22, className = '', weight }) {
  const C = ICONS[name] || FileText;
  return <C className={`icon ${className}`} size={size} weight={weight || (BOLD.has(name) ? 'bold' : 'duotone')} aria-hidden="true" />;
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

/* Section index: a quiet "01 — Services" line, not a pill label. */
export function Eyebrow({ children, light = false, n }) {
  return (
    <p className={`kicker${light ? ' kicker--light' : ''}`}>
      {n && <span className="kicker__n">{n}</span>}
      <span className="kicker__line" aria-hidden="true" />
      {children}
    </p>
  );
}
