import type { MenuCategory } from '@/data/menuData';
import MenuItem from './MenuItem';

export default function MenuCategoryCard({ category }: { category: MenuCategory }) {
  return (
    <div id={`cat-${category.id}`} className="menu-category">
      {/* Category Title with extending line */}
      <div className="flex items-center gap-4 mb-5">
        <h3 className="font-display text-lg sm:text-xl tracking-[0.15em] text-[var(--text-primary)] whitespace-nowrap">
          {category.title}
        </h3>
        <div className="flex-1 h-[1px] bg-[var(--sandstone)]" />
      </div>

      {/* Subtitle */}
      {category.subtitle && (
        <p className="text-[13px] text-gray-500 font-body italic mb-4 -mt-2">
          {category.subtitle}
        </p>
      )}

      {/* Items Grid — 2 columns on desktop, 1 on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
        {category.items.map((item) => (
          <MenuItem key={item.name} item={item} />
        ))}
      </div>

      {/* Add-ons */}
      {category.addOns && category.addOns.length > 0 && (
        <div className="mt-5 pt-4 border-t border-dashed border-[var(--sandstone)]/60">
          <span className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-3 block">
            Add-ons
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-1">
            {category.addOns.map((addon) => (
              <div key={addon.name} className="flex items-baseline gap-1 text-sm py-0.5">
                <span className="text-gray-500 font-body text-[13px]">{addon.name}</span>
                <div className="flex-1 border-b border-dotted border-gray-200 mb-[3px] min-w-[10px]" />
                <span className="text-coral text-[13px] font-medium">{addon.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
