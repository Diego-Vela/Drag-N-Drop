// src/data/database.ts
import * as SQLite from 'expo-sqlite';

export const dbPromise = SQLite.openDatabaseAsync('droppers.db');

// Create tables if they don't exist
export async function initDatabase() {
  const db = await dbPromise;
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS locations (
      id TEXT PRIMARY KEY NOT NULL,
      location TEXT NOT NULL UNIQUE,
      customer_id TEXT NOT NULL,
      FOREIGN KEY (customer_id) REFERENCES customers (id)
    );

    CREATE TABLE IF NOT EXISTS units (
      id TEXT PRIMARY KEY NOT NULL,
      unit TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS assignments (
      unit_id TEXT NOT NULL,
      location_id TEXT NOT NULL,
      PRIMARY KEY (unit_id, location_id),
      FOREIGN KEY (unit_id) REFERENCES units (id),
      FOREIGN KEY (location_id) REFERENCES locations (id)
    );
  `);
}
