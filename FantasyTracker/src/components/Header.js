import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Animated } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { supabase } from '../utils/supabase';

const Header = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [position] = useState(new Animated.Value(0));

  useEffect(() => {
    checkUser();

    const { subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        checkAdminStatus(session.user.id);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    const accelerometerSubscription = Accelerometer.addListener(({ x }) => {
      Animated.timing(position, {
        toValue: x * 10,
        duration: 100,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      accelerometerSubscription && accelerometerSubscription.remove();
      subscription?.unsubscribe();
    };
  }, [position]);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      checkAdminStatus(user.id);
    }
  };

  const checkAdminStatus = async (userId) => {
    const { data } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', userId)
      .single();

    setIsAdmin(data?.is_admin || false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.header}>
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [{ translateX: position }],
          },
        ]}
      >
        {user ? (
          <>
            {isAdmin ? (
              <>
                <Button title="Admin" onPress={() => navigation.navigate('AdminHome')} />
                <Button title="Logout" onPress={handleLogout} />
              </>
            ) : (
              <Button title="Logout" onPress={handleLogout} />
            )}
          </>
        ) : (
          <Button title="Login" onPress={() => navigation.navigate('Login')} />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#333',
    justifyContent: 'center',
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default Header;
