import { StyleSheet, Text } from "react-native";

import ChatBubble from "./ChatBubble";
import { mainColors, chatBubbleColors } from "../../constants/colors";

const UserChatBubble = ({ children, isText = true }) => {
  return (
    <ChatBubble
      isOwnMessage={true}
      bubbleColor={chatBubbleColors.player}
      tailColor={chatBubbleColors.player}
      withTail={true}
      style={styles.chatBubble}
    >
      {isText ? <Text style={styles.textOwn}>{children}</Text> : children}
    </ChatBubble>
  );
}

const styles = StyleSheet.create({
  chatBubble: {
    padding: 10,
  },
  textOwn: {
    color: mainColors.white,
  },
});

export default UserChatBubble;
