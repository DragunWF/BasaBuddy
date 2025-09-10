import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Icon from "react-native-vector-icons/Feather";
import { READING_SPEEDS } from "../../constants/profileSetupInfo";

const ReadingSpeedSheet = ({
  visible,
  onClose,
  selectedSpeed,
  onSelectSpeed,
}) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = ["30%"];

  const speedOptions = READING_SPEEDS;

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

  const handleSelectSpeed = (speed) => {
    onSelectSpeed(speed);
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
        {speedOptions.map((speed, index) => (
          <TouchableOpacity
            key={speed}
            onPress={() => handleSelectSpeed(speed)}
            className="flex-row items-center justify-between py-4"
          >
            <Text
              className={`text-base ${
                selectedSpeed === speed
                  ? "text-[#FE9F1F] font-semibold"
                  : "text-gray-900"
              }`}
            >
              {speed}
            </Text>
            {selectedSpeed === speed && (
              <View className="w-6 h-6 rounded-full border-2 border-[#FE9F1F] items-center justify-center">
                <Icon name="check" size={14} color="#FE9F1F" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </BottomSheetView>
    </BottomSheet>
  );
};

export default ReadingSpeedSheet;
