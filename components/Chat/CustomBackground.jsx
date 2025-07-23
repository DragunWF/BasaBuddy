import { StyleSheet, ImageBackground } from "react-native";

function CustomBackground({ children, imageSource }) {
  return (
    <ImageBackground
      source={imageSource}
      resizeMode="cover"
      style={styles.screen}
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
export default CustomBackground;
