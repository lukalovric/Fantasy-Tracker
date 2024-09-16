import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { supabase } from '../utils/supabase';
import PlayerCard from '../components/PlayerCard';
import Header from '../components/Header';
import * as Notifications from 'expo-notifications';

const HomeScreen = ({ navigation }) => {
  const [players, setPlayers] = useState([]);
  const [captains, setCaptains] = useState([]);
  const [nextDeadline, setNextDeadline] = useState(null);
  const [lastGameweekMatches, setLastGameweekMatches] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchPlayers();
    fetchNextDeadline();
    fetchTeams();
  }, []);

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('Players')
        .select('*')
        .eq('is_captain', false)
        .order('points', { ascending: false });

      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      console.error('Error fetching players:', error);
    }

    try {
      const { data: captainData, error: captainError } = await supabase
        .from('Players')
        .select('*')
        .eq('is_captain', true);

      if (captainError) throw captainError;
      setCaptains(captainData || []);
    } catch (error) {
      console.error('Error fetching captains:', error);
    }
  };

  const fetchNextDeadline = async () => {
    try {
      const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');
      const data = await response.json();
      const nextEvent = data.events.find((event) => event.is_next);

      if (nextEvent) {
        setNextDeadline(nextEvent.deadline_time);
        scheduleNotification(nextEvent.deadline_time);
        fetchLastGameweekMatches(nextEvent.id - 1);
      }
    } catch (error) {
      console.error('Error fetching deadline:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');
      const data = await response.json();
      setTeams(data.teams || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchLastGameweekMatches = async (lastGameweekId) => {
    try {
      const matchesResponse = await fetch(`https://fantasy.premierleague.com/api/fixtures/?event=${lastGameweekId}`);
      const matchesData = await matchesResponse.json();
      setLastGameweekMatches(matchesData || []);
    } catch (error) {
      console.error('Error fetching last gameweek matches:', error);
    }
  };

  const getTeamName = (teamId) => {
    const team = teams.find((team) => team.id === teamId);
    return team ? team.name : 'Unknown Team';
  };

  const scheduleNotification = async (deadline) => {
    const deadlineTime = new Date(deadline);
    const notificationTime = new Date(deadlineTime.getTime() - 60 * 60 * 1000);

    if (notificationTime > new Date()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Fantasy Premier League',
          body: '1 hour left before the next deadline. Make your transfers!',
          sound: true,
        },
        trigger: { date: notificationTime },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView>
        {nextDeadline && (
          <Text style={styles.deadlineText}>
            Next Deadline: {new Date(nextDeadline).toLocaleString()}
          </Text>
        )}
        <Text style={styles.sectionTitle}>Recommended Transfers</Text>
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onPress={() => navigation.navigate('PlayerDetail', { playerName: player.name })}
          />
        ))}
        <Text style={styles.sectionTitle}>Captain Picks</Text>
        {captains.map((captain) => (
          <PlayerCard
            key={captain.id}
            player={captain}
            onPress={() => navigation.navigate('PlayerDetail', { playerName: captain.name })}
          />
        ))}
        <Text style={styles.sectionTitle}>Last Gameweek Matches</Text>
        {lastGameweekMatches.map((match) => (
          <View key={match.id} style={styles.matchContainer}>
            <Text>
              {getTeamName(match.team_h)} vs {getTeamName(match.team_a)}
            </Text>
            <Text>
              {match.team_h_score} - {match.team_a_score}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  deadlineText: { fontSize: 16, fontWeight: 'bold', color: 'red', marginBottom: 10 },
  matchContainer: { padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 5 },
});

export default HomeScreen;
