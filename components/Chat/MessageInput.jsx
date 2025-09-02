import { memo, useState, useContext } from "react";
import { StyleSheet, View, TextInput } from "react-native";

import { mainColors } from "../../constants/colors";
import IconButton from "../ui/IconButton";
import { ChatContext } from "../../store/ChatContext";

function MessageInput({
  message,
  onChange,
  onSendMessage,
  onSendImage,
  disabled = false,
  isLoading = false,
}) {
  const chatContext = useContext(ChatContext);
  const [inputHeight, setInputHeight] = useState(40);

  const isDisabled = disabled || chatContext.isGenerating;

  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === "Enter" && !nativeEvent.shiftKey) {
      // Prevent adding a new line
      nativeEvent.preventDefault?.();
      // Only send if there's a valid message
      if (message.trim().length > 0) {
        onSendMessage();
        // Clear the input by calling onChange with empty string
        onChange("");
      }
    }
  };

  return (
    <View>
      <View
        style={[
          styles.inputContainer,
          isDisabled && styles.inputContainerDisabled,
        ]}
      >
        <TextInput
          style={[
            styles.textInput,
            { height: Math.max(40, inputHeight) },
            isDisabled && styles.textInputDisabled,
          ]}
          value={message}
          onChangeText={onChange}
          placeholder={isDisabled ? "Please wait..." : "Type your message..."}
          placeholderTextColor={
            isDisabled ? mainColors.gray : mainColors.black + "80"
          }
          multiline={false} // disable multiline so Enter submits
          returnKeyType="send" // changes keyboard button to "Send"
          onSubmitEditing={() => {
            if (!isDisabled && message.trim().length > 0) {
              onSendMessage();
              onChange(""); // clear input
            }
          }}
          editable={!isDisabled}
        />
        <View style={styles.buttonListContainer}>
          <IconButton
            onPress={onSendImage}
            icon="camera"
            iconType="fontawesome"
            isLoading={isLoading}
            disabled={isDisabled}
            style={isDisabled && styles.buttonDisabled}
          />
          <IconButton
            onPress={onSendMessage}
            icon="send"
            isLoading={isLoading}
            disabled={isDisabled || !message.trim()}
            style={isDisabled && styles.buttonDisabled}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    marginBottom: 7,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: mainColors.white,
    borderRadius: 25,
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent", // Add transparent border by default
  },
  textInput: {
    flex: 1,
    marginRight: 10,
    color: mainColors.black,
    fontSize: 16,
    paddingHorizontal: 0,
    textAlignVertical: "top",
  },
  buttonListContainer: {
    flexDirection: "row",
    gap: 15,
  },
  inputContainerDisabled: {
    backgroundColor: mainColors.white, // Keep white background
    borderColor: mainColors.gray + "40", // Light gray border
  },
  textInputDisabled: {
    color: mainColors.gray + "A0", // Slightly more opaque gray (about 63%)
  },
  buttonDisabled: {
    opacity: 0.6, // Increased opacity from 0.5
  },
});

export default memo(MessageInput);
