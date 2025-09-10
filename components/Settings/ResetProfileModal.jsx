import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const ResetProfileModal = ({ visible, onClose, onReset }) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = ["40%"];

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

  const handleReset = () => {
    onReset();
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
        <Text className="text-lg font-bold text-gray-900 text-center mb-4">
          WARNING
        </Text>

        <Text className="text-sm text-gray-600 text-center leading-5 mb-8">
          Resetting your profile will permanently erase all your personal
          information, including your name, username, birthday, reading history,
          achievements, and system settings. Any exported data that you haven't
          saved will also be lost. This action cannot be undone.
        </Text>

        <Text className="text-sm text-gray-600 text-center mb-8">
          If you're sure, tap Reset Profile.
        </Text>

        <TouchableOpacity
          onPress={handleReset}
          className="bg-[#FE9F1F] py-4 rounded-xl mb-4"
        >
          <Text className="text-white text-base font-semibold text-center">
            Reset Profile
          </Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default ResetProfileModal;
