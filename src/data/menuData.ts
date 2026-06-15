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
          { name: 'Espresso', prices: [{ price: '£2.50' }] },
          { name: 'Macchiato', prices: [{ price: '£2.90' }] },
          { name: 'Cortado', prices: [{ price: '£3.30' }] },
          { name: 'Long Black', prices: [{ price: '£3.00' }] },
          { name: 'Americano', prices: [{ label: '8oz', price: '£3.10' }, { label: '12oz', price: '£3.30' }] },
          { name: 'Batch Brew', prices: [{ label: '8oz', price: '£2.80' }, { label: '12oz', price: '£3.10' }] },
          { name: 'Cappuccino', prices: [{ label: '8oz', price: '£3.40' }, { label: '12oz', price: '£3.70' }] },
          { name: 'Latte', prices: [{ label: '8oz', price: '£3.40' }, { label: '12oz', price: '£3.70' }] },
          { name: 'Flat White', prices: [{ price: '£3.40' }] },
        ],
      },
      {
        id: 'iced-coffee',
        title: 'ICED COFFEE',
        items: [
          { name: 'Iced Americano', prices: [{ price: '£3.50' }] },
          { name: 'Cold Brew', prices: [{ price: '£3.10' }] },
          { name: 'Iced Latte', prices: [{ price: '£3.80' }] },
          { name: 'Iced Flat White', prices: [{ price: '£3.60' }] },
          { name: 'Greek Frappe', prices: [{ price: '£3.70' }] },
          { name: 'Freddo Espresso', prices: [{ price: '£3.90' }] },
          { name: 'Freddo Cappuccino', prices: [{ price: '£4.20' }] },
        ],
      },
      {
        id: 'hot-drinks',
        title: 'HOT DRINKS',
        items: [
          { name: 'Dark or White Mocha', prices: [{ label: '8oz', price: '£3.80' }, { label: '12oz', price: '£4.00' }] },
          { name: 'Dark or White Chocolate', prices: [{ label: '8oz', price: '£3.60' }, { label: '12oz', price: '£3.80' }] },
          { name: 'Matcha Latte', prices: [{ label: '8oz', price: '£3.80' }, { label: '12oz', price: '£4.00' }] },
          { name: 'Lavender Honey Matcha', prices: [{ label: '8oz', price: '£4.10' }, { label: '12oz', price: '£4.40' }] },
          { name: 'Strawberry Matcha Latte', prices: [{ label: '8oz', price: '£4.10' }, { label: '12oz', price: '£4.40' }] },
          { name: 'Dirty Matcha Latte', prices: [{ label: '8oz', price: '£4.10' }, { label: '12oz', price: '£4.40' }] },
          { name: 'Chai Latte', prices: [{ label: '8oz', price: '£3.60' }, { label: '12oz', price: '£3.90' }] },
          { name: 'Dirty Chai Latte', prices: [{ label: '8oz', price: '£4.00' }, { label: '12oz', price: '£4.30' }] },
          { name: 'Tea', prices: [{ price: '£3.30' }], description: 'English Breakfast, Earl Grey, Green Tea, Peppermint, Chamomile, Lemon & Ginger, Super Fruit, Decaf Black Tea' },
        ],
      },
      {
        id: 'iced-drinks',
        title: 'ICED DRINKS',
        items: [
          { name: 'Dark or White Mocha', prices: [{ price: '£4.20' }] },
          { name: 'Dark or White Chocolate', prices: [{ price: '£4.00' }] },
          { name: 'Matcha Latte', prices: [{ price: '£4.20' }] },
          { name: 'Lavender & Honey Matcha', prices: [{ price: '£4.60' }] },
          { name: 'Strawberry Matcha', prices: [{ price: '£4.60' }] },
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
          { name: 'V60', prices: [{ price: '£4.60' }] },
          { name: 'Chemex', prices: [{ price: '£5.50' }] },
          { name: 'Aeropress', prices: [{ price: '£4.50' }] },
        ],
      },
      {
        id: 'drink-extras',
        title: 'EXTRAS',
        items: [
          { name: 'Soya-free Oat / Coconut / Almond', prices: [{ price: '£0.40' }] },
          { name: 'Extra Shot', prices: [{ price: '£0.40' }] },
          { name: 'Vanilla / Caramel / Hazelnut Syrup', prices: [{ price: '£0.40' }] },
          { name: 'Honey', prices: [{ price: 'Free' }] },
          { name: 'Decaf', prices: [{ price: '£0.50' }] },
        ],
      },
      {
        id: 'smoothies',
        title: 'SMOOTHIES',
        subtitle: 'All £4.80',
        items: [
          {
            name: 'Pinky Promise',
            prices: [{ price: '£4.80' }],
            description: 'Strawberries, Banana & Mango',
          },
          {
            name: 'Green Kick',
            prices: [{ price: '£4.80' }],
            description: 'Kiwi, Mango, Pineapple, Spinach & Kale',
          },
          {
            name: 'Island Dream',
            prices: [{ price: '£4.80' }],
            description: 'Pineapple, Mango, Lime, Mint & Coconut',
          },
          {
            name: 'Rise & Shine',
            prices: [{ price: '£4.80' }],
            description: 'Gluten-free Oats, Flax Seeds, Blueberries, Raspberries & Banana',
          },
          {
            name: 'Avo Go-go',
            prices: [{ price: '£4.80' }],
            description: 'Avocado, Broccoli, Spinach, Mango, Coconut, Ginger & Lime',
          },
          {
            name: 'Choco Loco',
            prices: [{ price: '£4.80' }],
            description: 'Oats, Chocolate Powder, Peanut Butter & Banana',
          },
          {
            name: 'Turmeric Tango',
            prices: [{ price: '£4.80' }],
            description: 'Oats, Turmeric, Cinnamon & Banana',
          },
        ],
      },
      {
        id: 'coolers',
        title: 'COOLERS',
        subtitle: 'All £4.10',
        items: [
          { name: 'Mango & Passionfruit', prices: [{ price: '£4.10' }] },
          { name: 'Strawberry & Banana', prices: [{ price: '£4.10' }] },
          { name: 'Blueberry & Blackcurrant', prices: [{ price: '£4.10' }] },
        ],
      },
      {
        id: 'juice',
        title: 'JUICE',
        items: [
          { name: 'Fresh Squeezed Orange Juice', prices: [{ price: '£4.60' }] },
        ],
      },
      {
        id: 'seasonal-drinks',
        title: 'SEASONAL',
        items: [
          {
            name: 'Raspberry Chocolate',
            prices: [
              { label: 'Hot', price: '£4.60' },
              { label: 'Iced', price: '£4.80' },
            ],
          },
          {
            name: 'Raspberry Mocha',
            prices: [
              { label: 'Hot', price: '£4.90' },
              { label: 'Iced', price: '£5.20' },
            ],
          },
          {
            name: 'Rose Matcha',
            prices: [
              { label: 'Hot', price: '£4.40' },
              { label: 'Iced', price: '£4.60' },
            ],
          },
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
          { name: 'Fuel Bowl', prices: [{ price: '£8.50' }], description: 'Yoghurt, protein powder, peanut butter, banana, chia seeds, almonds & dark chocolate chips' },
          { name: 'Berries Crunch', prices: [{ price: '£8.00' }], description: 'Berries, crunchy granola, flaxseeds & roasted pecans' },
          { name: 'The Essential', prices: [{ price: '£8.00' }], description: 'Yoghurt, seasonal fruits, granola & Greek honey. Add honey or maple syrup +£0.50' },
        ],
      },
      {
        id: 'porridge',
        title: 'PORRIDGE',
        items: [
          { name: 'Plain', prices: [{ price: '£4.50' }] },
          { name: 'Apple Pie', prices: [{ price: '£7.00' }], description: 'Oats, stewed apples with cinnamon, brown sugar, pecans & maple syrup' },
          { name: 'Banana Nut', prices: [{ price: '£7.00' }], description: 'Oats, sliced bananas, walnuts, cinnamon & honey' },
          { name: 'Peanut Butter Cup', prices: [{ price: '£8.00' }], description: 'Oats, sliced bananas, peanut butter & chocolate chips. Add honey or maple syrup +£0.50' },
        ],
      },
      {
        id: 'avocado-toast',
        title: 'AVOCADO ON TOAST',
        subtitle: 'All dishes come with 2 slices of sourdough bread with mashed avocado & salad. Gluten-free bread available.',
        items: [
          { name: 'Avocado on Toast', prices: [{ price: '£7.00' }], dietaryTags: ['VG', 'GF'] },
        ],
        addOns: [
          { name: 'Poached / Scrambled Eggs', price: '+£3.00' },
          { name: 'Portobello Mushrooms', price: '+£3.00' },
          { name: 'Halloumi Cheese', price: '+£3.00' },
          { name: 'Cherry Tomatoes', price: '+£2.50' },
          { name: 'Smoked Salmon', price: '+£3.00' },
          { name: 'Feta Cheese', price: '+£3.00' },
          { name: 'Bacon', price: '+£3.00' },
        ],
      },
      {
        id: 'breakfasts',
        title: 'BREAKFASTS',
        subtitle: 'Only 1 item can be swapped from the breakfasts. All served with tea/black coffee or orange juice.',
        items: [
          { name: 'Full English Breakfast', prices: [{ price: '£16.50' }], description: 'Two free range eggs (fried/scrambled or poached), Cumberland sausages, crispy bacon, grilled tomato, portobello mushroom, hash brown, baked beans & toast with butter' },
          { name: 'Vegetarian Breakfast', prices: [{ price: '£15.50' }], dietaryTags: ['VG'], description: 'Two free range eggs (fried/scrambled or poached), grilled halloumi & tomato, portobello mushroom, hash brown, baked beans, avocado & toast with butter' },
          { name: 'Vegan Breakfast', prices: [{ price: '£15.50' }], dietaryTags: ['V'], description: 'Hash browns, homemade falafel, grilled tomato, portobello mushroom, baked beans, avocado, hummus & toast' },
          { name: 'Full Greek Breakfast', prices: [{ price: '£16.50' }], description: 'Two free range eggs (fried/scrambled or poached), village sausage, grilled tomato, Kalamata olives, feta cheese, cucumber, spicy feta dip & pita bread' },
        ],
      },
      {
        id: 'burgers',
        title: 'BURGERS',
        items: [
          { name: 'Chicken Burger', prices: [{ price: '£14.50' }], description: 'Crispy buttermilk chicken fillet, lettuce, cucumber & honey-mustard sauce, served with fries' },
          { name: 'Smashed Beef Burger', prices: [{ price: '£16.00' }], description: 'Two smashed beef patties, Red Leicester cheese, tomato, lettuce, pickles, onion & burger sauce, served with fries' },
          { name: 'Vegetarian Burger', prices: [{ price: '£13.00' }], dietaryTags: ['VG'], description: 'Halloumi & oyster mushroom, rocket, kimchi, tomato & garlic mayo, served with fries' },
        ],
      },
      {
        id: 'club-sandwiches',
        title: 'CLUB SANDWICHES',
        items: [
          { name: 'Classic Club', prices: [{ price: '£15.00' }], description: 'Honey roast ham, cheddar cheese, bacon, lettuce, tomato, cucumber & mayo in pita, served with fries' },
          { name: 'Spicy Chicken Club', prices: [{ price: '£16.50' }], description: 'Chicken fillet with spicy sauce, cheddar, lettuce, tomato & pickles in pita, served with fries' },
          { name: 'Veggie Club', prices: [{ price: '£15.50' }], dietaryTags: ['VG'], description: 'Falafel, roasted pepper, tomato, spinach & aioli in pita, served with fries. Make it vegan with hummus' },
        ],
      },
      {
        id: 'salads',
        title: 'SALADS',
        items: [
          { name: 'Prawn Salad', prices: [{ price: '£12.60' }], description: 'Mixed leaves, prawns, avocado, tomatoes, cucumber, pumpkin seeds & garlic mayo' },
          { name: 'Caesar Salad', prices: [{ price: '£12.60' }], description: 'Romaine, chicken, croutons, parmesan, tomatoes & Caesar dressing' },
          { name: 'Greek Salad', prices: [{ price: '£12.00' }], dietaryTags: ['VG'], description: 'Tomatoes, cucumber, onion, olives, peppers, feta, oregano & olive oil balsamic vinaigrette, served with pita' },
          { name: 'Falafel Salad', prices: [{ price: '£12.00' }], dietaryTags: ['V'], description: 'Falafel, quinoa, roasted peppers, cucumber, onion & hummus' },
          { name: 'Sweet Potato & Kale Salad', prices: [{ price: '£12.00' }], dietaryTags: ['VG'], description: 'Roasted sweet potato, kale, avocado, tomatoes, feta, pumpkin seeds, coriander & vinaigrette. Add pita bread £2.00' },
        ],
      },
      {
        id: 'soup',
        title: 'SEASONAL SOUP',
        items: [
          { name: 'Seasonal Soup', prices: [{ price: '£6.50' }], description: 'Ask the staff for more information' },
        ],
      },
      {
        id: 'toasties',
        title: 'MAKE YOUR OWN TOASTIE',
        subtitle: 'Gluten-free bread available.',
        items: [
          { name: 'Ham & Cheese', prices: [{ price: '£6.50' }], dietaryTags: ['GF'] },
          { name: 'Cheese & Tomato', prices: [{ price: '£6.50' }], dietaryTags: ['GF'] },
        ],
        addOns: [
          { name: 'Fried / Scrambled / Poached Eggs', price: '+£2.50' },
          { name: 'Feta Cheese', price: '+£2.00' },
          { name: 'Avocado', price: '+£2.50' },
          { name: 'Falafel', price: '+£2.50' },
          { name: 'Mushrooms', price: '+£2.00' },
          { name: 'Salmon', price: '+£2.50' },
          { name: 'Halloumi', price: '+£2.00' },
          { name: 'Bacon', price: '+£2.00' },
          { name: 'Olives', price: '+£2.00' },
          { name: 'Kimchi', price: '+£2.50' },
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
          { name: 'Salmon', prices: [{ price: '£3.00' }] },
          { name: 'Bacon', prices: [{ price: '£2.50' }] },
          { name: 'Feta', prices: [{ price: '£2.50' }] },
          { name: 'Avocado', prices: [{ price: '£2.50' }] },
          { name: 'Eggs', prices: [{ price: '£3.00' }] },
          { name: 'Halloumi', prices: [{ price: '£2.50' }] },
          { name: 'Oyster Mushrooms', prices: [{ price: '£3.00' }] },
        ],
      },
    ],
  },
];
