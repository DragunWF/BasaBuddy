import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Icon from "react-native-vector-icons/Feather";
import { AGE_GROUPS } from "../../constants/profileSetupInfo";

/**
 * AgeGroupSheet - A bottom sheet component for selecting age groups
 * Replaces the birthday picker modal with a more appropriate age group selection
 *
 * @param {boolean} visible - Controls the visibility of the bottom sheet
 * @param {function} onClose - Callback function when the sheet is closed
 * @param {string} selectedAgeGroup - Currently selected age group
 * @param {function} onSelectAgeGroup - Callback function when an age group is selected
 */
const AgeGroupSheet = ({
  visible,
  onClose,
  selectedAgeGroup,
  onSelectAgeGroup,
}) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = ["40%"];

  const ageGroupOptions = AGE_GROUPS;

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

  const handleSelectAgeGroup = (ageGroup) => {
    onSelectAgeGroup(ageGroup);
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
        <Text className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Select Age Group
        </Text>

        {ageGroupOptions.map((ageGroup, index) => (
          <TouchableOpacity
            key={ageGroup}
            onPress={() => handleSelectAgeGroup(ageGroup)}
            className="flex-row items-center justify-between py-4"
          >
            <Text
              className={`text-base ${
                selectedAgeGroup === ageGroup
                  ? "text-[#FE9F1F] font-semibold"
                  : "text-gray-900"
              }`}
            >
              {ageGroup}
            </Text>
            {selectedAgeGroup === ageGroup && (
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

export default AgeGroupSheet;
