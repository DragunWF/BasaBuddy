import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import Icon from "react-native-vector-icons/Feather";

/**
 * StatusModal - Modal component for showing success/error messages
 * Used for displaying import/export operation results
 *
 * @param {boolean} visible - Controls the visibility of the modal
 * @param {function} onClose - Callback function when the modal is closed
 * @param {string} type - Type of status: 'success' or 'error'
 * @param {string} title - Title of the modal
 * @param {string} message - Message to display
 */
const StatusModal = ({
  visible,
  onClose,
  type = "success",
  title,
  message,
}) => {
  const isSuccess = type === "success";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          <View className="items-center mb-4">
            <View
              className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${
                isSuccess ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <Icon
                name={isSuccess ? "check-circle" : "x-circle"}
                size={32}
                color={isSuccess ? "#10B981" : "#EF4444"}
              />
            </View>

            <Text className="text-lg font-semibold text-gray-900 text-center mb-2">
              {title}
            </Text>
          </View>

          <Text className="text-sm text-gray-600 text-center leading-5 mb-6">
            {message}
          </Text>

          <TouchableOpacity
            onPress={onClose}
            className={`py-4 rounded-xl ${
              isSuccess ? "bg-green-500" : "bg-red-500"
            }`}
          >
            <Text className="text-white text-base font-semibold text-center">
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default StatusModal;
