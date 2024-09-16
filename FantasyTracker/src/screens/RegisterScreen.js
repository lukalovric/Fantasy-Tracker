import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { supabase } from '../utils/supabase';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleRegister = async () => {
    const { data: existingUser, error: userCheckError } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

    if (userCheckError && userCheckError.code !== 'PGRST116') {
        Alert.alert('Error', `Failed to check username: ${userCheckError.message}`);
        return;
    }
  
    if (existingUser) {
        Alert.alert('Error', 'Username already taken');
        return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
    });
  
    if (signUpError) {
        Alert.alert('Sign Up Error', signUpError.message);
        return;
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !sessionData?.session?.user) {
      Alert.alert('Error', 'Failed to retrieve user data after sign up.');
      console.error('Session Error:', sessionError);
      return;
    }

    const userId = sessionData.session.user.id;

    const { error: insertError } = await supabase.from('users').insert([
      {
        id: userId,
        username,
        email,
        is_admin: false,
      },
    ]);

    if (insertError) {
        Alert.alert('Error', `Failed to insert user data into the database: ${insertError.message}`);
        console.error('Insert Error:', insertError);
      } else {
        Alert.alert('Success', 'User registered successfully');
        navigation.navigate('Login');
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
      <TextInput
        placeholder="Username"
        secureTextEntry
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
});

export default RegisterScreen;
