import { StyleSheet, View, Text, TextInput } from "react-native";

import { inputColors } from "../../constants/colors";

function CustomTextInput({
  label,
  value,
  onChangeText,
  placeholder,
  style,
  inputStyle,
}) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[styles.input, inputStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
    fontWeight: "500",
    color: inputColors.text,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: inputColors.border,
    borderRadius: 6,
    backgroundColor: inputColors.background,
  },
});

export default CustomTextInput;
