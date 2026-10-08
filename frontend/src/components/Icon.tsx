import type { SVGProps } from 'react'

type IconName = 'grid' | 'activity' | 'shield' | 'alert' | 'case' | 'timeline' | 'target' | 'search' | 'lab' | 'server' | 'upload' | 'arrow' | 'chevron' | 'external' | 'refresh' | 'close' | 'check' | 'clock' | 'user' | 'terminal' | 'network' | 'registry' | 'power'

const paths: Record<IconName, string> = {
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  activity: 'M3 12h4l2.2-7L14 19l2.2-7H21',
  shield: 'M12 3l7 3v5c0 4.6-2.9 8.2-7 10-4.1-1.8-7-5.4-7-10V6l7-3z',
  alert: 'M12 3l9 17H3L12 3zM12 9v4M12 16h.01',
  case: 'M4 7h16v13H4zM8 7V5h8v2M4 11h16',
  timeline: 'M4 18V6M4 12h5M9 12l4-5M9 12l4 5M13 7h7M13 17h7',
  target: 'M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5M12 10a2 2 0 1 0 2 2',
  search: 'M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4zM16 16l5 5',
  lab: 'M9 3v5l-5 9a2 2 0 0 0 1.8 3h12.4A2 2 0 0 0 20 17l-5-9V3M8 3h8M7 15h10',
  server: 'M4 4h16v6H4zM4 14h16v6H4zM7 7h.01M7 17h.01M10 7h7M10 17h7',
  upload: 'M12 16V4M7 9l5-5 5 5M4 20h16',
  arrow: 'M5 12h13M13 6l6 6-6 6',
  chevron: 'M9 18l6-6-6-6',
  external: 'M14 4h6v6M20 4l-9 9M18 13v6H5V6h6',
  refresh: 'M20 11a8 8 0 1 0 2 5M20 5v6h-6',
  close: 'M6 6l12 12M18 6L6 18',
  check: 'M5 12l4 4L19 6',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  terminal: 'M4 5l6 6-6 6M12 17h8',
  network: 'M5 12h14M12 5v14M5 7h14M5 17h14',
  registry: 'M5 5h14v14H5zM8 8h8M8 12h8M8 16h5',
  power: 'M12 3v9M7.1 5.9a7 7 0 1 0 9.8 0',
}

export default function Icon({ name, size = 16, strokeWidth = 1.8, ...props }: SVGProps<SVGSVGElement> & { name: IconName; size?: number; strokeWidth?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name]} /></svg>
}
