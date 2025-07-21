import { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import Toast from "react-native-toast-message";

import MessageInput from "../components/Chat/MessageInput";
import ChatHistory from "../components/Chat/ChatHistory";
import { ChatContext } from "../store/ChatContext";
import {
  getBotResponse,
  getInitialBotResponse,
} from "../helpers/chatbot/chatbot";
import { logGeminiHistoryCompact } from "../helpers/tools/loggers";

function ChatScreen() {
  const chatContext = useContext(ChatContext);
  const [userMessage, setUserMessage] = useState("");

  function userMessageInputHandler(enteredText) {
    setUserMessage(enteredText);
  }

  async function sendMessageHandler() {
    if (!isValidMessage()) {
      Toast.show({
        type: "info",
        text1: "Empty Message!",
        text2: "Your message is empty, enter something to chat.",
      });
      return;
    }

    try {
      const response = await getBotResponse(chatContext, userMessage);
      chatContext.addChat(userMessage, true);
      chatContext.addChat(response, false);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error!",
        text2:
          "An unexpected error occurred while the bot was trying to respond to your message.",
      });
      console.error(
        "An unexpected error has occurred while trying to send a user's message: ",
        err
      );
    }
    setUserMessage("");
  }

  function isValidMessage() {
    return userMessage.trim().length > 0;
  }

  useEffect(() => {
    async function fetchInitialResponse() {
      const response = await getInitialBotResponse(chatContext);
      chatContext.addChat(response, false);
    }

    fetchInitialResponse();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <View style={styles.chatContainer}>
        <ChatHistory data={chatContext.chatHistory} />
      </View>
      <MessageInput
        message={userMessage}
        onSendMessage={sendMessageHandler}
        onChange={userMessageInputHandler}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  chatContainer: {
    flex: 2,
    marginTop: 10,
    paddingHorizontal: 10,
    margin: 20,
  },
});

export default ChatScreen;
