import { StyleSheet, Text } from "react-native";
import { useState, useEffect } from "react";

import ChatBubble from "./ChatBubble";
import { mainColors, chatBubbleColors } from "../../constants/colors";

function BotChatBubble({ children }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = children;

  useEffect(() => {
    // Reset when children changes (new message)
    setDisplayedText("");
    setCurrentIndex(0);
  }, [children]);

  useEffect(() => {
    const typingSpeed = 15; // The lower, the faster

    if (fullText && currentIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, typingSpeed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, fullText]);

  return (
    <ChatBubble
      isOwnMessage={false}
      bubbleColor={chatBubbleColors.bot}
      withTail={true}
      style={styles.chatBubble}
    >
      <Text style={styles.text}>{displayedText}</Text>
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
