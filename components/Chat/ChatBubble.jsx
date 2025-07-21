import { View, Pressable, StyleSheet } from "react-native";
import { Path, Svg } from "react-native-svg";
import { moderateScale } from "react-native-size-matters";

function ChatBubble({
  isOwnMessage,
  children,
  bubbleColor = isOwnMessage ? "#1084ff" : "grey",
  tailColor = bubbleColor,
  withTail = true,
  style,
  onPress,
  hitSlop,
  maxWidth,
  ...rest
}) {
  const styles = getStyleObj({ isOwnMessage, maxWidth });
  const SvgContainerStyle = isOwnMessage
    ? styles.svgContainerOwn
    : styles.svgContainerOther;
  const Container = onPress ? Pressable : View;
  const tailPath = isOwnMessage
    ? "M48,35c-7-4-6-8.75-6-17.5C28,17.5,29,35,48,35z"
    : "M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z";

  const bubbleStyle = StyleSheet.flatten([
    style,
    styles.bubble,
    isOwnMessage && styles.itemOut,
    {
      backgroundColor: bubbleColor,
    },
  ]);

  return (
    <Container {...rest} hitSlop={hitSlop} onPress={onPress}>
      <View style={bubbleStyle}>{children}</View>
      {withTail && (
        <View style={[styles.svgContainer, SvgContainerStyle]}>
          <Svg
            width={moderateScale(15.5, 0.6)}
            height={moderateScale(17.5, 0.6)}
            viewBox="32.485 17.5 15.515 17.5"
            enableBackground="new 32.485 17.5 15.515 17.5"
          >
            <Path d={tailPath} fill={tailColor} x="0" y="0" />
          </Svg>
        </View>
      )}
    </Container>
  );
}

const getStyleObj = ({ isOwnMessage, maxWidth }) => {
  return StyleSheet.create({
    bubble: {
      maxWidth: moderateScale(maxWidth || 250, 2),
      alignSelf: isOwnMessage ? "flex-end" : "flex-start",
      paddingHorizontal: moderateScale(10, 2),
      paddingTop: moderateScale(5, 2),
      paddingBottom: moderateScale(7, 2),
      borderRadius: 20,
      marginVertical: moderateScale(7, 2),
    },
    itemOut: {
      alignSelf: "flex-end",
    },
    svgContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      flex: 1,
    },
    svgContainerOwn: {
      justifyContent: "flex-end",
      alignItems: "flex-end",
    },
    svgContainerOther: {
      justifyContent: "flex-end",
      alignItems: "flex-start",
    },
  });
};

export default ChatBubble;
