import { generateText, generateTextWithHistory } from "../tools/gemini";
import { chatbotPrompt } from "./prompt";

export async function getInitialBotResponse() {
  const response = await generateText(chatbotPrompt);
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

function getFullPrompt() {
  // TODO: Implement function
}
