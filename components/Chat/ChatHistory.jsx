import { StyleSheet, FlatList, Image } from "react-native";

import UserChatBubble from "./UserChatBubble";
import BotChatBubble from "./BotChatBubble";

const ChatHistory = ({ data }) => {
  const renderChatBubble = (itemData) => {
    const message = itemData.item;
    const messageContent = message.imageSourceUri ? (
      <Image source={{ uri: message.imageSourceUri }} style={styles.image} />
    ) : (
      message.text
    );
    const isText = !message.imageSourceUri;

    if (message.role === "user") {
      return <UserChatBubble isText={isText}>{messageContent}</UserChatBubble>;
    }
    return <BotChatBubble isText={isText}>{messageContent}</BotChatBubble>;
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
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    marginVertical: 10,
  },
  image: {
    minWidth: 200,
    minHeight: 200,
    borderRadius: 6,
  },
});

export default ChatHistory;
