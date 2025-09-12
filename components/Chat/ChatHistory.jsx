import { StyleSheet, FlatList, Image, View } from "react-native";
import { memo, useMemo } from "react";

import UserChatBubble from "./UserChatBubble";
import BotChatBubble from "./BotChatBubble";
import { getTassieSticker, getTassieMood } from "../../helpers/chatbot/chatbot";

const MessageItem = memo(({ message }) => {
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

  // Handle bot messages - enhanced parsing with fallback for plain text
  const { parsedMessage, imageToShow } = useMemo(() => {
    let parsed = message.text;

    // Try to parse as JSON
    if (typeof message.text === "string") {
      if (message.text.startsWith("{")) {
        try {
          parsed = JSON.parse(message.text);
        } catch (error) {
          console.warn("Failed to parse bot message as JSON:", error);
          // Fallback: treat as plain text response
          parsed = {
            response: message.text,
            mood: "",
            sticker: "",
          };
        }
      } else {
        // Handle plain text responses (like insights)
        parsed = {
          response: message.text,
          mood: "",
          sticker: "",
        };
      }
    }

    // Ensure parsed message has required structure
    if (!parsed.response) {
      parsed = {
        response: parsed.response || parsed.text || message.text || "...",
        mood: parsed.mood || "",
        sticker: parsed.sticker || "",
      };
    }

    // Prioritize mood over sticker
    let image = null;
    if (parsed.mood) {
      image = getTassieMood(parsed.mood);
    } else if (parsed.sticker) {
      image = getTassieSticker(parsed.sticker);
    }

    return { parsedMessage: parsed, imageToShow: image };
  }, [message.text]);

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
});

const ChatHistory = ({ data }) => {
  const renderChatBubble = (itemData) => {
    return <MessageItem message={itemData.item} />;
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
