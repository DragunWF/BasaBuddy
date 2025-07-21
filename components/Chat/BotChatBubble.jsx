import { StyleSheet, Text } from "react-native";

import ChatBubble from "./ChatBubble";
import { mainColors, chatBubbleColors } from "../../constants/colors";

function BotChatBubble({ children }) {
  return (
    <ChatBubble
      isOwnMessage={false}
      bubbleColor={chatBubbleColors.bot}
      withTail={true}
      style={styles.chatBubble}
    >
      <Text style={styles.text}>{children}</Text>
    </ChatBubble>
  );
}

const styles = StyleSheet.create({
  chatBubble: {
    padding: 10,
  },
  text: {
    color: mainColors.black,
  },
});

export default BotChatBubble;
