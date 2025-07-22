import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import { inputColors } from "../../constants/colors";

function CustomDropdown({ label, data, selectedValue, onSelect }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (item) => {
    onSelect(item);
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setOpen((prev) => !prev)}
      >
        <Text style={styles.selectedText}>
          {selectedValue || "Select an option"}
        </Text>
      </TouchableOpacity>

      <Modal transparent visible={open} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.dropdownList}>
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleSelect(item)}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
    fontWeight: "500",
    color: inputColors.text,
  },
  dropdown: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: inputColors.border,
    backgroundColor: inputColors.background,
  },
  selectedText: {
    color: inputColors.text,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  dropdownList: {
    backgroundColor: inputColors.background,
    borderRadius: 6,
    maxHeight: 250,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: inputColors.border,
  },
});

export default CustomDropdown;
