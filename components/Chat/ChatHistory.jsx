import { StyleSheet, FlatList } from "react-native";

import UserChatBubble from "./UserChatBubble";
import BotChatBubble from "./BotChatBubble";

function ChatHistory({ data }) {
  function renderChatBubble(itemData) {
    const message = itemData.item;

    if (message.role === "user") {
      return <UserChatBubble>{message.text}</UserChatBubble>;
    }
    return <BotChatBubble>{message.text}</BotChatBubble>;
  }

  return (
    <FlatList
      data={data}
      renderItem={renderChatBubble}
      keyExtractor={(item, index) => index}
      alwaysBounceVertical={false}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    marginVertical: 10,
  },
});

export default ChatHistory;
