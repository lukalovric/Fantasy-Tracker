import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

const PlayerCard = ({ player, onPress }) => {
  const playerName = player?.name ?? 'Unknown Player';
  const playerTeam = player?.team ?? 'Unknown Team';
  const playerPoints = player?.points ?? 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.name}>{playerName}</Text>
      <Text>Team: {playerTeam}</Text>
      <Text>Points: {playerPoints}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PlayerCard;
