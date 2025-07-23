import { memo, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { mainColors } from "../../constants/colors";

const MessageInput = memo(function MessageInput({
  message,
  onChange,
  onSendMessage,
}) {
  const [inputHeight, setInputHeight] = useState(40); // default height

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.textInput, { height: Math.max(40, inputHeight) }]}
        value={message}
        onChangeText={onChange}
        placeholder="Type your message..."
        placeholderTextColor={mainColors.black + "80"}
        multiline
        onContentSizeChange={(e) =>
          setInputHeight(e.nativeEvent.contentSize.height)
        }
        textAlignVertical="top"
      />
      <TouchableOpacity
        style={styles.sendButton}
        onPress={onSendMessage}
        activeOpacity={0.7}
      >
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    margin: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: mainColors.white,
    borderRadius: 25,
    justifyContent: "space-between",
    alignItems: "flex-end", // align to bottom since input grows vertically
  },
  textInput: {
    flex: 1,
    marginRight: 10,
    color: mainColors.black,
    fontSize: 16,
    paddingVertical: Platform.OS === "ios" ? 8 : 4,
    paddingHorizontal: 0,
    textAlignVertical: "top",
  },
  sendButton: {
    backgroundColor: "transparent", // No background
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 40, // Ensures button height matches default input height
  },
  sendButtonText: {
    color: mainColors.primary500,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default MessageInput;
