export interface ProjectLink {
  label: string
  href: string
}

export interface Project {
  id: string
  when: string
  name: string
  summary: string
  highlights: string[]
  stack: string
  links: ProjectLink[]
}

/** Personal projects built outside work, newest first. */
export const projects: Project[] = [
  {
    id: 'garmin-running-analysis',
    when: '2026',
    name: 'Running analysis tool',
    summary:
      'Pulls a full Garmin history into a local archive and computes transparent, tunable training metrics instead of relying on black-box numbers.',
    highlights: [
      'Rust CLI syncing raw FIT and JSON',
      'Aerobic fitness trend at a fixed HR',
      'Training load (TRIMP, CTL/ATL/TSB)',
      'Race prediction from VDOT',
      'Per-run detail with map and charts',
      'Every figure traced to a formula',
    ],
    stack: 'Rust · Python · polars · DuckDB · FastAPI · SQLite · SVG',
    links: [{ label: 'Source', href: 'https://github.com/chenyujiang/garmin-running-analysis' }],
  },
  {
    id: 'grocery-receipt-tracker',
    when: '2026',
    name: 'Grocery receipt tracker',
    summary:
      'A family-shared web app: photograph a receipt, have Claude read it, and track spending and unit-price trends over time.',
    highlights: [
      'Receipt OCR with Claude Haiku',
      'Per-user AI cost metering',
      'Row-level security on every table',
      'Price-spike & low-stock alerts',
      'Scheduled cleanup via cron',
      'Admin dashboard & circle merge',
    ],
    stack: 'React · TypeScript · Vite · Supabase (Postgres) · Vercel Functions',
    links: [
      { label: 'Live demo', href: 'https://grocery-receipt-tracker-three.vercel.app' },
      { label: 'Source', href: 'https://github.com/chenyujiang/grocery-receipt-tracker' },
    ],
  },
]
