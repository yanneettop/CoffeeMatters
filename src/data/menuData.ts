export type DietaryTag = 'V' | 'VG' | 'GF';

export interface MenuItemPrice {
  label?: string;
  price: string;
}

export interface AddOn {
  name: string;
  price: string;
}

export interface MenuItemData {
  name: string;
  prices: MenuItemPrice[];
  description?: string;
  dietaryTags?: DietaryTag[];
}

export interface MenuCategory {
  id: string;
  title: string;
  subtitle?: string;
  items: MenuItemData[];
  addOns?: AddOn[];
}

export interface MenuTab {
  id: string;
  label: string;
  categories: MenuCategory[];
}

export const menuTabs: MenuTab[] = [
  {
    id: 'drinks',
    label: 'DRINKS',
    categories: [
      {
        id: 'hot-coffee',
        title: 'HOT COFFEE',
        items: [
          { name: 'Espresso', prices: [{ price: '£2.20' }] },
          { name: 'Macchiato', prices: [{ price: '£2.70' }] },
          { name: 'Cortado', prices: [{ price: '£3.00' }] },
          { name: 'Long Black', prices: [{ price: '£2.70' }] },
          { name: 'Americano', prices: [{ label: '8oz', price: '£2.80' }, { label: '12oz', price: '£3.10' }] },
          { name: 'Batch Brew', prices: [{ label: '8oz', price: '£2.80' }, { label: '12oz', price: '£3.10' }] },
          { name: 'Cappuccino', prices: [{ label: '8oz', price: '£3.30' }, { label: '12oz', price: '£3.50' }] },
          { name: 'Latte', prices: [{ label: '8oz', price: '£3.30' }, { label: '12oz', price: '£3.50' }] },
          { name: 'Flat White', prices: [{ price: '£3.20' }] },
        ],
      },
      {
        id: 'iced-coffee',
        title: 'ICED COFFEE',
        items: [
          { name: 'Iced Americano', prices: [{ price: '£3.20' }] },
          { name: 'Cold Brew', prices: [{ price: '£3.40' }] },
          { name: 'Iced Latte', prices: [{ price: '£3.70' }] },
          { name: 'Iced Flat White', prices: [{ price: '£3.40' }] },
          { name: 'Greek Frappe', prices: [{ price: '£3.70' }] },
          { name: 'Freddo Espresso', prices: [{ price: '£3.90' }] },
          { name: 'Freddo Cappuccino', prices: [{ price: '£4.20' }] },
        ],
      },
      {
        id: 'hot-drinks',
        title: 'HOT DRINKS',
        items: [
          { name: 'Dark or White Mocha', prices: [{ label: '8oz', price: '£3.60' }, { label: '12oz', price: '£3.80' }] },
          { name: 'Dark or White Chocolate', prices: [{ label: '8oz', price: '£3.40' }, { label: '12oz', price: '£3.60' }] },
          { name: 'Matcha Latte', prices: [{ label: '8oz', price: '£3.50' }, { label: '12oz', price: '£3.80' }] },
          { name: 'Lavender Honey Matcha Latte', prices: [{ label: '8oz', price: '£3.90' }, { label: '12oz', price: '£4.20' }] },
          { name: 'Strawberry Matcha Latte', prices: [{ label: '8oz', price: '£3.90' }, { label: '12oz', price: '£4.20' }] },
          { name: 'Dirty Matcha Latte', prices: [{ label: '8oz', price: '£3.90' }, { label: '12oz', price: '£4.20' }] },
          { name: 'Chai Latte', prices: [{ label: '8oz', price: '£3.40' }, { label: '12oz', price: '£3.70' }] },
          { name: 'Dirty Chai Latte', prices: [{ label: '8oz', price: '£3.80' }, { label: '12oz', price: '£4.10' }] },
          { name: 'Tea', prices: [{ price: '£3.00' }], description: 'English Breakfast, Earl Grey, Green Tea, Peppermint, Chamomile, Lemon & Ginger, Super Fruit, Decaf Black Tea' },
        ],
      },
      {
        id: 'iced-drinks',
        title: 'ICED DRINKS',
        items: [
          { name: 'Dark or White Mocha', prices: [{ price: '£3.90' }] },
          { name: 'Dark or White Chocolate', prices: [{ price: '£3.70' }] },
          { name: 'Matcha Latte', prices: [{ price: '£3.90' }] },
          { name: 'Lavender & Honey Matcha', prices: [{ price: '£4.30' }] },
          { name: 'Strawberry Matcha', prices: [{ price: '£4.30' }] },
          { name: 'Matcha Tea', prices: [{ price: '£3.40' }] },
          { name: 'Dirty Matcha', prices: [{ price: '£4.30' }] },
          { name: 'Chai Latte', prices: [{ price: '£3.80' }] },
          { name: 'Dirty Chai Latte', prices: [{ price: '£4.20' }] },
          { name: 'Caramel / Vanilla / Mocha Frappe', prices: [{ price: '£4.30' }] },
          { name: 'Iced Tea', prices: [{ price: '£4.20' }], description: 'Passionfruit & Lemon, Cucumber & Mint' },
        ],
      },
      {
        id: 'pour-over',
        title: 'POUR OVER COFFEE',
        items: [
          { name: 'V60', prices: [{ price: '£4.20' }] },
          { name: 'Chemex', prices: [{ price: '£5.10' }] },
          { name: 'Aeropress', prices: [{ price: '£4.10' }] },
        ],
      },
      {
        id: 'drink-extras',
        title: 'EXTRAS',
        items: [
          { name: 'Soya-free Oat / Coconut / Almond', prices: [{ price: '£0.40' }] },
          { name: 'Extra Shot', prices: [{ price: '£0.40' }] },
          { name: 'Vanilla / Caramel / Hazelnut / Strawberry Syrup', prices: [{ price: '£0.40' }] },
          { name: 'Honey', prices: [{ price: 'Free' }] },
          { name: 'Decaf', prices: [{ price: 'Free' }] },
        ],
      },
    ],
  },
  {
    id: 'food',
    label: 'FOOD',
    categories: [
      {
        id: 'yoghurt-bowls',
        title: 'YOGHURT BOWLS',
        items: [
          { name: 'Plain', prices: [{ price: '£4.50' }] },
          { name: 'Fruit Bowl', prices: [{ price: '£5.50' }], description: 'Yoghurt, protein powder, peanut butter, banana, strawberries, almonds & dark chocolate drops' },
          { name: 'Berries Crunch', prices: [{ price: '£5.30' }], description: 'Berries, crunchy granola, flaxseeds & roasted coconuts' },
          { name: 'The Essential', prices: [{ price: '£5.00' }], description: 'Yoghurt, seasonal fruit, granola & Greek honey. Add honey or maple syrup +£0.50' },
        ],
      },
      {
        id: 'porridge',
        title: 'PORRIDGE',
        items: [
          { name: 'Plain', prices: [{ price: '£4.50' }] },
          { name: 'Apple Pie', prices: [{ price: '£5.00' }], description: 'Oats, stewed apples with cinnamon, brown sugar, pecans & maple syrup' },
          { name: 'Banana Nut', prices: [{ price: '£5.30' }], description: 'Oats, dried fruits, bananas, walnuts, cinnamon & Greek honey' },
          { name: 'Peanut Butter Cup', prices: [{ price: '£5.50' }], description: 'Oats, dried bananas, peanut butter & chocolate drops. Add honey or maple syrup +£0.50' },
        ],
      },
      {
        id: 'avocado-toast',
        title: 'AVOCADO ON TOAST',
        subtitle: 'All dishes come with a full avo on sourdough bread with smashed avocado & salsa.',
        items: [
          { name: 'Avocado on Toast', prices: [{ price: '£7.00' }], dietaryTags: ['VG'] },
        ],
        addOns: [
          { name: 'Poached / Scrambled Eggs', price: '+£2.50' },
          { name: 'Smashed Feta', price: '+£2.00' },
          { name: 'Portobello Mushrooms', price: '+£1.80' },
          { name: 'Pink Salmon', price: '+£4.00' },
          { name: 'Halloumi Slices', price: '+£2.00' },
          { name: 'Bacon', price: '+£2.50' },
          { name: 'Cherry Tomatoes', price: '+£1.80' },
        ],
      },
      {
        id: 'breakfasts',
        title: 'BREAKFASTS',
        subtitle: "Don't miss out on our staple brunch favourites.",
        items: [
          { name: 'Full English Breakfast', prices: [{ price: '£14.50' }], description: 'Two free range eggs, fried/scrambled on sourdough, crispy bacon, pork sausage, grilled tomato, portobello mushrooms, hash brown, baked beans & toast with butter' },
          { name: 'Vegetarian Breakfast', prices: [{ price: '£13.00' }], dietaryTags: ['V'], description: 'Two free range eggs fried/scrambled on sourdough, grilled halloumi & feta, portobello mushrooms, hash brown, baked beans, avocado & toast with butter' },
          { name: 'Vegan Breakfast', prices: [{ price: '£11.50' }], dietaryTags: ['VG'], description: 'Hash browns, two homemade falafels, grilled tomato, portobello mushrooms, mixed beans, avocado, hummus & toast' },
          { name: 'Full Greek Breakfast', prices: [{ price: '£14.50' }], description: 'Two free range eggs fried/scrambled on sourdough, village sausage, grilled tomato, feta cheese, cucumber, olives, Greek olive oil & chickpeas. Served with tzatziki and/or orange juice' },
        ],
      },
      {
        id: 'burgers',
        title: 'BURGERS',
        items: [
          { name: 'Chicken Burger', prices: [{ price: '£11.00' }], description: 'Crispy battered fried chicken, lettuce, red onion, cucumber & honey mustard ranch sauce, served with chips' },
          { name: 'Smashed Beef Burger', prices: [{ price: '£14.00' }], description: 'Two smashed beef patties, Red Leicester cheese, lettuce, red onion, pickles, onion rings, served with fries' },
          { name: 'Vegetarian Burger', prices: [{ price: '£11.00' }], dietaryTags: ['V'], description: 'Halloumi & potato chickpea mushroom, rocket, lettuce, tomato & garlic mayo, served with fries' },
        ],
      },
      {
        id: 'club-sandwiches',
        title: 'CLUB SANDWICHES',
        items: [
          { name: 'Classic Club', prices: [{ price: '£11.50' }], description: 'Chicken, lettuce, tomato, cucumber & mayonnaise, served with fries' },
          { name: 'Spicy Chicken Club', prices: [{ price: '£11.50' }], description: 'Chicken fillet with extra sauce, cheddar, rocket, tomato & lettuce in pitta, served with fries' },
          { name: 'Veggie Club', prices: [{ price: '£11.00' }], dietaryTags: ['V'], description: 'Grilled mushrooms/halloumi, lettuce, red onion & rocket, mayonnaise, served with fries' },
        ],
      },
      {
        id: 'salads',
        title: 'SALADS',
        items: [
          { name: 'Prawn Salad', prices: [{ price: '£12.50' }], description: 'Mixed leaves, prawns, avocado, red onion, cucumber, smoked salmon & garlic mayo' },
          { name: 'Caesar Salad', prices: [{ price: '£11.50' }], description: 'Baby gem, chicken, croutons, parmesan, tomatoes & Caesar dressing' },
          { name: 'Greek Salad', prices: [{ price: '£10.00' }], dietaryTags: ['V'], description: 'Tomatoes, cucumber, red onion, olives, feta, mixed salad, olive oil, balsamic vinegar, served with pitta' },
          { name: 'Falafel Salad', prices: [{ price: '£11.00' }], description: 'Falafel, quinoa, roasted peppers, cucumber, tahini & hummus' },
          { name: 'Sweet Potato & Kale Salad', prices: [{ price: '£10.50' }], dietaryTags: ['VG'], description: 'Roasted sweet potato, kale, avocado, dried fruits, pomegranate seeds, coriander & a maple lime dressing' },
        ],
      },
      {
        id: 'soup',
        title: 'SEASONAL SOUP',
        items: [
          { name: 'Seasonal Soup', prices: [{ price: '£6.50' }], description: 'Ask the staff for today\'s offerings' },
        ],
      },
      {
        id: 'toasties',
        title: 'MAKE YOUR OWN TOASTIE',
        items: [
          { name: 'Ham & Cheese', prices: [{ price: '£5.50' }] },
          { name: 'Cheese & Tomato', prices: [{ price: '£5.00' }] },
        ],
        addOns: [
          { name: 'Poached / Scrambled / Fried Egg', price: '+£2.50' },
          { name: 'Grilled Halloumi', price: '+£2.50' },
          { name: 'Avocado', price: '+£2.50' },
          { name: 'Portobello', price: '+£2.00' },
          { name: 'Mushrooms', price: '+£2.00' },
          { name: 'Salmon', price: '+£2.50' },
          { name: 'Bacon', price: '+£2.50' },
          { name: 'Hummus', price: '+£2.50' },
          { name: 'Sriracha', price: '+£2.50' },
        ],
      },
      {
        id: 'chips',
        title: 'CHIPS',
        items: [
          { name: 'Chips', prices: [{ price: '£4.50' }] },
        ],
      },
      {
        id: 'food-extras',
        title: 'EXTRAS',
        items: [
          { name: 'Hash Browns', prices: [{ price: '£2.50' }] },
          { name: 'Croutons', prices: [{ price: '£1.50' }] },
          { name: 'Bacon', prices: [{ price: '£2.50' }] },
          { name: 'Fries', prices: [{ price: '£3.00' }] },
          { name: 'Avocado', prices: [{ price: '£1.50' }] },
          { name: 'Eggs', prices: [{ price: '£2.50' }] },
          { name: 'Falafel', prices: [{ price: '£2.50' }] },
          { name: 'Oyster Mushrooms', prices: [{ price: '£3.00' }] },
        ],
      },
    ],
  },
];
