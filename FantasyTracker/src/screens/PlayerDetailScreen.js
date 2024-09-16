import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';

const PlayerDetailScreen = ({ route }) => {
  const { playerName } = route.params;
  const [playerDetails, setPlayerDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (playerName) {
      fetchPlayerDetails(playerName);
    } else {
      Alert.alert('Error', 'Player name is missing.');
      setLoading(false);
    }
  }, [playerName]);

  const fetchPlayerDetails = async (name) => {
    try {
      const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');
      const data = await response.json();

      const player = data.elements.find((player) => {
        const fullName = `${player.first_name} ${player.second_name}`.toLowerCase();
        return (
          player.web_name?.toLowerCase() === name.toLowerCase() ||
          fullName === name.toLowerCase() ||
          name.toLowerCase().includes(player.first_name.toLowerCase()) ||
          name.toLowerCase().includes(player.second_name.toLowerCase())
        );
      });

      if (!player) {
        Alert.alert('Error', 'Player not found.');
        setLoading(false);
        return;
      }

      const detailResponse = await fetch(`https://fantasy.premierleague.com/api/element-summary/${player.id}/`);
      const detailData = await detailResponse.json();

      setPlayerDetails({
        ...player,
        ...detailData,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching player details:', error);
      Alert.alert('Error', 'An error occurred while fetching player details.');
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!playerDetails) {
    return <Text>No player details found.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{playerDetails.web_name}</Text>
      <Text>Total Points: {playerDetails.total_points || '0'}</Text>
      <Text>Goals Scored: {playerDetails.goals_scored || '0'}</Text>
      <Text>Assists: {playerDetails.assists || '0'}</Text>
      <Text>Minutes Played: {playerDetails.minutes || '0'}</Text>
      <Text>Clean Sheets: {playerDetails.clean_sheets || '0'}</Text>
      <Text>Yellow Cards: {playerDetails.yellow_cards || '0'}</Text>
      <Text>Red Cards: {playerDetails.red_cards || '0'}</Text>
      <Text>Penalties Missed: {playerDetails.penalties_missed || '0'}</Text>
      <Text>Penalties Saved: {playerDetails.penalties_saved || '0'}</Text>
      <Text>Saves: {playerDetails.saves || '0'}</Text>
      <Text>Own Goals: {playerDetails.own_goals || '0'}</Text>
      <Text>Cost: £{playerDetails.now_cost / 10 || '0'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});

export default PlayerDetailScreen;
