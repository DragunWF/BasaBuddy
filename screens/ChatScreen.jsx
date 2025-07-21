import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

import ChatBubble from "../components/Chat/ChatBubble";

function ChatScreen() {
  const [userMessage, setUserMessage] = useState("");

  function userMessageInputHandler() {}

  function sendMessageHandler() {}

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <View style={styles.chatContainer}>
        
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
  },
});

export default ChatScreen;
