import React, { useState } from "react";
import { View, TouchableOpacity, Alert, Text, Animated } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import BookNameInputModal from "./BookNameInputModal";
import { addLocalBookToLibrary } from "../../helpers/storage/bookStorage";

const FloatingActionButton = ({
  activeTab,
  onBookAdded,
  onCollectionAdded,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);
  const [selectedPdfFile, setSelectedPdfFile] = useState(null);

  const handlePDFUpload = async () => {
    try {
      setIsUploading(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      console.log("DocumentPicker result:", result); // Debug log

      if (!result.canceled && result.assets && result.assets[0]) {
        const file = result.assets[0];
        console.log("Selected file:", file); // Debug log
        setSelectedPdfFile(file);
        setIsNameModalVisible(true);
      } else if (result.type === "success") {
        // Fallback for older versions
        console.log("Using fallback for older version"); // Debug log
        setSelectedPdfFile(result);
        setIsNameModalVisible(true);
      } else {
        console.log("User canceled or no file selected"); // Debug log
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "Failed to select PDF file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveBookName = async (bookName) => {
    if (!selectedPdfFile) {
      console.log("No selected PDF file"); // Debug log
      return;
    }

    try {
      setIsUploading(true);
      console.log("Saving book with name:", bookName); // Debug log
      console.log("Selected PDF file:", selectedPdfFile); // Debug log

      // Copy PDF to app directory
      const fileExtension = selectedPdfFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExtension}`;
      const destinationUri = `${FileSystem.documentDirectory}books/${fileName}`;

      console.log("Destination URI:", destinationUri); // Debug log

      // Create books directory if it doesn't exist
      const booksDir = `${FileSystem.documentDirectory}books/`;
      await FileSystem.makeDirectoryAsync(booksDir, { intermediates: true });

      // Copy the file
      await FileSystem.copyAsync({
        from: selectedPdfFile.uri,
        to: destinationUri,
      });

      console.log("File copied successfully"); // Debug log

      // Save to library
      const bookData = {
        title: bookName,
        fileName: fileName,
        filePath: destinationUri,
        originalName: selectedPdfFile.name,
        dateAdded: new Date().toISOString(),
        fileSize: selectedPdfFile.size,
      };

      console.log("Saving book data:", bookData); // Debug log

      const saveResult = await addLocalBookToLibrary(bookData);
      console.log("Save result:", saveResult); // Debug log

      // Create book object for callback
      const newBook = {
        id: `local_${Date.now()}`,
        title: bookName,
        author: "Unknown Author",
        filePath: destinationUri,
        fileName: fileName,
        fileSize: selectedPdfFile.size,
        dateAdded: new Date().toISOString(),
        coverUrl: null,
        isLocal: true,
      };

      console.log("Calling onBookAdded with:", newBook); // Debug log

      // Call the callback to add the book
      if (onBookAdded) {
        onBookAdded(newBook);
      }

      setIsNameModalVisible(false);
      setSelectedPdfFile(null);
      Alert.alert("Success", `"${bookName}" has been added to your library!`);
    } catch (error) {
      console.error("Error saving PDF:", error);
      Alert.alert("Error", "Failed to save the PDF. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelBookName = () => {
    setIsNameModalVisible(false);
    setSelectedPdfFile(null);
  };

  const handleAddCollection = () => {
    if (onCollectionAdded) {
      onCollectionAdded();
    }
  };

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);

    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleOptionPress = (action) => {
    setIsExpanded(false);
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();

    // Execute the action after animation
    setTimeout(() => {
      action();
    }, 100);
  };

  const handleGoogleDrive = () => {
    Alert.alert("Google Drive", "Google Drive integration coming soon!");
  };

  const handleOneDrive = () => {
    Alert.alert("OneDrive", "OneDrive integration coming soon!");
  };

  const getOptionsForTab = () => {
    if (activeTab === "books") {
      return [
        {
          icon: "picture-as-pdf",
          label: "Upload PDF",
          action: handlePDFUpload,
          color: "#FF6B6B",
        },
        {
          icon: "cloud",
          label: "Google Drive",
          action: handleGoogleDrive,
          color: "#4285F4",
        },
        {
          icon: "cloud-upload",
          label: "OneDrive",
          action: handleOneDrive,
          color: "#0078D4",
        },
      ];
    } else {
      return [
        {
          icon: "create-new-folder",
          label: "New Collection",
          action: handleAddCollection,
          color: "#96CEB4",
        },
        // Note: This is disabled for now but it is still open for future integrations.
        // {
        //   icon: "import-export",
        //   label: "Import Collection",
        //   action: () =>
        //     Alert.alert("Import", "Import collection feature coming soon!"),
        //   color: "#FFEAA7",
        // },
      ];
    }
  };

  const options = getOptionsForTab();

  return (
    <View className="absolute bottom-6 right-6">
      {/* Option Buttons */}
      {options.map((option, index) => {
        const translateY = animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -(60 * (index + 1))],
        });

        const scale = animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        });

        return (
          <Animated.View
            key={option.label}
            style={{
              transform: [{ translateY }, { scale }],
              position: "absolute",
              bottom: 0,
              right: 0,
            }}
          >
            <TouchableOpacity
              className="w-12 h-12 rounded-full items-center justify-center shadow-lg mb-2"
              style={{ backgroundColor: option.color }}
              onPress={() => handleOptionPress(option.action)}
            >
              <Icon name={option.icon} size={20} color="white" />
            </TouchableOpacity>
            {isExpanded && (
              <View className="absolute right-14 top-2 bg-black bg-opacity-80 px-2 py-1 rounded">
                <Text className="text-white text-xs whitespace-nowrap">
                  {option.label}
                </Text>
              </View>
            )}
          </Animated.View>
        );
      })}

      {/* Main FAB */}
      <TouchableOpacity
        className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-lg"
        onPress={toggleExpanded}
        disabled={isUploading}
      >
        <Animated.View
          style={{
            transform: [
              {
                rotate: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "45deg"],
                }),
              },
            ],
          }}
        >
          <Icon
            name={isUploading ? "hourglass-empty" : "add"}
            size={28}
            color="#333"
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Book Name Input Modal */}
      <BookNameInputModal
        visible={isNameModalVisible}
        fileName={selectedPdfFile?.name || ""}
        onSave={handleSaveBookName}
        onCancel={handleCancelBookName}
      />
    </View>
  );
};

export default FloatingActionButton;
