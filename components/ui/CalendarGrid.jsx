import React from "react";
import { View, Text } from "react-native";
import { Calendar } from "react-native-calendars";

const CalendarGrid = ({
  currentDay,
  month,
  completedDays = [],
  partialDays = [],
}) => {
  const selectedDate = new Date().toISOString().split("T")[0];

  // Generate marked dates for streak visualization
  const generateMarkedDates = () => {
    const markedDates = {};
    const today = new Date();

    // Mark fully completed days (met daily goal)
    completedDays.forEach((dateString) => {
      markedDates[dateString] = {
        customStyles: {
          container: {
            backgroundColor: "#FE9F1F",
            borderRadius: 20,
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
          },
          text: {
            color: "white",
            fontWeight: "600",
          },
        },
      };
    });

    // Mark partial days (reading done but didn't meet goal)
    partialDays.forEach((dateString) => {
      markedDates[dateString] = {
        customStyles: {
          container: {
            backgroundColor: "transparent",
            borderRadius: 20,
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 2,
            borderColor: "#FE9F1F",
          },
          text: {
            color: "#FE9F1F",
            fontWeight: "600",
          },
        },
      };
    });

    // Mark today with special styling if completed
    const todayString = today.toISOString().split("T")[0];
    if (markedDates[todayString]) {
      const isCompleted = completedDays.includes(todayString);
      markedDates[todayString].customStyles.container = {
        ...markedDates[todayString].customStyles.container,
        backgroundColor: isCompleted ? "#E8901B" : "transparent",
        borderWidth: isCompleted ? 0 : 2,
        borderColor: "#E8901B",
      };
      markedDates[todayString].customStyles.text = {
        ...markedDates[todayString].customStyles.text,
        color: isCompleted ? "white" : "#E8901B",
      };
    }

    return markedDates;
  };

  const calendarTheme = {
    backgroundColor: "#F9FAFB",
    calendarBackground: "#F9FAFB",
    textSectionTitleColor: "#6B7280",
    selectedDayBackgroundColor: "#FE9F1F",
    selectedDayTextColor: "#FFFFFF",
    todayTextColor: "#FE9F1F",
    dayTextColor: "#374151",
    textDisabledColor: "#D1D5DB",
    dotColor: "#FE9F1F",
    selectedDotColor: "#FFFFFF",
    arrowColor: "#FE9F1F",
    disabledArrowColor: "#D1D5DB",
    monthTextColor: "#111827",
    indicatorColor: "#FE9F1F",
    textDayFontFamily: "System",
    textMonthFontFamily: "System",
    textDayHeaderFontFamily: "System",
    textDayFontWeight: "500",
    textMonthFontWeight: "bold",
    textDayHeaderFontWeight: "500",
    textDayFontSize: 16,
    textMonthFontSize: 24,
    textDayHeaderFontSize: 14,
  };

  return (
    <View className="w-full mt-12">
      <Calendar
        current={selectedDate}
        markingType="custom"
        markedDates={generateMarkedDates()}
        theme={calendarTheme}
        hideExtraDays={true}
        disableMonthChange={true}
        hideArrows={true}
        style={{
          borderRadius: 16,
          elevation: 4,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
        }}
      />
    </View>
  );
};

export default CalendarGrid;
