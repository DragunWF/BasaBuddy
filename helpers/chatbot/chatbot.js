import { fetchProfile } from "../tools/database";
import { generateText, generateTextWithHistory } from "../tools/gemini";
import { chatbotPrompt, promptTemplates } from "./prompt";
import { dummyBooksRead } from "../tools/dummyData";

export async function getInitialBotResponse() {
  const userProfile = await fetchProfile();
  const fullModifiedPrompt = await getFullPrompt(userProfile, dummyBooksRead);
  const response = await generateText(fullModifiedPrompt);
  return response;
}

export async function getBotResponse(chatbotContext, userMessage) {
  const newMessage = {
    role: "user",
    text: userMessage,
  };
  const updatedHistory = [...chatbotContext.chatHistory, newMessage];

  const response = await generateTextWithHistory(updatedHistory);
  // TODO: Plug in values from the user's most recently read books
  return response;
}

async function getFullPrompt(profile, booksRead) {
  let modifiedPrompt = chatbotPrompt;
  modifiedPrompt = modifiedPrompt.replace(
    promptTemplates.firstName,
    profile.getFirstName()
  );
  modifiedPrompt = modifiedPrompt.replace(
    promptTemplates.lastName,
    profile.getLastName()
  );
  modifiedPrompt = modifiedPrompt.replace(
    promptTemplates.favoriteGenre,
    profile.getFavoriteGenre()
  );
  modifiedPrompt = modifiedPrompt.replace(
    promptTemplates.preferredReadingTime,
    profile.getPreferredReadingTime()
  );
  modifiedPrompt = modifiedPrompt.replace(
    promptTemplates.readingSpeed,
    profile.getReadingSpeed()
  );

  const booksReadNames = [];
  for (let book of booksRead) {
    booksReadNames.push(`- ${book.getTitle()} by ${book.getAuthor()}`);
  }
  modifiedPrompt = modifiedPrompt.replace(
    promptTemplates.bookList,
    booksReadNames.join("\n")
  );

  return modifiedPrompt;
}
