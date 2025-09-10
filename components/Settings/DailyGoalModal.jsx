import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";

/**
 * DailyGoalModal - Modal component for setting daily reading goal in minutes
 *
 * @param {boolean} visible - Controls the visibility of the modal
 * @param {function} onClose - Callback function when the modal is closed
 * @param {number} currentGoal - Current daily reading goal in minutes
 * @param {function} onSave - Callback function when the goal is saved
 */
const DailyGoalModal = ({ visible, onClose, currentGoal, onSave }) => {
  const [goal, setGoal] = useState(currentGoal?.toString() || "30");

  const handleSave = () => {
    const goalMinutes = parseInt(goal) || 30;
    // Ensure goal is between 5 and 240 minutes (4 hours)
    const validatedGoal = Math.max(5, Math.min(240, goalMinutes));
    onSave(validatedGoal);
    onClose();
  };

  const handleCancel = () => {
    setGoal(currentGoal?.toString() || "30");
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
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Daily Reading Goal
          </Text>

          <Text className="text-sm text-gray-600 mb-6">
            Set your daily reading goal in minutes (5-240 minutes)
          </Text>

          <View className="mb-6">
            <Text className="text-sm text-gray-600 mb-2">Minutes per day</Text>
            <TextInput
              value={goal}
              onChangeText={setGoal}
              className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900"
              placeholder="30"
              keyboardType="numeric"
              maxLength={3}
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
              <Text className="text-white text-base font-medium">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DailyGoalModal;
