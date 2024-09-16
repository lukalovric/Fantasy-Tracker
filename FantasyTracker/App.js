import React, {useEffect} from 'react';
import AppNavigator from './src/navigation/AppNavigation';
import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  return <AppNavigator />;

}
