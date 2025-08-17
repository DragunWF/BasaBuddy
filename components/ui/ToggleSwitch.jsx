import React from 'react';
import TabSwitcher from './TabSwitcher';

const ToggleSwitch = ({ activeTab, onTabChange }) => {
  const toggleTabs = [
    { key: 'books', label: 'Books', icon: 'book' },
    { key: 'collections', label: 'Collections', icon: 'collections-bookmark' }
  ];

  return (
    <TabSwitcher
      tabs={toggleTabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      className="mb-6"
    />
  );
};

export default ToggleSwitch;
