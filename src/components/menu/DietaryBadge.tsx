import type { DietaryTag } from '@/data/menuData';

const tagConfig: Record<DietaryTag, { label: string; bg: string; text: string }> = {
  V: { label: 'V', bg: 'bg-[var(--olive)]/15', text: 'text-[var(--olive)]' },
  VG: { label: 'VG', bg: 'bg-[var(--olive)]/15', text: 'text-[var(--olive)]' },
  GF: { label: 'GF', bg: 'bg-[var(--soft-clay)]/20', text: 'text-[var(--soft-clay)]' },
};

export default function DietaryBadge({ tag }: { tag: DietaryTag }) {
  const config = tagConfig[tag];
  return (
    <span
      className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide leading-none ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}
