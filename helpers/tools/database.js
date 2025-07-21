import * as SQLite from "expo-sqlite";

const database = SQLite.openDatabaseAsync("basabuddy.db");

// The logins table will primarily be used for tracking the streak
export function init() {
  return database.runAsync(`
CREATE TABLE readingStreak (
    id INTEGER PRIMARY KEY NOT NULL,
    lastReadDate TEXT KEY NOT NULL
)`);
}
