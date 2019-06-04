import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { colors } from '../../theme/index.js';
import Users from '../users/Users.js';


const navigationConfig = {
  initialRouteName: 'Users',
  headerMode: 'float',
  defaultNavigationOptions: ({ navigation }) => ({
    headerStyle: {
      backgroundColor: colors.blue,
    }
  }),
};

const Navigator = createStackNavigator({
  Users: { screen: Users },
}, navigationConfig);

export default createAppContainer(Navigator);
