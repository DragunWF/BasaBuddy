import { StyleSheet, View, Text, Pressable } from "react-native";

function Button({ onPress, buttonStyle, textStyle }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={[styles.buttonContainer, buttonStyle]}>
        <Text style={[styles.text, textStyle]}>Button</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
  buttonContainer: {},
  text: {},
});

export default Button;
