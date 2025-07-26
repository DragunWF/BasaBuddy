import { StyleSheet, TouchableOpacity } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { mainColors } from "../../constants/colors";

function IconButton({
  onPress,
  icon,
  style,
  iconType = "ionicons",
  size = 24,
  color = mainColors.white,
}) {
  let iconComponent;
  switch (iconType.toLowerCase()) {
    case "ionicons":
      iconComponent = <Ionicons name={icon} size={size} color={color} />;
      break;
    case "fontawesome":
      iconComponent = <FontAwesome name={icon} size={size} color={color} />;
      break;
  }

  return (
    <TouchableOpacity
      style={[styles.buttonContainer, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {iconComponent}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: mainColors.primary500,
    borderRadius: "100%",
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 40, // Ensures button height matches default input height
  },
});

export default IconButton;
