import React from "react";
import { View, ScrollView, SafeAreaView } from "react-native";

// Import custom components
import ProfileHeader from "../components/ui/ProfileHeader";
import CharacterCard from "../components/ui/CharacterCard";
import StatCard from "../components/ui/StatCard";
import CategorySection from "../components/ui/CategorySection";
import TrendingBooks from "../components/books/TrendingBooks";

function HomeScreen({ navigation }) {
  // Sample data for categories
  const categories = [
    { id: "1", name: "Art", color: "#FF6B6B" },
    { id: "2", name: "Biographies", color: "#4ECDC4" },
    { id: "3", name: "Business", color: "#FFD166" },
    { id: "4", name: "Comic", color: "#FF9F1C" },
    { id: "5", name: "Cooking", color: "#F4A261" },
    // Add more categories as needed
  ];

  const handleProfilePress = () => {
    // Navigate to the ProfileScreen
    navigation.navigate("ProfileScreen");
  };

  const handleCategoryPress = (category) => {
    // Handle category selection
    console.log("Selected category:", category.name);
  };

  const handleViewAllPress = () => {
    // Handle view all categories press
    console.log("View all categories pressed");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-12">
      <ProfileHeader onProfilePress={handleProfilePress} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="flex-row px-4 pt-6 pb-4 mb-4 bg-[#FE9F1F] rounded-l-[100px] -ml-12 pl-16">
          <View className="flex-1 mr-2">
            <CharacterCard
              name="Tassie the Tarsier"
              greetingText="Hi! I'm Tassie!"
            />
          </View>
          <View className="flex-1 ml-2">
            <StatCard
              title="Today's Reading"
              value="10"
              unit="MINUTES"
              image={require("../assets/home/timer.png")}
            />
            <StatCard
              title="Longest Streak"
              value="10"
              unit="DAYS"
              image={require("../assets/home/fire.png")}
            />
          </View>
        </View>

        <CategorySection
          categories={categories}
          onCategoryPress={handleCategoryPress}
          onViewAllPress={handleViewAllPress}
        />

        <TrendingBooks navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default HomeScreen;
