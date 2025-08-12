import { useContext } from "react";
import { StyleSheet, Text } from "react-native";
import { useState, useEffect } from "react";

import ChatBubble from "./ChatBubble";
import { ChatContext } from "../../store/ChatContext";
import { mainColors, chatBubbleColors } from "../../constants/colors";

const BotChatBubble = ({ children, isText = true }) => {
  const chatContext = useContext(ChatContext);
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = isText ? children : null;

  useEffect(() => {
    // Reset when children changes (new message text)
    if (!isText) {
      return;
    }

    setDisplayedText("");
    setCurrentIndex(0);
  }, [children]);

  useEffect(() => {
    const typingSpeed = 15; // The lower, the faster

    if (fullText && currentIndex < fullText.length) {
      chatContext.setIsGenerating(true);

      const timer = setTimeout(() => {
        const updatedIndex = currentIndex + 1;
        setDisplayedText(fullText.slice(0, updatedIndex));
        setCurrentIndex(updatedIndex);

        if (updatedIndex >= fullText.length) {
          chatContext.setIsGenerating(false);
        }
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
      {isText ? <Text style={styles.text}>{displayedText}</Text> : children}
    </ChatBubble>
  );
};

const styles = StyleSheet.create({
  chatBubble: {
    padding: 10,
  },
  text: {
    color: mainColors.white,
  },
});

export default BotChatBubble;
