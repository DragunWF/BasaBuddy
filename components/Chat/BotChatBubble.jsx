import React, { useContext, useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { mainColors, chatBubbleColors } from "../../constants/colors";
import { responseParser } from "../../helpers/chatbot/responseParser";
import TTSControls from "../ui/TTSControls";

import ChatBubble from "./ChatBubble";
import { ChatContext } from "../../store/ChatContext";

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
    <View>
      <ChatBubble
        isOwnMessage={false}
        bubbleColor={chatBubbleColors.bot}
        withTail={true}
        style={styles.chatBubble}
      >
        {isText ? (
          <Text style={styles.text} selectable={true}>
            {displayedText}
          </Text>
        ) : (
          children
        )}
      </ChatBubble>
      
      {/* Add TTS controls for completed bot messages */}
      {isText && currentIndex >= fullText?.length && displayedText.trim() && (
        <View style={styles.ttsContainer}>
          <TTSControls 
            text={displayedText}
            compact={true}
            showSettings={false}
            style={styles.ttsControls}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chatBubble: {
    padding: 10,
  },
  text: {
    color: mainColors.black, // Changed to black for better contrast
    fontSize: 15,
    lineHeight: 20,
    textShadowColor: "rgba(255, 255, 255, 0.5)",
    textShadowOffset: { width: 0, height: 0.5 },
    textShadowRadius: 1,
    letterSpacing: 0.2,
  },
  ttsContainer: {
    alignItems: 'flex-end',
    marginTop: 4,
    marginRight: 8,
  },
  ttsControls: {
    opacity: 0.8,
  },
});

export default BotChatBubble;
