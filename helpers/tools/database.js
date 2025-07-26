import * as SQLite from "expo-sqlite";

import Profile from "../../models/profile";
import Collection from "../../models/collection";

const database = SQLite.openDatabaseAsync("basabuddy.db");
const tables = {
  profile: "profile",
  booksRead: "booksRead",
  collections: "collections",
  savedBooks: "savedBooks",
};

export async function init() {
  const db = await database;

  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS ${tables.booksRead} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      description TEXT
    );
  `);

  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS ${tables.profile} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      favoriteGenre TEXT NOT NULL,
      preferredReadingTime TEXT NOT NULL,
      readingSpeed TEXT NOT NULL
    );
  `);

  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS ${tables.collections} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL
    );
  `);

  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS ${tables.savedBooks} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bookId INTEGER NOT NULL,
      collectionId INTEGER NOT NULL,
      FOREIGN KEY (collectionId) REFERENCES collections(id)
    )
  `);

  await db.runAsync(`
    INSERT INTO ${tables.collections} (title)
    VALUES ('Want to Read'),
           ('Currently Reading'),
           ('Read Books')
  `);
}

/*
  This is primarily used for testing and debugging.
  Do not use this for production.
*/
export async function resetDatabase() {
  const db = await database;
  for (let key of Object.keys(tables)) {
    await db.runAsync(`DROP TABLE IF EXISTS ${tables[key]}`);
  }
  await init();
  console.info("Database has been reset!");
}

export async function createProfile(profile) {
  const db = await database;

  // If using object with getter methods
  return await db.runAsync(
    `INSERT INTO profile (firstName, lastName, favoriteGenre, preferredReadingTime, readingSpeed)
     VALUES (?, ?, ?, ?, ?)`,
    [
      profile.getFirstName(),
      profile.getLastName(),
      profile.getFavoriteGenre(),
      profile.getPreferredReadingTime(),
      profile.getReadingSpeed(),
    ]
  );
}

// Read Profile(s)
export async function fetchProfile() {
  const db = await database;
  const result = await db.getFirstAsync(`SELECT * FROM profile LIMIT 1`);

  if (!result) return null;

  return new Profile(
    result.firstName,
    result.lastName,
    result.favoriteGenre,
    result.preferredReadingTime,
    result.readingSpeed
  );
}

export async function updateProfile(id, updatedProfile) {
  const db = await database;

  // If using object with properties
  if (typeof updatedProfile === "object" && !updatedProfile.getFirstName) {
    return await db.runAsync(
      `UPDATE profile 
       SET firstName = ?, lastName = ?, favoriteGenre = ?, preferredReadingTime = ?, readingSpeed = ?
       WHERE id = ?`,
      [
        updatedProfile.firstName,
        updatedProfile.lastName,
        updatedProfile.favoriteGenre,
        updatedProfile.preferredReadingTime,
        updatedProfile.readingSpeed,
        id,
      ]
    );
  }

  // If using object with getter methods
  return await db.runAsync(
    `UPDATE profile 
     SET firstName = ?, lastName = ?, favoriteGenre = ?, preferredReadingTime = ?, readingSpeed = ?
     WHERE id = ?`,
    [
      updatedProfile.getFirstName(),
      updatedProfile.getLastName(),
      updatedProfile.getFavoriteGenre(),
      updatedProfile.getPreferredReadingTime(),
      updatedProfile.getReadingSpeed(),
      id,
    ]
  );
}

export async function hasProfile() {
  const db = await database;
  const result = await db.getFirstAsync(
    `SELECT COUNT(*) as count FROM profile`
  );
  return result.count > 0;
}

export async function getCollections() {
  const db = await database;
  const result = await db.getAllAsync(`SELECT * FROM collections`);
  return result.map(
    (collection) => new Collection(collection.id, collection.title)
  );
}
