/**
 * OpenLibrary API Service
 * Documentation: https://openlibrary.org/developers/api
 */

const BASE_URL = "https://openlibrary.org";

/**
 * Search for books by query with pagination
 * @param {string} query - Search query
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Maximum number of results per page
 * @returns {Promise<Object>} - Object with books array and pagination info
 */

export const searchBooks = async (query, page = 1, limit = 10) => {
  try {
    // Calculate offset based on page number (OpenLibrary uses offset for pagination)
    const offset = (page - 1) * limit;

    const response = await fetch(
      `${BASE_URL}/search.json?q=${encodeURIComponent(
        query
      )}&offset=${offset}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`OpenLibrary API error: ${response.status}`);
    }

    const data = await response.json();

    const books = data.docs.map((book) => ({
      id: book.key,
      title: book.title,
      author: book.author_name ? book.author_name[0] : "Unknown",
      coverUrl: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : null,
      publishYear: book.first_publish_year || "Unknown",
      language: book.language ? book.language[0] : "Unknown",
    }));

    return {
      books,
      pagination: {
        currentPage: page,
        totalItems: data.numFound || 0,
        totalPages: Math.ceil((data.numFound || 0) / limit),
        hasNextPage: offset + books.length < (data.numFound || 0),
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error("Error searching books:", error);
    throw error;
  }
};

/**
 * Get book details by OpenLibrary ID
 * @param {string} bookId - OpenLibrary book ID (e.g., /works/OL1234W)
 * @returns {Promise<Object>} - Book details
 */
export const getBookDetails = async (bookId) => {
  try {
    // Remove leading slash if present
    const id = bookId.startsWith("/") ? bookId.substring(1) : bookId;

    const response = await fetch(`${BASE_URL}/${id}.json`);

    if (!response.ok) {
      throw new Error(`OpenLibrary API error: ${response.status}`);
    }

    const book = await response.json();

    // Get cover image if available
    let coverUrl = null;
    if (book.covers && book.covers.length > 0) {
      coverUrl = `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`;
    }

    return {
      id: book.key,
      title: book.title,
      description:
        book.description?.value ||
        book.description ||
        "No description available",
      coverUrl,
      subjects: book.subjects || [],
      publishDate: book.first_publish_date || "Unknown",
    };
  } catch (error) {
    console.error("Error fetching book details:", error);
    throw error;
  }
};

/**
 * Get author details by OpenLibrary ID
 * @param {string} authorId - OpenLibrary author ID (e.g., /authors/OL1234A)
 * @returns {Promise<Object>} - Author details
 */
export const getAuthorDetails = async (authorId) => {
  try {
    // Remove leading slash if present
    const id = authorId.startsWith("/") ? authorId.substring(1) : authorId;

    const response = await fetch(`${BASE_URL}/${id}.json`);

    if (!response.ok) {
      throw new Error(`OpenLibrary API error: ${response.status}`);
    }

    const author = await response.json();

    return {
      id: author.key,
      name: author.name,
      bio: author.bio?.value || author.bio || "No biography available",
      birthDate: author.birth_date || "Unknown",
      photoUrl:
        author.photos && author.photos.length > 0
          ? `https://covers.openlibrary.org/a/id/${author.photos[0]}-M.jpg`
          : null,
    };
  } catch (error) {
    console.error("Error fetching author details:", error);
    throw error;
  }
};

/**
 * Get book recommendations based on subject with pagination
 * @param {string} subject - Book subject/category
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Maximum number of results per page
 * @returns {Promise<Object>} - Object with books array and pagination info
 */
export const getBooksBySubject = async (subject, page = 1, limit = 10) => {
  try {
    // Calculate offset based on page number
    const offset = (page - 1) * limit;

    const response = await fetch(
      `${BASE_URL}/subjects/${encodeURIComponent(
        subject.toLowerCase()
      )}.json?offset=${offset}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`OpenLibrary API error: ${response.status}`);
    }

    const data = await response.json();

    const books = data.works.map((book) => ({
      id: book.key,
      title: book.title,
      author: book.authors[0]?.name || "Unknown",
      coverUrl: book.cover_id
        ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
        : null,
      publishYear: book.first_publish_year || "Unknown",
    }));

    return {
      books,
      pagination: {
        currentPage: page,
        totalItems: data.work_count || 0,
        totalPages: Math.ceil((data.work_count || 0) / limit),
        hasNextPage: offset + books.length < (data.work_count || 0),
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching books by subject:", error);
    throw error;
  }
};

/**
 * Get book content from OpenLibrary or Internet Archive
 * @param {string} bookId - OpenLibrary book ID (e.g., /works/OL1234W)
 * @returns {Promise<Object>} - Book content with chapters and text
 */
export const getBookContent = async (bookId) => {
  try {
    // Extract the numeric ID from the OpenLibrary ID
    const olid = bookId.split("/").pop().replace("W", "");

    // First check if this book is available in the Internet Archive's Open Library
    const availabilityResponse = await fetch(
      `https://archive.org/services/availability/?identifier=ol${olid}w`
    );

    if (!availabilityResponse.ok) {
      throw new Error(`Availability API error: ${availabilityResponse.status}`);
    }

    const availabilityData = await availabilityResponse.json();
    const isAvailable =
      availabilityData?.items?.[`ol${olid}w`]?.is_readable === true;

    if (!isAvailable) {
      // If not available, try to get a preview or excerpt
      return await getBookExcerpt(bookId);
    }

    // If available, get the book content from Internet Archive
    const contentResponse = await fetch(
      `https://archive.org/download/ol${olid}w/ol${olid}w_djvu.txt`
    );

    if (!contentResponse.ok) {
      // If full text not available, try to get a preview or excerpt
      return await getBookExcerpt(bookId);
    }

    const content = await contentResponse.text();

    // Process the content into chapters (simple implementation)
    const chapters = processBookContent(content);

    return {
      fullText: content,
      chapters: chapters,
      isFullVersion: true,
    };
  } catch (error) {
    console.error("Error fetching book content:", error);
    // Fallback to excerpt if there's an error
    return await getBookExcerpt(bookId);
  }
};

/**
 * Get book excerpt or preview when full content is not available
 * @param {string} bookId - OpenLibrary book ID
 * @returns {Promise<Object>} - Book excerpt with preview text
 */
async function getBookExcerpt(bookId) {
  try {
    // Get the book details which often includes a description or excerpt
    const bookDetails = await getBookDetails(bookId);

    // Generate a preview based on the book description
    const previewText =
      bookDetails.description ||
      "This book is not available for full reading in the public domain. " +
        "You can explore a preview or purchase the book to read the complete content.";

    return {
      fullText: previewText,
      chapters: [
        {
          title: "Preview",
          content: previewText,
        },
      ],
      isFullVersion: false,
    };
  } catch (error) {
    console.error("Error fetching book excerpt:", error);
    return {
      fullText: "Content not available for this book.",
      chapters: [
        {
          title: "Preview",
          content: "Content not available for this book.",
        },
      ],
      isFullVersion: false,
    };
  }
}

/**
 * Process raw book content into chapters
 * @param {string} content - Raw book content
 * @returns {Array} - Array of chapter objects with title and content
 */
function processBookContent(content) {
  // Simple chapter detection - this could be improved with more sophisticated parsing
  const lines = content.split("\n");
  const chapters = [];
  let currentChapter = { title: "Chapter 1", content: "" };
  let chapterCount = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Simple chapter detection - look for lines that might be chapter headings
    if (
      (line.toLowerCase().startsWith("chapter") ||
        line.match(/^[IVX]+\./) || // Roman numerals
        line.match(/^\d+\./) || // Decimal numbers
        line.match(/^[A-Z\s]{5,30}$/)) && // All caps text of reasonable length
      line.length < 50 && // Not too long
      i > 0 &&
      lines[i - 1].trim() === "" && // Preceded by blank line
      i + 1 < lines.length &&
      lines[i + 1].trim() === ""
    ) {
      // Followed by blank line

      // Save the previous chapter if it has content
      if (currentChapter.content.trim().length > 0) {
        chapters.push(currentChapter);
      }

      // Start a new chapter
      chapterCount++;
      currentChapter = {
        title: line,
        content: "",
      };
    } else {
      // Add the line to the current chapter
      currentChapter.content += line + "\n";
    }
  }

  // Add the last chapter
  if (currentChapter.content.trim().length > 0) {
    chapters.push(currentChapter);
  }

  // If no chapters were detected, create a single chapter with all content
  if (chapters.length === 0) {
    chapters.push({
      title: "Full Text",
      content: content,
    });
  }

  return chapters;
}
