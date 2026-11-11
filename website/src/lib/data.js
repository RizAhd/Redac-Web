// Single source of client data: src/data/site.json (edit it, then rebuild)
import site from '../data/site.json';
import credits from '../data/photo-credits.json';

export const DATA = site;
export const C = site.company;
export const CONTACT = site.contact;
export const INTEGRATIONS = site.integrations;
export const SERVICES = site.services;
export const SVC = Object.fromEntries(site.services.map((s) => [s.slug, s]));
export const AUDIENCES = site.audiences;
export const PROCESS = site.process;
export const STATS = site.stats;
export const FAQ = site.faq;
export const POSTS = site.posts;
export const ABOUT = site.about;
export const TEAM = site.team;
export const CREDITS = credits;

// Photo URL for a key in site.json "images" (null when not set)
export function photo(key) {
  const f = site.images?.[key];
  return f ? `${import.meta.env.BASE_URL}img/${f}` : null;
}
