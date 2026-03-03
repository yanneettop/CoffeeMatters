import type { MenuItemData } from '@/data/menuData';
import DietaryBadge from './DietaryBadge';

export default function MenuItem({ item }: { item: MenuItemData }) {
  const hasDualPrices = item.prices.length > 1;

  return (
    <div className="group py-1">
      <div className="flex items-baseline gap-2">
        {/* Name + dietary badges */}
        <div className="flex items-baseline gap-1.5 shrink-0">
          <span className="font-body font-normal text-[var(--text-primary)] text-sm sm:text-[15px] leading-snug">
            {item.name}
          </span>
          {item.dietaryTags?.map((tag) => (
            <DietaryBadge key={tag} tag={tag} />
          ))}
        </div>

        {/* Dotted leader */}
        <div className="flex-1 border-b border-dotted border-[var(--sandstone)] mb-[3px] min-w-[16px]" />

        {/* Price(s) */}
        <div className="shrink-0 text-right">
          {hasDualPrices ? (
            <div className="flex gap-3 text-sm font-medium">
              {item.prices.map((p, i) => (
                <span key={i} className="whitespace-nowrap text-coral">
                  {p.label && (
                    <span className="text-[10px] text-gray-400 uppercase tracking-wide mr-0.5">
                      {p.label}{' '}
                    </span>
                  )}
                  {p.price}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-sm sm:text-[15px] text-coral font-medium">
              {item.prices[0].price}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <p className="mt-0.5 text-[12px] text-gray-400 font-body leading-relaxed max-w-md">
          {item.description}
        </p>
      )}
    </div>
  );
}
