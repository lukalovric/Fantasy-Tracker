import React, { useEffect, useState } from 'react';
import { View, Button, FlatList, TextInput, Text, Alert, StyleSheet } from 'react-native';
import { supabase } from '../utils/supabase';

const AdminHomeScreen = () => {
  const [players, setPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState({ name: '', team: '', points: 0, is_captain: false });

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    const { data, error } = await supabase.from('Players').select('*');
    if (error) {
      Alert.alert('Error fetching players', error.message);
    } else {
      setPlayers(data);
    }
  };

  const addPlayer = async () => {
    const { error } = await supabase.from('Players').insert([newPlayer]);
    if (error) {
      Alert.alert('Error adding player', error.message);
    } else {
      setNewPlayer({ name: '', team: '', points: 0, is_captain: false });
      fetchPlayers();
    }
  };

  const deletePlayer = async (playerId) => {
    const { error } = await supabase.from('Players').delete().eq('id', playerId);
    if (error) {
      Alert.alert('Error deleting player', error.message);
    } else {
      fetchPlayers();
    }
  };

  const handlePointsChange = (value) => {
    const parsedValue = parseInt(value, 10);
    setNewPlayer({ ...newPlayer, points: isNaN(parsedValue) ? 0 : parsedValue });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Recommended Players</Text>
      <TextInput
        placeholder="Player Name"
        value={newPlayer.name}
        onChangeText={(value) => setNewPlayer({ ...newPlayer, name: value })}
        style={styles.input}
      />
      <TextInput
        placeholder="Team"
        value={newPlayer.team}
        onChangeText={(value) => setNewPlayer({ ...newPlayer, team: value })}
        style={styles.input}
      />
      <TextInput
        placeholder="Points"
        value={String(newPlayer.points)}
        keyboardType="numeric"
        onChangeText={handlePointsChange}
        style={styles.input}
      />
      <Button title="Add Player" onPress={addPlayer} />

      <FlatList
        data={players}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.playerCard}>
            <Text>
              {item.name} - {item.team} - Points: {item.points}
            </Text>
            <Button title="Delete" onPress={() => deletePlayer(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  playerCard: { padding: 10, borderWidth: 1, marginBottom: 10, borderRadius: 5 },
});

export default AdminHomeScreen;
