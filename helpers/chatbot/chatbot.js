import { fetchProfile } from "../storage/storageCore";
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
} from "./prompt";
import { dummyBooksRead } from "../tools/dummyData";

export async function getInitialBotResponse(chatbotContext) {
  const userProfile = await fetchProfile();
  const fullModifiedPrompt = await getChatbotPrompt(
    userProfile,
    dummyBooksRead
  );
  const response = await generateText(fullModifiedPrompt);
  chatbotContext.setInitialChatbotPrompt(fullModifiedPrompt);
  return response;
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
  // TODO: Plug in values from the user's most recently read books
  return response;
}

async function getChatbotPrompt(profile, booksRead) {
  let modifiedPrompt = chatbotPrompt;
  modifiedPrompt = modifiedPrompt.replace(
    chatbotPromptTemplates.firstName,
    profile.getFirstName()
  );
  modifiedPrompt = modifiedPrompt.replace(
    chatbotPromptTemplates.lastName,
    profile.getLastName()
  );
  modifiedPrompt = modifiedPrompt.replace(
    chatbotPromptTemplates.favoriteGenre,
    profile.getFavoriteGenre()
  );
  modifiedPrompt = modifiedPrompt.replace(
    chatbotPromptTemplates.preferredReadingTime,
    profile.getPreferredReadingTime()
  );
  modifiedPrompt = modifiedPrompt.replace(
    chatbotPromptTemplates.readingSpeed,
    profile.getReadingSpeed()
  );

  const booksReadNames = [];
  for (let book of booksRead) {
    booksReadNames.push(`- ${book.getTitle()} by ${book.getAuthor()}`);
  }
  modifiedPrompt = modifiedPrompt.replace(
    chatbotPromptTemplates.bookList,
    booksReadNames.join("\n")
  );

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
