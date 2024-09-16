import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { supabase } from '../utils/supabase';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      const { data: adminCheck, error: adminError } = await supabase
        .from('users')
        .select('is_admin')
        .eq('email', user.email)
        .single();

      if (adminError) {
        console.error('Error checking admin status:', adminError);
        Alert.alert('Error', 'Unable to verify user role.');
        return;
      }

      if (adminCheck.is_admin) {
        navigation.navigate('Home');
      } else {
        navigation.navigate('Home');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
});

export default LoginScreen;
