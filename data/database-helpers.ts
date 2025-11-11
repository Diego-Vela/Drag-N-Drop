import { Alert } from 'react-native';
import { dbPromise } from './database';
import type { Customer, Location, Unit, Assignment, CustomerLocation, AssignmentObject } from '../contexts';
import * as Crypto from 'expo-crypto';

//#region TODO
/*
  All of these functions will need to write to the actual database as well as the sqlite model. If the write to the database fails, the sqlite does not update.
  To achieve this, I will probably also need a refresh button somewhere that will refetch from the proper database.
*/

// Patch/Update/Post
export async function addCustomer(id: string, name: string) {
  const db = await dbPromise;
  await db.runAsync(
    'INSERT INTO customers (id, name) VALUES (?, ?)',
    [id, name]
  );
  console.log(`Added customer: ${name}`);
}

export async function addLocation(
  id: string,
  location: string,
  customer_id: string | null
) {
  const db = await dbPromise;

  try {
    if (!customer_id) {
      throw new Error('Cannot add location: customer_id is missing or null.');
    }

    const existingCustomer = await db.getFirstAsync(
      'SELECT id FROM customers WHERE id = ?',
      [customer_id]
    );

    if (!existingCustomer) {
      throw new Error(
        `Cannot add location: customer_id '${customer_id}' not found in customers table.`
      );
    }

    await db.runAsync(
      'INSERT INTO locations (id, location, customer_id) VALUES (?, ?, ?)',
      [id, location, customer_id]
    );

    console.log(`Added location: ${location}`);
    return true; 

  } catch (err: any) {
    console.error('Error adding location:', err.message);

    Alert.alert('Add Location Failed', err.message || 'Unexpected error occurred.');

    return false;
  }
}

export async function addUnit( unit: string): Promise<boolean> {
  const db = await dbPromise;
  const id = Crypto.randomUUID();
  try {
    await db.runAsync(
      'INSERT INTO units (id, unit) VALUES (?, ?)',
      [id, unit]
    );
    console.log(`Added unit: ${unit}`);
    return true;
  } catch(err) {
    return false;
  }
}

export async function addAssignment(id: string, unit_id: string, location_id: string) {
  const db = await dbPromise;
  try {
    await db.runAsync(
      'INSERT INTO assignments (id, unit_id, location_id) VALUES (?, ?, ?)',
      [id, unit_id, location_id]
    );
    return true;
  } catch (err) {
    return false;
  }
}

// Get
export async function getCustomers(): Promise<Customer[]> {
  const db = await dbPromise;
  const result = await db.getAllAsync('SELECT * FROM customers');
  return result as Customer[]; 
}

export async function getLocations(): Promise<Location[]> {
  const db = await dbPromise;
  const result = await db.getAllAsync('SELECT id, customer_id, location AS name FROM locations');
  return result as Location[];
}

export async function getUnits(): Promise<Unit[]> {
  const db = await dbPromise;
  const result = await db.getAllAsync('SELECT id, unit AS name FROM units');
  return result as Unit[];
}

export async function getAssignments(): Promise<Assignment[]> {
  const db = await dbPromise;
  const result = await db.getAllAsync('Select id, unit_id AS unitID, location_id AS locationID FROM assignments');
  return result as Assignment[];
}

export async function getCustomerLocations(): Promise<CustomerLocation[]> {
  const db = await dbPromise;
  const result = await db.getAllAsync(
    `SELECT
      c.id AS customer_id,
      c.name AS customer_name,
      l.id AS location_id,
      l.location AS location_name
    FROM customers c
    JOIN locations l ON l.customer_id = c.id`
  );
  return result as CustomerLocation[];
}

//#region Temps
export async function addCustomerLocationPair(
  customerName: string,
  locationName: string
): Promise<boolean> {
  const db = await dbPromise;

  try {
    // 1️⃣ Check if customer already exists
    const existing = await db.getFirstAsync<{ id: string }>(
      'SELECT id FROM customers WHERE name = ?',
      [customerName]
    );

    // 2️⃣ Generate a UUID using Expo Crypto (always async-safe)
    const customerId = existing?.id ?? (await Crypto.randomUUID());

    // 3️⃣ Create the customer if it doesn't exist
    if (!existing) {
      await addCustomer(customerId, customerName);
      console.log(`✅ Created new customer: ${customerName}`);
    }

    // 4️⃣ Add the location (uses your prebuilt validation)
    const locationId = await Crypto.randomUUID();
    const success = await addLocation(locationId, locationName, customerId);

    if (!success) {
      throw new Error(`Failed to create location '${locationName}'.`);
    }

    console.log(`✅ Added location '${locationName}' for ${customerName}`);
    return true;
  } catch (err: any) {
    console.error('❌ Failed to add customer/location pair:', err.message);
    Alert.alert(
      'Add Customer/Location Failed',
      err.message || 'Unexpected error occurred.'
    );
    return false;
  }
}

export async function dropAllTables() {
  const db = await dbPromise;

  try {
    await db.execAsync(`
      DROP TABLE IF EXISTS customers;
      DROP TABLE IF EXISTS locations;
      DROP TABLE IF EXISTS units;
      DROP TABLE IF EXISTS assignments;
    `);
  } catch (err) {
    console.error('Error dropping tables:', err);
  }
}
