import { StyleSheet, View, Text, Pressable } from "react-native";
import { mainColors } from "../../constants/colors";

function Button({ children, onPress, style, textStyle }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={[styles.buttonContainer, style]}>
        <Text style={[styles.text, textStyle]}>{children}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
  buttonContainer: {
    justifyContent: "center",
    backgroundColor: mainColors.primary500,
    borderRadius: 15,
    elevation: 5,
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    flexDirection: "row",
  },
  text: {
    padding: 10,
    textAlign: "center",
  },
});

export default Button;
