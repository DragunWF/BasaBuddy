import { memo, useState, useContext } from "react";
import { StyleSheet, View, TextInput } from "react-native";

import { mainColors } from "../../constants/colors";
import IconButton from "../ui/IconButton";
import { ChatContext } from "../../store/ChatContext";

const MessageInput = memo(function MessageInput({
  message,
  onChange,
  onSendMessage,
  onSendImage,
}) {
  const chatContext = useContext(ChatContext);
  const [inputHeight, setInputHeight] = useState(40);

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
      {/* Tassie Image */}
      {/*<View style={styles.tassieContainer}>
        <Image
          source={require("../../assets/tassie/tassie.png")}
          style={styles.tassieImage}
          resizeMode="contain"
        />
      </View>*/}

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.textInput, { height: Math.max(40, inputHeight) }]}
          value={message}
          onChangeText={onChange}
          placeholder="Type your message..."
          placeholderTextColor={mainColors.black + "80"}
          multiline={false} // 👈 disable multiline so Enter submits
          returnKeyType="send" // 👈 changes keyboard button to "Send"
          onSubmitEditing={() => {
            if (message.trim().length > 0) {
              onSendMessage();
              onChange(""); // clear input
            }
          }}
          textAlignVertical="center"
          editable={!chatContext.isGenerating}
        />
        <View style={styles.buttonListContainer}>
          <IconButton
            onPress={onSendImage}
            icon="camera"
            iconType="fontawesome"
          />
          <IconButton onPress={onSendMessage} icon="send" />
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  tassieContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  tassieImage: {
    width: 125,
    height: 125,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 7,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: mainColors.white,
    borderRadius: 25,
    justifyContent: "space-between",
    alignItems: "center", // center align all elements including placeholder text
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
});

export default MessageInput;
