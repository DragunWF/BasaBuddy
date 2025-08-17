import React from 'react';
import { View, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarGrid = ({ 
  currentDay = 10, 
  month = 'July',
  selectedDate = '2024-07-10'
}) => {
  // Generate marked dates for streak visualization
  const generateMarkedDates = () => {
    const markedDates = {};
    const year = new Date().getFullYear();
    const monthNumber = new Date(`${month} 1, ${year}`).getMonth() + 1;
    
    // Mark all streak days
    for (let day = 1; day <= currentDay; day++) {
      const dateString = `${year}-${monthNumber.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const isToday = day === currentDay;
      
      markedDates[dateString] = {
        customStyles: {
          container: {
            backgroundColor: isToday ? '#E8901B' : '#FE9F1F',
            borderRadius: 20,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          },
          text: {
            color: 'white',
            fontWeight: '600',
          },
        },
      };
    }
    
    return markedDates;
  };

  const calendarTheme = {
    backgroundColor: '#F9FAFB',
    calendarBackground: '#F9FAFB',
    textSectionTitleColor: '#6B7280',
    selectedDayBackgroundColor: '#FE9F1F',
    selectedDayTextColor: '#FFFFFF',
    todayTextColor: '#FE9F1F',
    dayTextColor: '#374151',
    textDisabledColor: '#D1D5DB',
    dotColor: '#FE9F1F',
    selectedDotColor: '#FFFFFF',
    arrowColor: '#FE9F1F',
    disabledArrowColor: '#D1D5DB',
    monthTextColor: '#111827',
    indicatorColor: '#FE9F1F',
    textDayFontFamily: 'System',
    textMonthFontFamily: 'System',
    textDayHeaderFontFamily: 'System',
    textDayFontWeight: '500',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '500',
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
          shadowColor: '#000',
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
