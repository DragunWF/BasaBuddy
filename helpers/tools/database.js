import * as SQLite from "expo-sqlite";
import Profile from "../../models/profile";

const database = SQLite.openDatabaseAsync("basabuddy.db");

export async function init() {
  const db = await database;

  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS booksRead (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      description TEXT
    );
  `);

  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      favoriteGenre TEXT NOT NULL,
      preferredReadingTime TEXT NOT NULL,
      readingSpeed TEXT NOT NULL
    );
  `);
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

export async function resetDatabase() {
  const db = await database;
  await db.runAsync(`DROP TABLE IF EXISTS profile`);
  await db.runAsync(`DROP TABLE IF EXISTS booksRead`);
  await init();
  console.info("Database has been reset!");
}
