import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabButton from '../components/ui/TabButton';
import StatusScreen from '../components/Session/StatusScreen';
import TimerScreen from '../components/Session/TimerScreen';
import StreakScreen from '../components/Session/StreakScreen';

const SessionScreen = () => {
  const [activeTab, setActiveTab] = useState('Status');
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25); // Pomodoro duration in minutes
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // Current timer in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [dailyProgress, setDailyProgress] = useState(25);
  const [currentStreak, setCurrentStreak] = useState(10);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(time => time - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroTime]);

  const handleToggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    setPomodoroTime(pomodoroMinutes * 60);
    setIsTimerRunning(false);
  };

  const handleChangePomodoroTime = (newMinutes) => {
    setPomodoroMinutes(newMinutes);
    if (!isTimerRunning) {
      setPomodoroTime(newMinutes * 60);
    }
  };

  return (
    <View className="flex-1" style={{backgroundColor: '#FE9F1F'}}>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <Text className="text-white text-3xl font-bold mb-6">{activeTab}</Text>
          
          {/* Tab Navigation */}
          <View className="flex-row rounded-full p-1" style={{backgroundColor: '#E8901B'}}>
            <TabButton
              title="Status"
              isActive={activeTab === 'Status'}
              onPress={() => setActiveTab('Status')}
            />
            <TabButton
              title="Timer"
              isActive={activeTab === 'Timer'}
              onPress={() => setActiveTab('Timer')}
            />
            <TabButton
              title="Streak"
              isActive={activeTab === 'Streak'}
              onPress={() => setActiveTab('Streak')}
            />
          </View>
        </View>

        {/* Content Area */}
        <View className="flex-1 bg-gray-50 rounded-t-3xl">
          {activeTab === 'Status' && <StatusScreen />}
          {activeTab === 'Timer' && (
          <TimerScreen 
            pomodoroTime={pomodoroTime}
            pomodoroMinutes={pomodoroMinutes}
            isTimerRunning={isTimerRunning}
            dailyProgress={dailyProgress}
            onToggleTimer={handleToggleTimer}
            onResetTimer={handleResetTimer}
            onChangePomodoroTime={handleChangePomodoroTime}
          />
        )}
          {activeTab === 'Streak' && <StreakScreen currentStreak={currentStreak} />}
        </View>
        
        {/* Curved Bottom */}
        <View 
          className="bg-gray-50 h-16"
          style={{
            borderBottomLeftRadius: 100,
            borderBottomRightRadius: 100,
          }}
        />
      </SafeAreaView>
    </View>
  );
};

export default SessionScreen;
