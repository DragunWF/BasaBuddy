import * as SQLite from "expo-sqlite";

const database = SQLite.openDatabaseAsync("basabuddy.db");

// The logins table will primarily be used for tracking the streak
export function init() {
  return database.runAsync(`
CREATE TABLE booksRead (
    id INTEGER PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT
)`);
}
