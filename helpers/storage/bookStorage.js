import { storeData, getData, STORAGE_KEYS } from "./storageCore";

export async function addToBooksRead(book) {
  try {
    const booksRead = (await getData(STORAGE_KEYS.booksRead)) || [];
    if (booksRead.find((b) => b.bookId === book.bookId)) {
      return { success: false, error: "Book already marked as read" };
    }
    const newBook = {
      id: Date.now(), // Simple ID generation
      title: book.title,
      author: book.author,
      description: book.description,
      addedAt: new Date().toISOString(),
    };

    booksRead.push(newBook);
    await storeData(STORAGE_KEYS.booksRead, booksRead);
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
      id: Date.now(),
      bookId: bookId,
      collectionId: collectionId,
      addedAt: new Date().toISOString(),
    };

    savedBooks.push(newSavedBook);
    await storeData(STORAGE_KEYS.savedBooks, savedBooks);
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
      id: Date.now(),
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
    return (await getData(STORAGE_KEYS.libraryBooks)) || [];
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
