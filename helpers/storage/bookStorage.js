import { storeData, getData, STORAGE_KEYS } from "./storageCore";
import { checkAndUnlockAchievements } from "../tools/achievementCog";
import { ACHIEVEMENT_TRIGGERS } from "../../constants/achievements";
import * as FileSystem from "expo-file-system";

async function ensureBookInLibrary(bookId) {
  try {
    const libraryBooks = (await getData(STORAGE_KEYS.libraryBooks)) || [];

    // Check if book already exists in library
    if (!libraryBooks.find((b) => b.bookId === bookId)) {
      const newLibraryBook = {
        id: Date.now() + Math.random(),
        bookId: bookId,
        collectionId: null,
        addedAt: new Date().toISOString(),
      };

      libraryBooks.push(newLibraryBook);
      await storeData(STORAGE_KEYS.libraryBooks, libraryBooks);
    }
  } catch (error) {
    console.log("Error ensuring book in library:", error);
  }
}

export async function addToBooksRead(bookId) {
  try {
    const booksRead = (await getData(STORAGE_KEYS.booksRead)) || [];
    if (booksRead.find((b) => b.bookId === bookId)) {
      return { success: false, error: "Book already marked as read" };
    }

    const newBook = {
      id: Date.now() + Math.random(), // Simple ID generation
      bookId: bookId,
      collectionId: null,
      addedAt: new Date().toISOString(),
    };

    booksRead.push(newBook);
    await storeData(STORAGE_KEYS.booksRead, booksRead);
    await ensureBookInLibrary(bookId);
    await checkAndUnlockAchievements(
      ACHIEVEMENT_TRIGGERS.FINISHED_BOOKS_COUNT,
      booksRead.length
    );

    console.log({ success: true, book: newBook });
    return { success: true, book: newBook };
  } catch (error) {
    console.log("Error adding book to read:", error);
    return { success: false, error };
  }
}

export async function getBooksRead() {
  try {
    return (await getData(STORAGE_KEYS.booksRead)) || [];
  } catch (error) {
    console.log("Error getting books read:", error);
    return [];
  }
}

export async function getBooksInCollection(collectionId) {
  try {
    const savedBooks = (await getData(STORAGE_KEYS.savedBooks)) || [];
    return savedBooks.filter((book) => book.collectionId === collectionId);
  } catch (error) {
    console.log("Error getting books in collection:", error);
    return [];
  }
}

export async function addBookToCollection(bookId, collectionId) {
  try {
    const savedBooks = (await getData(STORAGE_KEYS.savedBooks)) || [];
    if (
      savedBooks.find(
        (b) => b.bookId === bookId && b.collectionId === collectionId
      )
    ) {
      return { success: false, error: "Book already in collection" };
    }
    const newSavedBook = {
      id: Date.now() + Math.random(),
      bookId: bookId,
      collectionId: collectionId,
      addedAt: new Date().toISOString(),
    };

    savedBooks.push(newSavedBook);
    await storeData(STORAGE_KEYS.savedBooks, savedBooks);
    await ensureBookInLibrary(bookId);

    return { success: true, savedBook: newSavedBook };
  } catch (error) {
    console.log("Error adding book to collection:", error);
    return { success: false, error };
  }
}

export async function addBookToLibrary(bookId) {
  try {
    const libraryBooks = (await getData(STORAGE_KEYS.libraryBooks)) || [];
    if (libraryBooks.find((b) => b.bookId === bookId)) {
      return { success: false, error: "Book already in library" };
    }

    const newSavedBook = {
      id: Date.now() + Math.random(),
      bookId: bookId,
      collectionId: null, // No specific collection
      addedAt: new Date().toISOString(),
    };

    libraryBooks.push(newSavedBook);
    await storeData(STORAGE_KEYS.libraryBooks, libraryBooks);
    return { success: true, savedBook: newSavedBook };
  } catch (error) {
    console.log("Error adding book to library:", error);
    return { success: false, error };
  }
}

export async function getLibraryBooks() {
  try {
    const libraryBooks = (await getData(STORAGE_KEYS.libraryBooks)) || [];

    // Remove duplicates by bookId, keeping the first occurrence
    const uniqueBooks = libraryBooks.filter(
      (book, index, self) =>
        index === self.findIndex((b) => b.bookId === book.bookId)
    );

    // If duplicates were found, update the stored data
    if (uniqueBooks.length !== libraryBooks.length) {
      await storeData(STORAGE_KEYS.libraryBooks, uniqueBooks);
    }

    return uniqueBooks;
  } catch (error) {
    console.log("Error getting library books:", error);
    return [];
  }
}

export async function removeBookFromLibrary(bookId) {
  try {
    let libraryBooks = (await getData(STORAGE_KEYS.libraryBooks)) || [];
    libraryBooks = libraryBooks.filter((book) => book.bookId !== bookId);
    await storeData(STORAGE_KEYS.libraryBooks, libraryBooks);
    return { success: true };
  } catch (error) {
    console.log("Error removing book from library:", error);
    return { success: false, error };
  }
}

export async function addBookToLikedBooks(bookId) {
  try {
    const likedBooks = (await getData(STORAGE_KEYS.likedBooks)) || [];
    if (likedBooks.find((b) => b.bookId === bookId)) {
      return { success: false, error: "Book already in liked books" };
    }

    const newLikedBook = {
      id: Date.now(),
      bookId: bookId,
      likedAt: new Date().toISOString(),
    };

    likedBooks.push(newLikedBook);
    await storeData(STORAGE_KEYS.likedBooks, likedBooks);
    await ensureBookInLibrary(bookId);
    await checkAndUnlockAchievements(
      ACHIEVEMENT_TRIGGERS.LIKED_BOOKS_COUNT,
      likedBooks.length
    );
    return { success: true, likedBook: newLikedBook };
  } catch (error) {
    console.log("Error adding book to liked books:", error);
    return { success: false, error };
  }
}

export async function getLikedBooks() {
  try {
    return (await getData(STORAGE_KEYS.likedBooks)) || [];
  } catch (error) {
    console.log("Error getting liked books:", error);
    return [];
  }
}

export async function removeBookFromLiked(bookId) {
  try {
    let likedBooks = (await getData(STORAGE_KEYS.likedBooks)) || [];
    likedBooks = likedBooks.filter((book) => book.bookId !== bookId);
    await storeData(STORAGE_KEYS.likedBooks, likedBooks);
    return { success: true };
  } catch (error) {
    console.log("Error removing book from liked books:", error);
    return { success: false, error };
  }
}

/**
 * Add a local PDF book to the library
 * Creates a book object for locally uploaded PDFs
 * @param {Object} bookData - Book data including title, filePath, etc.
 * @returns {Promise<{success: boolean, book?: Object, error?: any}>}
 */
export async function addLocalBookToLibrary(bookData) {
  try {
    const libraryBooks = (await getData(STORAGE_KEYS.libraryBooks)) || [];

    // Create a unique book ID for local books
    const bookId = `local_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const newBook = {
      id: Date.now() + Math.random(),
      bookId: bookId,
      title: bookData.title,
      author: bookData.author || "Unknown Author",
      filePath: bookData.filePath,
      fileName: bookData.fileName,
      fileSize: bookData.fileSize,
      coverUrl: bookData.coverUrl || null,
      description: bookData.description || "Local PDF book uploaded by user.",
      subjects: bookData.subjects || ["User Upload"],
      publishDate: bookData.publishDate || new Date().getFullYear().toString(),
      isLocal: true,
      addedAt: new Date().toISOString(),
      collectionId: null,
    };

    libraryBooks.push(newBook);
    await storeData(STORAGE_KEYS.libraryBooks, libraryBooks);

    return { success: true, book: newBook };
  } catch (error) {
    console.error("Error adding local book to library:", error);
    return { success: false, error };
  }
}

/**
 * Get all local books from library
 * @returns {Promise<Array>} - Array of local book objects
 */
export async function getLocalBooks() {
  try {
    const libraryBooks = (await getData(STORAGE_KEYS.libraryBooks)) || [];
    return libraryBooks.filter((book) => book.isLocal === true);
  } catch (error) {
    console.error("Error getting local books:", error);
    return [];
  }
}

/**
 * Get local book by ID
 * @param {string} bookId - Local book ID
 * @returns {Promise<Object|null>} - Book object or null if not found
 */
export async function getLocalBookById(bookId) {
  try {
    const libraryBooks = (await getData(STORAGE_KEYS.libraryBooks)) || [];
    return (
      libraryBooks.find(
        (book) => book.bookId === bookId && book.isLocal === true
      ) || null
    );
  } catch (error) {
    console.error("Error getting local book by ID:", error);
    return null;
  }
}

/**
 * Remove local book from library and delete file
 * @param {string} bookId - Local book ID
 * @returns {Promise<{success: boolean, error?: any}>}
 */
export async function removeLocalBook(bookId) {
  try {
    const libraryBooks = (await getData(STORAGE_KEYS.libraryBooks)) || [];
    const bookIndex = libraryBooks.findIndex(
      (book) => book.bookId === bookId && book.isLocal === true
    );

    if (bookIndex === -1) {
      return { success: false, error: "Book not found" };
    }

    const book = libraryBooks[bookIndex];

    // Delete the file if it exists
    if (book.filePath) {
      try {
        const fileInfo = await FileSystem.getInfoAsync(book.filePath);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(book.filePath);
        }
      } catch (fileError) {
        console.warn("Could not delete file:", fileError);
        // Continue with removing from library even if file deletion fails
      }
    }

    // Remove from library
    libraryBooks.splice(bookIndex, 1);
    await storeData(STORAGE_KEYS.libraryBooks, libraryBooks);

    return { success: true };
  } catch (error) {
    console.error("Error removing local book:", error);
    return { success: false, error };
  }
}
