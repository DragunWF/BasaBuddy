import { useState, useContext, useEffect, useCallback, useMemo } from "react";
import {
  StyleSheet,
  View,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Text,
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

const ChatScreen = () => {
  const chatContext = useContext(ChatContext);

  // State management
  const [selectedImage, setSelectedImage] = useState(null);
  const [userMessage, setUserMessage] = useState("");
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [hasInitialResponse, setHasInitialResponse] = useState(false);

  // Memoized validation function
  const isValidMessage = useMemo(() => {
    return userMessage.trim().length > 0;
  }, [userMessage]);

  // Optimized message input handler
  const userMessageInputHandler = useCallback((enteredText) => {
    setUserMessage(enteredText);
  }, []);

  // Enhanced message sending with better error handling
  const sendMessageHandler = useCallback(async () => {
    if (!isValidMessage || isSendingMessage) {
      if (!isValidMessage) {
        Toast.show({
          type: "info",
          text1: "Empty Message",
          text2: "Please enter a message to send.",
          visibilityTime: 3000,
        });
      }
      return;
    }

    const trimmedMessage = userMessage.trim();
    setUserMessage("");
    setIsSendingMessage(true);

    try {
      // Add user message immediately for better UX
      chatContext.addChat(trimmedMessage, true);

      // Get bot response
      const response = await getBotResponse(chatContext, trimmedMessage);
      chatContext.addChat(response, false);
    } catch (err) {
      console.error("Error sending message:", err);

      // More specific error handling
      const errorMessage = err.message?.includes("network")
        ? "Network error. Please check your connection and try again."
        : "Failed to get response. Please try again.";

      Toast.show({
        type: "error",
        text1: "Message Failed",
        text2: errorMessage,
        visibilityTime: 4000,
      });

      // Optionally remove the user message if bot response failed
      // chatContext.removeLastUserMessage();
    } finally {
      setIsSendingMessage(false);
    }
  }, [isValidMessage, isSendingMessage, userMessage, chatContext]);

  // Enhanced image handling with better UX
  const sendImageHandler = useCallback(async () => {
    if (isProcessingImage) {
      Toast.show({
        type: "info",
        text1: "Processing Image",
        text2: "Please wait while we process your current image.",
      });
      return;
    }

    // Request permissions first
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "We need camera roll permissions to select images.",
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Book Page Scanner",
      "Choose how you'd like to add an image:",
      [
        {
          text: "Take Photo",
          onPress: () => bookPageImageHandler(true),
          style: "default",
        },
        {
          text: "Select from Gallery",
          onPress: () => bookPageImageHandler(false),
          style: "default",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  }, [isProcessingImage]);

  // Improved image processing with better error handling
  const bookPageImageHandler = useCallback(
    async (isTakePhoto) => {
      setIsProcessingImage(true);

      try {
        let result;

        if (isTakePhoto) {
          // Check camera permissions
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              "Camera Permission Required",
              "We need camera permissions to take photos.",
              [{ text: "OK" }]
            );
            return;
          }

          result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
            allowsMultipleSelection: false,
            quality: 0.8, // Optimize file size
          });
        } else {
          result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
            allowsMultipleSelection: false,
            quality: 0.8, // Optimize file size
          });
        }

        if (result.canceled || !result.assets || result.assets.length === 0) {
          return;
        }

        const imageAsset = result.assets[0];

        // Set the selected image and add to chat immediately
        setSelectedImage(imageAsset.uri);
        chatContext.addChatWithImage(imageAsset.uri, true);

        // Show processing toast
        Toast.show({
          type: "info",
          text1: "Processing Image",
          text2: "Extracting text from your image...",
          autoHide: false,
        });

        try {
          // Perform OCR
          console.log("Performing OCR...");
          const extractedText = await performOCR(imageAsset);
          console.log(
            "OCR completed. Text length:",
            extractedText?.length || 0
          );

          // Hide processing toast
          Toast.hide();

          if (extractedText && extractedText.trim()) {
            // Show insights generation toast
            Toast.show({
              type: "info",
              text1: "Generating Insights",
              text2: "Tassie is analyzing your text...",
              visibilityTime: 3000,
            });

            console.log("Generating Tassie insights...");
            const tassieInsights = await generateTassieInsights(extractedText);
            console.log("Insights generated successfully");

            chatContext.addChat(tassieInsights, false);

            Toast.show({
              type: "success",
              text1: "Analysis Complete",
              text2: "Tassie has analyzed your image!",
              visibilityTime: 2000,
            });
          } else {
            console.log("No text extracted from image");
            Toast.show({
              type: "info",
              text1: "No Text Found",
              text2: "We couldn't extract readable text from this image.",
              visibilityTime: 4000,
            });
          }
        } catch (ocrError) {
          console.error("OCR or insights generation failed:", ocrError);
          Toast.hide(); // Hide any existing toasts

          Toast.show({
            type: "error",
            text1: "Processing Failed",
            text2: "Failed to analyze the image. Please try again.",
            visibilityTime: 4000,
          });
        }
      } catch (error) {
        console.error("Error in image selection:", error);
        Toast.show({
          type: "error",
          text1: "Image Error",
          text2: "Failed to process the image. Please try again.",
          visibilityTime: 4000,
        });
      } finally {
        setIsProcessingImage(false);
      }
    },
    [chatContext]
  );

  // Initialize chat with better error handling
  useEffect(() => {
    let isMounted = true;

    const fetchInitialResponse = async () => {
      if (hasInitialResponse) return;

      try {
        console.log("Fetching initial bot response...");
        const response = await getInitialBotResponse(chatContext);

        if (isMounted) {
          chatContext.addChat(response, false);
          setHasInitialResponse(true);
          console.log("Initial response added successfully");
        }
      } catch (error) {
        console.error("Failed to get initial response:", error);

        if (isMounted) {
          // Fallback message if initial response fails
          const fallbackMessage =
            "Hi! I'm Tassie, your reading companion. How can I help you today?";
          chatContext.addChat(fallbackMessage, false);
          setHasInitialResponse(true);
        }
      }
    };

    fetchInitialResponse();

    return () => {
      isMounted = false;
    };
  }, [chatContext, hasInitialResponse]);

  // Loading overlay component
  const LoadingOverlay = () =>
    isProcessingImage && (
      <View style={styles.loadingOverlay}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Processing Image...</Text>
        </View>
      </View>
    );

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
            disabled={isSendingMessage || isProcessingImage}
            isLoading={isSendingMessage}
          />
        </KeyboardAvoidingView>

        <LoadingOverlay />
      </CustomBackground>
    </SafeAreaView>
  );
};

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
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    minWidth: 150,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});

export default ChatScreen;
