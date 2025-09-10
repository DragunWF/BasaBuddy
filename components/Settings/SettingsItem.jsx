import React from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const SettingsItem = ({
  icon,
  iconColor = "#FE9F1F",
  label,
  value,
  onPress,
  showArrow = true,
  isToggle = false,
  toggleValue = false,
  onToggle,
  isLast = false,
  textColor = "text-gray-900",
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="px-6 py-4 flex-row items-center justify-between"
      disabled={isToggle}
    >
      <View className="flex-row items-center flex-1">
        {icon && (
          <View className="w-8 h-8 items-center justify-center mr-3">
            <Icon name={icon} size={20} color={iconColor} />
          </View>
        )}
        <Text className={`text-base font-semibold ${textColor}`}>{label}</Text>
      </View>

      <View className="flex-row items-center">
        {isToggle ? (
          <Switch
            value={toggleValue}
            onValueChange={onToggle}
            trackColor={{ false: "#E5E7EB", true: "#FE9F1F" }}
            thumbColor={toggleValue ? "#FFFFFF" : "#FFFFFF"}
          />
        ) : (
          <>
            {value && (
              <Text className="text-gray-500 text-base mr-2">{value}</Text>
            )}
            {showArrow && (
              <Icon name="chevron-right" size={20} color="#9CA3AF" />
            )}
          </>
        )}
      </View>

      {!isLast && (
        <View className="absolute bottom-0 left-6 right-0 h-px bg-gray-200" />
      )}
    </TouchableOpacity>
  );
};

export default SettingsItem;
