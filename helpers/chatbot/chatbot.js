import { fetchProfile } from "../storage/profileStorage";
import {
  generateText,
  generateTextWithHistory,
} from "../../services/geminiService";
import {
  chatbotPrompt,
  chatbotPromptTemplates,
  polishScannedTextPrompt,
  polishScannedTextPromptTemplates,
  tassieInsightsPrompt,
  tassieInsightsPromptTemplates,
} from "./prompts";

import {
  getLibraryBooks,
  getLikedBooks,
  getBooksRead,
} from "../storage/bookStorage";
import { getBookDetails } from "../../services/openLibraryService";
import { parseBotResponse } from "./responseParser";
import {
  tassieMoods,
  tassieStickers,
  possibleTassieMoodNames,
  possibleTassieStickerNames,
} from "./tassieAssets";

function cleanMarkdownFormatting(text) {
  if (!text || typeof text !== "string") return text;

  return (
    text
      // Remove bold formatting (**text** or __text__)
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/__(.*?)__/g, "$1")
      // Remove italic formatting (*text* or _text_)
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/_(.*?)_/g, "$1")
      // Remove other common markdown symbols
      .replace(/`(.*?)`/g, "$1")
      // Clean up any remaining asterisks or underscores that might be used for emphasis
      .replace(/[\*_]/g, "")
  );
}

// Add retry mechanism for JSON parsing
async function generateResponseWithRetry(
  promptOrHistory,
  maxRetries = 3,
  isInitialPrompt = false
) {
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries} to generate response`);

      let response;
      if (isInitialPrompt) {
        response = await generateText(promptOrHistory);
      } else {
        response = await generateTextWithHistory(promptOrHistory);
      }

      console.log(`Raw response attempt ${attempt}:`, response);

      // Try to parse the response
      const parsedResponse = parseBotResponse(response);

      // Clean any markdown formatting from the response text
      if (parsedResponse.response) {
        parsedResponse.response = cleanMarkdownFormatting(
          parsedResponse.response
        );
      }

      console.log(
        `Successfully parsed response on attempt ${attempt}:`,
        parsedResponse
      );
      return parsedResponse;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      lastError = error;

      // If this is not the last attempt, wait a bit before retrying
      if (attempt < maxRetries) {
        console.log(`Waiting before retry...`);
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
      }
    }
  }

  // If all retries failed, return a fallback response
  console.error(`All ${maxRetries} attempts failed. Last error:`, lastError);

  return {
    response:
      "Sorry, I'm having trouble responding right now. Can you try asking again?",
    mood: "",
    sticker: "",
  };
}

async function getChatbotPrompt(profile) {
  let modifiedPrompt = chatbotPrompt;

  // Plug in profile data
  modifiedPrompt = modifiedPrompt.replace(
    chatbotPromptTemplates.firstName,
    profile.getFirstName()
  );
  modifiedPrompt = modifiedPrompt.replace(
    chatbotPromptTemplates.lastName,
    profile.getLastName()
  );
  modifiedPrompt = modifiedPrompt.replace(
    chatbotPromptTemplates.preferredCategories,
    profile.getPreferredCategories()
  );
  modifiedPrompt = modifiedPrompt.replace(
    chatbotPromptTemplates.preferredReadingTime,
    profile.getPreferredReadingTime()
  );
  modifiedPrompt = modifiedPrompt.replace(
    chatbotPromptTemplates.readingSpeed,
    profile.getReadingSpeed()
  );
  modifiedPrompt = modifiedPrompt.replace(
    chatbotPromptTemplates.ageGroup,
    profile.getAgeGroup()
  );

  // Plug in books data
  const libraryBooks = await getLibraryBooks();
  const likedBooks = await getLikedBooks();
  const finishedBooks = await getBooksRead();

  modifiedPrompt = modifiedPrompt.replace(
    chatbotPromptTemplates.libraryBooks,
    toBookListPromptString(await getBookListFromIds(libraryBooks), 5)
  );
  modifiedPrompt = modifiedPrompt.replace(
    chatbotPromptTemplates.finishedBooks,
    toBookListPromptString(await getBookListFromIds(finishedBooks), 5)
  );
  modifiedPrompt = modifiedPrompt.replace(
    chatbotPromptTemplates.likedBooks,
    toBookListPromptString(await getBookListFromIds(likedBooks), 5)
  );

  // Plug in mood and sticker data
  modifiedPrompt = modifiedPrompt.replace(
    chatbotPromptTemplates.possibleMoods,
    possibleTassieMoodNames
  );
  modifiedPrompt = modifiedPrompt.replace(
    chatbotPromptTemplates.possibleStickers,
    possibleTassieStickerNames
  );

  console.log("Modified Chatbot Prompt: ", modifiedPrompt);

  return modifiedPrompt;
}

export async function generateTassieInsights(text) {
  const profile = await fetchProfile();
  let modifiedPolishPrompt = polishScannedTextPrompt;
  modifiedPolishPrompt = modifiedPolishPrompt.replace(
    polishScannedTextPromptTemplates.scannedText,
    text
  );
  const polishedScannedText = await generateText(modifiedPolishPrompt);
  const libraryBooks = await getLibraryBooks();

  console.info("Polished Scanned Text: ", polishedScannedText);

  let modifiedInsightsPrompt = tassieInsightsPrompt;
  modifiedInsightsPrompt = modifiedInsightsPrompt.replace(
    tassieInsightsPromptTemplates.text,
    polishedScannedText
  );
  modifiedInsightsPrompt = modifiedInsightsPrompt.replace(
    tassieInsightsPromptTemplates.text,
    toBookListPromptString(await getBookListFromIds(libraryBooks), 5)
  );
  modifiedInsightsPrompt = modifiedInsightsPrompt.replace(
    tassieInsightsPromptTemplates.userGenre,
    profile.getPreferredCategories()
  );
  const insights = await generateText(modifiedInsightsPrompt);
  console.info("Tassie Insights: ", insights);

  return insights;
}

export function getTassieMood(moodName) {
  if (!possibleTassieMoodNames.includes(moodName)) {
    return null;
  }

  const tassieMoodImages = tassieMoods[moodName];
  return tassieMoodImages[Math.floor(Math.random() * tassieMoodImages.length)];
}

export function getTassieSticker(stickerName) {
  if (!possibleTassieStickerNames.includes(stickerName)) {
    return null;
  }

  const tassieStickerImages = tassieStickers[stickerName];
  return tassieStickerImages[
    Math.floor(Math.random() * tassieStickerImages.length)
  ];
}

async function getBookListFromIds(books) {
  const bookList = [];
  for (let book of books) {
    if (book.bookId.startsWith("local_")) {
      continue; // Skip local books
    }
    const bookDetails = await getBookDetails(book.bookId);
    bookList.push(bookDetails);
  }
  return bookList;
}

function toBookListPromptString(bookList, limit = 5) {
  if (!bookList || bookList.length === 0) {
    return "None";
  }

  const bookListNames = [];
  for (let book of bookList) {
    bookListNames.push(`- ${book.title}`);
    if (bookListNames.length >= limit) {
      break;
    }
  }
  return bookListNames.join("\n");
}

export async function getInitialBotResponse(chatbotContext) {
  const userProfile = await fetchProfile();
  const fullModifiedPrompt = await getChatbotPrompt(userProfile);
  chatbotContext.updateInitialPrompt(fullModifiedPrompt);

  return await generateResponseWithRetry(fullModifiedPrompt, 3, true);
}

export async function getBotResponse(chatbotContext, userMessage) {
  const newMessage = {
    role: "user",
    text: userMessage,
  };

  // Create the complete history array including the initial prompt as a user message
  // since Gemini only supports user and model roles
  const completeHistory = [
    {
      role: "user", // Changed from system to user since Gemini doesn't support system
      text: chatbotContext.initialPrompt,
    },
    ...chatbotContext.chatHistory,
    newMessage,
  ];

  console.log("Complete History with Initial Prompt:", completeHistory);

  const response = await generateResponseWithRetry(completeHistory, 3, false);
  console.log("Final Tassie Response:", response);

  return response;
}
