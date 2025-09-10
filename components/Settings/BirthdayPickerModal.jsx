import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const BirthdayPickerModal = ({ visible, onClose, currentDate, onSave }) => {
  const [selectedDate, setSelectedDate] = useState(new Date(currentDate));

  const handleSave = () => {
    onSave(selectedDate);
    onClose();
  };

  const handleCancel = () => {
    setSelectedDate(new Date(currentDate));
    onClose();
  };

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
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
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Change birthday
          </Text>

          <Text className="text-sm text-gray-600 mb-6">
            {formatDate(selectedDate)}
          </Text>

          <View className="mb-8">
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={(event, date) => {
                if (date) {
                  setSelectedDate(date);
                }
              }}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
              textColor="#000000"
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

export default BirthdayPickerModal;
