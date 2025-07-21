import { StyleSheet, Text } from "react-native";

import ChatBubble from "./ChatBubble";
import { chatBubbleColors } from "../../constants/colors";

function UserChatBubble({ children }) {
  return (
    <ChatBubble
      isOwnMessage={true}
      bubbleColor={chatBubbleColors.player}
      tailColor={chatBubbleColors.player}
      withTail={true}
      style={styles.chatBubble}
    >
      <Text style={styles.textOwn}>{children}</Text>
    </ChatBubble>
  );
}

const styles = StyleSheet.create({
  chatBubble: {
    padding: 10,
  },
  textOwn: {
    color: "white",
    fontFamily: "quicksand",
  },
});

export default UserChatBubble;
