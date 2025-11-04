import { dbPromise } from './database';

export async function addCustomer(id: string, name: string) {
  const db = await dbPromise;
  await db.runAsync(
    'INSERT INTO customers (id, name) VALUES (?, ?)',
    [id, name]
  );
  console.log(`Added customer: ${name}`);
}

export async function addLocation(id: string, location: string, customer_id: string) {
  const db = await dbPromise;
  await db.runAsync(
    'INSERT INTO locations (id, location, customer_id) VALUES (?, ?, ?)',
    [id, location, customer_id]
  );
  console.log(`Added location: ${location}`);
}

export async function addUnit(id: string, unit: string) {
  const db = await dbPromise;
  await db.runAsync(
    'INSERT INTO units (id, unit) VALUES (?, ?)',
    [id, unit]
  );
  console.log(`Added unit: ${unit}`);
}

export async function addAssignment(id: string, unit_id: string, location_id: string) {
  const db = await dbPromise;
  await db.runAsync(
    'INSERT INTO assignments (id, unit_id, location_id) VALUES (?, ?, ?)',
    [id, unit_id, location_id]
  );
  console.log(`Added assignment: ${id}`);
}

// Get
export async function getCustomers() {
  const db = await dbPromise;
  const result = await db.getAllAsync('SELECT * FROM customers');
  return result; 
}
