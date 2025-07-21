import { generateText } from "../tools/gemini";
import { chatbotPrompt } from "./prompt";

export function getInitialBotResponse() {
  const response = generateText(chatbotPrompt);
  return response;
}

export function getBotResponse(chatbotContext, userMessage) {
  const newMessage = {
    role: "user",
    text: userMessage,
  };
  const updatedHistory = [...chatbotContext.chatHistory, newMessage];
  chatbotContext.addChat(newMessage);

  const response = generateTextWithHistory(updatedHistory);
  // TODO: Plug in values from the user's most recently read books
  return response;
}

function getFullPrompt() {
  // TODO: Implement function
}
