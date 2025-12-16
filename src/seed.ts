import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { WaiterEntity } from './waiters/waiter.entity';
import { FloorEntity } from './floors/floor.entity';
import { TableEntity } from './tables/table.entity';
import { MenuCategoryEntity } from './menu/menu-category.entity';
import { MenuItemEntity } from './menu/menu-item.entity';
import { OrderEntity } from './orders/infrastructure/persistence/relational/entities/order.entity';
import { OrderItemEntity } from './orders/infrastructure/persistence/relational/entities/order-item.entity';
import { QrTokenEntity } from './qr/qr-token.entity';

const ds = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity.ts'],
  synchronize: true,
});

async function seed() {
  await ds.initialize();

  // ===== WAITERS =====
  const waiterRepo = ds.getRepository(WaiterEntity);
  const waiters = await waiterRepo.save([
    {
      username: 'waiter1',
      password: await bcrypt.hash('password123', 10),
      isActive: true,
    },
    {
      username: 'waiter2',
      password: await bcrypt.hash('password123', 10),
      isActive: true,
    },
    {
      username: 'waiter3',
      password: await bcrypt.hash('password123', 10),
      isActive: false,
    },
    {
      username: 'waiter4',
      password: await bcrypt.hash('password123', 10),
      isActive: true,
    },
  ]);

  // ===== FLOORS =====
  const floorRepo = ds.getRepository(FloorEntity);
  const floors = await floorRepo.save([
    { name: 'Ground Floor' },
    { name: 'First Floor' },
    { name: 'Second Floor' },
  ]);

  // ===== TABLES =====
  const tableRepo = ds.getRepository(TableEntity);
  const tables = await tableRepo.save([
    // Ground Floor
    { floorId: floors[0].id, capacity: 2, status: 'VACANT', waiterId: null as any },
    { floorId: floors[0].id, capacity: 4, status: 'OCCUPIED', waiterId: waiters[0].id },
    { floorId: floors[0].id, capacity: 6, status: 'VACANT', waiterId: null as any },
    { floorId: floors[0].id, capacity: 4, status: 'OCCUPIED', waiterId: waiters[1].id },
    // First Floor
    { floorId: floors[1].id, capacity: 2, status: 'VACANT', waiterId: null as any },
    { floorId: floors[1].id, capacity: 8, status: 'OCCUPIED', waiterId: waiters[0].id },
    { floorId: floors[1].id, capacity: 4, status: 'VACANT', waiterId: null as any },
    // Second Floor
    { floorId: floors[2].id, capacity: 6, status: 'VACANT', waiterId: null as any },
    { floorId: floors[2].id, capacity: 4, status: 'OCCUPIED', waiterId: waiters[1].id },
  ]);

  // ===== MENU CATEGORIES =====
  const categoryRepo = ds.getRepository(MenuCategoryEntity);
  const categories = await categoryRepo.save([
    { name: 'Starters' },
    { name: 'Main Course' },
    { name: 'Desserts' },
    { name: 'Beverages' },
    { name: 'Appetizers' },
  ]);

  // ===== MENU ITEMS =====
  const itemRepo = ds.getRepository(MenuItemEntity);
  const menuItems = await itemRepo.save([
    // Starters
    {
      name: 'French Fries',
      description: 'Crispy golden fries',
      price: 120,
      categoryId: categories[0].id,
      available: true,
    },
    {
      name: 'Spring Rolls',
      description: 'Fresh vegetable spring rolls',
      price: 150,
      categoryId: categories[0].id,
      available: true,
    },
    {
      name: 'Garlic Bread',
      description: 'Toasted garlic bread',
      price: 100,
      categoryId: categories[0].id,
      available: true,
    },
    {
      name: 'Cheese Fries',
      description: 'Fries with melted cheese',
      price: 140,
      categoryId: categories[0].id,
      available: false,
    },
    // Main Course
    {
      name: 'Burger',
      description: 'Classic beef burger with lettuce and tomato',
      price: 250,
      categoryId: categories[1].id,
      available: true,
    },
    {
      name: 'Pasta Carbonara',
      description: 'Creamy pasta with bacon',
      price: 300,
      categoryId: categories[1].id,
      available: true,
    },
    {
      name: 'Grilled Chicken',
      description: 'Grilled chicken breast with herbs',
      price: 280,
      categoryId: categories[1].id,
      available: true,
    },
    {
      name: 'Fish and Chips',
      description: 'Battered fish with fries',
      price: 320,
      categoryId: categories[1].id,
      available: true,
    },
    // Desserts
    {
      name: 'Chocolate Cake',
      description: 'Rich chocolate cake',
      price: 180,
      categoryId: categories[2].id,
      available: true,
    },
    {
      name: 'Ice Cream',
      description: 'Vanilla ice cream',
      price: 120,
      categoryId: categories[2].id,
      available: true,
    },
    // Beverages
    {
      name: 'Coke',
      description: 'Cold Coca Cola',
      price: 80,
      categoryId: categories[3].id,
      available: true,
    },
    {
      name: 'Orange Juice',
      description: 'Fresh orange juice',
      price: 100,
      categoryId: categories[3].id,
      available: true,
    },
    // Appetizers
    {
      name: 'Chicken Wings',
      description: 'Spicy chicken wings',
      price: 200,
      categoryId: categories[4].id,
      available: true,
    },
    {
      name: 'Nachos',
      description: 'Loaded nachos with cheese',
      price: 220,
      categoryId: categories[4].id,
      available: true,
    },
  ]);

  // ===== ORDERS WITH ITEMS =====
  const orderRepo = ds.getRepository(OrderEntity);
  const orderItemRepo = ds.getRepository(OrderItemEntity);

  // Order 1
  const order1 = await orderRepo.save({
    orderNumber: `ORD-${Date.now()}-001`,
    tableId: tables[1].id,
    waiterId: waiters[0].id,
    status: 'CONFIRMED',
    total: 730,
  });
  await orderItemRepo.save([
    {
      orderId: order1.id,
      menuItemId: menuItems[0].id,
      quantity: 2,
      price: 120,
      instructions: 'Extra salt',
    },
    {
      orderId: order1.id,
      menuItemId: menuItems[4].id,
      quantity: 1,
      price: 250,
      instructions: 'No onions',
    },
  ]);

  // Order 2
  const order2 = await orderRepo.save({
    orderNumber: `ORD-${Date.now()}-002`,
    tableId: tables[3].id,
    waiterId: waiters[1].id,
    status: 'PREPARING',
    total: 400,
  });
  await orderItemRepo.save([
    {
      orderId: order2.id,
      menuItemId: menuItems[5].id,
      quantity: 1,
      price: 300,
    },
    {
      orderId: order2.id,
      menuItemId: menuItems[10].id,
      quantity: 1,
      price: 80,
    },
  ]);

  // Order 3
  const order3 = await orderRepo.save({
    orderNumber: `ORD-${Date.now()}-003`,
    tableId: tables[5].id,
    waiterId: waiters[0].id,
    status: 'SERVED',
    total: 600,
  });
  await orderItemRepo.save([
    {
      orderId: order3.id,
      menuItemId: menuItems[6].id,
      quantity: 2,
      price: 280,
    },
    {
      orderId: order3.id,
      menuItemId: menuItems[8].id,
      quantity: 1,
      price: 180,
    },
  ]);

  // ===== QR TOKENS =====
  const qrRepo = ds.getRepository(QrTokenEntity);
  await qrRepo.save([
    {
      token: 'test-qr-token-001',
      waiterId: waiters[0].id,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
    {
      token: 'test-qr-token-002',
      waiterId: waiters[1].id,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  ]);

  console.log('✅ Seed completed successfully');
  console.log(`
  📊 Seeded Data:
  - ${waiters.length} waiters
  - ${floors.length} floors
  - ${tables.length} tables
  - ${categories.length} categories
  - ${menuItems.length} menu items
  - 3 orders with items
  - 2 QR tokens

  🔑 Test Credentials:
  - waiter1: password123
  - waiter2: password123
  - waiter3: password123
  - waiter4: password123
  `);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
