import React from 'react';
import { View, TouchableNativeFeedback } from 'react-native';
import classNames from 'classnames';

const DayMenu = ({ days }) => (
  <View className="accordion-tabs schedule_category_days">
    {Object.keys(days).map(day => (
      <View key={day} className="tab-header-and-content">
        <TouchableNativeFeedback
          href={`#day${day}`}
          className={classNames('tab-link', {
            'disabled': !days[day].length,
            'scroll': days[day].length
          })}
        >
          {day}
        </TouchableNativeFeedback>
      </View>
    ))}
  </View>
);

export default DayMenu;
