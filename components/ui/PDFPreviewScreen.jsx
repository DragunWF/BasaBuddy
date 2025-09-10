import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  Linking,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import * as IntentLauncher from "expo-intent-launcher";
import * as FileSystem from "expo-file-system";

const PDFPreviewScreen = ({ book, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);

  const openPdfInBrowser = async () => {
    try {
      setIsLoading(true);

      if (Platform.OS === "android") {
        // For Android, use IntentLauncher to open with PDF viewers
        const cUri = await FileSystem.getContentUriAsync(book.filePath);
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: cUri,
          flags: 1,
          type: "application/pdf",
        });
      } else {
        // For iOS, try to open with system PDF viewer
        const canOpen = await Linking.canOpenURL(book.filePath);
        if (canOpen) {
          await Linking.openURL(book.filePath);
        } else {
          // Fallback: Convert file path to a data URL and open in WebBrowser
          try {
            // Read the file as base64
            const fileContent = await FileSystem.readAsStringAsync(
              book.filePath,
              {
                encoding: FileSystem.EncodingType.Base64,
              }
            );
            const dataUrl = `data:application/pdf;base64,${fileContent}`;
            await WebBrowser.openBrowserAsync(dataUrl, {
              presentationStyle:
                WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
              controlsColor: "#FE9F1F",
              showTitle: true,
            });
          } catch (error) {
            console.error("Error creating data URL:", error);
            // Final fallback: use sharing
            await Sharing.shareAsync(book.filePath, {
              mimeType: "application/pdf",
              dialogTitle: book.title,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error opening PDF:", error);
      Alert.alert(
        "Cannot Open PDF",
        "Unable to open PDF directly. Would you like to share it to open with a PDF reader app?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Share PDF",
            onPress: () => sharePdf(),
          },
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const sharePdf = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(book.filePath, {
          mimeType: "application/pdf",
          dialogTitle: `Share ${book.title}`,
        });
      } else {
        Alert.alert(
          "Sharing not available",
          "Sharing is not available on this device."
        );
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
      Alert.alert("Error", "Could not share PDF file.");
    }
  };

  const openFileExplorer = async () => {
    try {
      // This opens the file in whatever app the user chooses
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: false,
      });

      if (!result.canceled) {
        // User selected a different PDF, could handle this case
        Alert.alert(
          "Info",
          "You can also browse and select other PDF files this way."
        );
      }
    } catch (error) {
      console.error("Error opening file explorer:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-2 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={onBack} className="p-2">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text
          className="text-lg font-bold flex-1 text-center"
          numberOfLines={1}
        >
          {book.title}
        </Text>

        <TouchableOpacity onPress={sharePdf} className="p-2">
          <Ionicons name="share" size={24} color="#FE9F1F" />
        </TouchableOpacity>
      </View>

      {/* PDF Preview Card */}
      <View className="flex-1 justify-center items-center px-6">
        <View className="bg-white rounded-3xl p-8 shadow-lg items-center max-w-sm w-full">
          {/* PDF Icon with animated background */}
          <View className="w-24 h-24 bg-red-50 rounded-2xl items-center justify-center mb-6">
            <Ionicons name="document-text" size={48} color="#DC2626" />
          </View>

          {/* Book Info */}
          <Text className="text-2xl font-bold text-center mb-2">
            {book.title}
          </Text>

          <Text className="text-gray-600 text-center mb-2">PDF Document</Text>

          {book.fileSize && (
            <Text className="text-gray-500 text-sm text-center mb-6">
              {(book.fileSize / 1024 / 1024).toFixed(1)} MB
            </Text>
          )}

          {/* Action Buttons */}
          <TouchableOpacity
            onPress={openPdfInBrowser}
            disabled={isLoading}
            className="bg-[#FE9F1F] py-4 px-8 rounded-2xl mb-3 w-full shadow-md"
          >
            <Text className="text-white font-bold text-center text-lg">
              {isLoading ? "Opening..." : "Read PDF"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={sharePdf}
            className="bg-blue-500 py-4 px-8 rounded-2xl mb-3 w-full shadow-md"
          >
            <Text className="text-white font-semibold text-center">
              Share PDF
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openFileExplorer}
            className="bg-gray-200 py-4 px-8 rounded-2xl w-full"
          >
            <Text className="text-gray-700 font-semibold text-center">
              Browse Other PDFs
            </Text>
          </TouchableOpacity>

          {/* Info Text */}
          <Text className="text-xs text-gray-500 text-center mt-6 leading-relaxed">
            PDF will open in your device's default PDF viewer with full
            functionality including annotations, search, and zoom.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PDFPreviewScreen;
