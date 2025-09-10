import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";

const NameEditModal = ({
  visible,
  onClose,
  currentFirstName,
  currentLastName,
  onSave,
}) => {
  const [firstName, setFirstName] = useState(currentFirstName);
  const [lastName, setLastName] = useState(currentLastName);

  const handleSave = () => {
    onSave(firstName, lastName);
    onClose();
  };

  const handleCancel = () => {
    setFirstName(currentFirstName);
    setLastName(currentLastName);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-6">
            Change name
          </Text>

          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-2">First name</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              className="border-b border-gray-200 pb-2 text-base text-gray-900"
              placeholder="Enter first name"
            />
          </View>

          <View className="mb-8">
            <Text className="text-sm text-gray-600 mb-2">Last name</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              className="border-b border-gray-200 pb-2 text-base text-gray-900"
              placeholder="Enter last name"
            />
          </View>

          <View className="flex-row justify-end space-x-4">
            <TouchableOpacity onPress={handleCancel} className="px-6 py-2">
              <Text className="text-[#FE9F1F] text-base font-medium">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              className="bg-[#FE9F1F] px-6 py-2 rounded-lg"
            >
              <Text className="text-white text-base font-medium">Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NameEditModal;
