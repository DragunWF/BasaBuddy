import { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  Alert,
} from "react-native";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";

import CustomBackground from "../components/Chat/CustomBackground";
import MessageInput from "../components/Chat/MessageInput";
import ChatHistory from "../components/Chat/ChatHistory";
import { ChatContext } from "../store/ChatContext";
import {
  getBotResponse,
  getInitialBotResponse,
  generateTassieInsights,
} from "../helpers/chatbot/chatbot";
import { performOCR } from "../services/ocrService";

function ChatScreen() {
  const chatContext = useContext(ChatContext);

  // TODO: Make selected image show in a user chat bubble
  const [selectedImage, setSelectedImage] = useState(null);
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

    setUserMessage("");
    try {
      const trimmedMessage = userMessage.trim();
      if (trimmedMessage.length === 0) {
        Toast.show({
          type: "info",
          text1: "Empty Message!",
          text2: "Your message is empty, enter something to chat.",
        });
        return;
      }

      const response = await getBotResponse(chatContext, trimmedMessage);
      chatContext.addChat(trimmedMessage, true);
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
  }

  async function sendImageHandler() {
    Alert.alert(
      "Book Page Scanner",
      "Scan a page from a book with your camera or select an image of a page from your gallery to get insight from Tassie!",
      [
        {
          text: "Take Photo",
          onPress: () => bookPageImageHandler(true),
          style: "default",
        },
        {
          text: "Open Image Gallery",
          onPress: () => bookPageImageHandler(false),
          style: "default",
        },
      ]
    );
  }

  async function bookPageImageHandler(isTakePhoto) {
    let result;
    if (isTakePhoto) {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        base64: true,
        allowsMultipleSelection: false,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        base64: true,
        allowsMultipleSelection: false,
      });
    }

    if (!result.canceled) {
      try {
        // Perform OCR on the selected image
        console.log("Performing OCR...");
        const extractedText = await performOCR(result.assets[0]);
        console.log("Finished performing OCR");

        // Set the selected image in state
        setSelectedImage(result.assets[0].uri);
        chatContext.addChatWithImage(result.assets[0].uri, true);
        console.log("Extracted Text:", extractedText);

        // Only generate insights if OCR was successful and we have text
        if (extractedText && extractedText.trim()) {
          console.log("Generating Tassie insights...");
          const tassieInsights = await generateTassieInsights(extractedText);
          console.log("Finished generating Tassie insights");

          chatContext.addChat(tassieInsights, false);
        } else {
          console.log("No text extracted, skipping insights generation");
        }
      } catch (error) {
        console.log("Error in pickImageGallery:", error);
        // Still set the image even if OCR fails
        setSelectedImage(result.assets[0].uri);
      }
    }
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
    <SafeAreaView style={styles.safeArea}>
      <CustomBackground
        imageSource={require("../assets/tassie/background.png")}
      >
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
            onSendImage={sendImageHandler}
            onChange={userMessageInputHandler}
          />
        </KeyboardAvoidingView>
      </CustomBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  chatContainer: {
    flex: 2,
    marginTop: 80,
    paddingHorizontal: 10,
  },
});

export default ChatScreen;
