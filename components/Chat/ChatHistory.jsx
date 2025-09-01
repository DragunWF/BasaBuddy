import { StyleSheet, FlatList, Image, View } from "react-native";

import UserChatBubble from "./UserChatBubble";
import BotChatBubble from "./BotChatBubble";
import { getTassieSticker, getTassieMood } from "../../helpers/chatbot/chatbot";

const ChatHistory = ({ data }) => {
  const renderChatBubble = (itemData) => {
    const message = itemData.item;

    // Handle user messages
    if (message.role === "user") {
      const messageContent = message.imageSourceUri ? (
        <Image source={{ uri: message.imageSourceUri }} style={styles.image} />
      ) : (
        message.text
      );

      return (
        <UserChatBubble isText={!message.imageSourceUri}>
          {messageContent}
        </UserChatBubble>
      );
    }

    // Handle bot messages
    let parsedMessage = message.text;
    if (typeof message.text === "string" && message.text.startsWith("{")) {
      parsedMessage = JSON.parse(message.text);
    }

    // Prioritize mood over sticker
    let imageToShow = null;
    if (parsedMessage.mood) {
      imageToShow = getTassieMood(parsedMessage.mood);
    } else if (parsedMessage.sticker) {
      imageToShow = getTassieSticker(parsedMessage.sticker);
    }

    return (
      <View>
        <BotChatBubble isText={true}>{parsedMessage.response}</BotChatBubble>

        {imageToShow && (
          <BotChatBubble isText={false}>
            <Image source={imageToShow} style={styles.image} />
          </BotChatBubble>
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderChatBubble}
      keyExtractor={(item, index) => index.toString()}
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
    width: 200,
    height: 200,
    borderRadius: 6,
  },
});

export default ChatHistory;
