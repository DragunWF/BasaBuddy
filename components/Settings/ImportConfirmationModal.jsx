import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Icon from "react-native-vector-icons/Feather";

/**
 * ImportConfirmationModal - Warning modal for profile data import
 * Warns users that importing will overwrite their current profile data
 *
 * @param {boolean} visible - Controls the visibility of the bottom sheet
 * @param {function} onClose - Callback function when the sheet is closed
 * @param {function} onConfirm - Callback function when user confirms the import
 */
const ImportConfirmationModal = ({ visible, onClose, onConfirm }) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = ["50%"];

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const handleSheetChanges = (index) => {
    if (index === -1) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: "white" }}
      handleIndicatorStyle={{ backgroundColor: "#D1D5DB", width: 40 }}
    >
      <BottomSheetView className="flex-1 px-6 pt-4">
        <View className="items-center mb-4">
          <View className="w-16 h-16 rounded-full bg-red-100 items-center justify-center mb-4">
            <Icon name="alert-triangle" size={32} color="#EF4444" />
          </View>

          <Text className="text-lg font-bold text-gray-900 text-center mb-2">
            Import Profile Data
          </Text>
        </View>

        <Text className="text-sm text-gray-600 text-center leading-5 mb-6">
          <Text className="font-semibold text-red-600">Warning: </Text>
          Importing profile data will completely overwrite your current profile,
          including all your books, collections, achievements, reading history,
          and settings. This action cannot be undone.
        </Text>

        <Text className="text-sm text-gray-600 text-center mb-8">
          Make sure you have exported your current data if you want to keep it.
          Are you sure you want to proceed?
        </Text>

        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={onClose}
            className="flex-1 py-4 rounded-xl border border-gray-300"
          >
            <Text className="text-gray-700 text-base font-semibold text-center">
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleConfirm}
            className="flex-1 bg-red-500 py-4 rounded-xl"
          >
            <Text className="text-white text-base font-semibold text-center">
              Import Data
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default ImportConfirmationModal;
