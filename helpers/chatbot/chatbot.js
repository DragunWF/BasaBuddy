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
import { dummyBooksRead } from "../tools/dummyData";

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

export async function getInitialBotResponse(chatbotContext) {
  const userProfile = await fetchProfile();
  const fullModifiedPrompt = await getChatbotPrompt(userProfile);
  const response = await generateText(fullModifiedPrompt);
  chatbotContext.setInitialChatbotPrompt(fullModifiedPrompt);
  return parseBotResponse(response);
}

export async function getBotResponse(chatbotContext, userMessage) {
  const newMessage = {
    role: "user",
    text: userMessage,
  };
  const updatedHistory = [
    { role: "model", text: chatbotContext.initialChatbotPrompt },
    ...chatbotContext.chatHistory,
    newMessage,
  ];

  const response = await generateTextWithHistory(updatedHistory);

  console.log("Tassie Response: ", response);

  return parseBotResponse(response);
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
  console.info("Polished Scanned Text: ", polishedScannedText);

  let modifiedInsightsPrompt = tassieInsightsPrompt;
  modifiedInsightsPrompt = modifiedInsightsPrompt.replace(
    tassieInsightsPromptTemplates.text,
    polishedScannedText
  );
  modifiedInsightsPrompt = modifiedInsightsPrompt.replace(
    tassieInsightsPromptTemplates.text,
    dummyBooksRead // Replace this in the future
  );
  modifiedInsightsPrompt = modifiedInsightsPrompt.replace(
    tassieInsightsPromptTemplates.userGenre,
    profile.getFavoriteGenre()
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
