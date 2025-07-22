import { StyleSheet, View, Text } from "react-native";

function ProfileSetupScreen() {
  return (
    <View style={styles.rootContainer}>
      <Text>Profile Setup</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileSetupScreen;
