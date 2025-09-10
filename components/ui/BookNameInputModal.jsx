import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import Icon from "react-native-vector-icons/Feather";

/**
 * BookNameInputModal - Modal for entering book title when uploading PDFs
 * Prompts user to enter a custom book name before adding PDF to library
 *
 * @param {boolean} visible - Controls the visibility of the modal
 * @param {function} onClose - Callback function when the modal is closed
 * @param {string} defaultName - Default book name (usually filename without extension)
 * @param {function} onSave - Callback function when book name is saved
 */
const BookNameInputModal = ({ visible, onCancel, fileName = "", onSave }) => {
  // Extract default name from fileName (remove .pdf extension)
  const defaultName = fileName ? fileName.replace(/\.pdf$/i, "") : "";
  const [bookName, setBookName] = useState(defaultName);

  const handleSave = () => {
    const finalName = bookName.trim() || defaultName || "Untitled Book";
    onSave(finalName);
  };

  const handleCancel = () => {
    setBookName(defaultName);
    if (onCancel) {
      onCancel();
    }
  };

  // Reset book name when modal becomes visible or fileName changes
  React.useEffect(() => {
    if (visible) {
      const newDefaultName = fileName ? fileName.replace(/\.pdf$/i, "") : "";
      setBookName(newDefaultName);
    }
  }, [visible, fileName]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          <View className="items-center mb-4">
            <View className="w-16 h-16 rounded-full bg-orange-100 items-center justify-center mb-4">
              <Icon name="book-open" size={32} color="#FE9F1F" />
            </View>

            <Text className="text-lg font-semibold text-gray-900 text-center mb-2">
              Add Book to Library
            </Text>
          </View>

          <Text className="text-sm text-gray-600 text-center mb-6">
            Enter a name for your book. You can always change this later.
          </Text>

          <View className="mb-6">
            <Text className="text-sm text-gray-600 mb-2">Book Title</Text>
            <TextInput
              value={bookName}
              onChangeText={setBookName}
              className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900"
              placeholder="Enter book title"
              autoFocus={true}
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />
          </View>

          <View className="flex-row space-x-4">
            <TouchableOpacity
              onPress={handleCancel}
              className="flex-1 py-3 rounded-lg border border-gray-300"
            >
              <Text className="text-gray-700 text-base font-medium text-center">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              className="flex-1 bg-[#FE9F1F] py-3 rounded-lg"
            >
              <Text className="text-white text-base font-medium text-center">
                Add Book
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BookNameInputModal;
