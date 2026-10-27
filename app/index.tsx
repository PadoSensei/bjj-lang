import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container} testID="home-screen-container">
      <Text style={styles.title} testID="app-title">
        BJJ_Lang
      </Text>
      <Text style={styles.subtitle} testID="app-subtitle">
        Learn the language. Understand the game. Connect through Jiu-Jitsu.
      </Text>
      <View style={styles.badge} testID="app-status-badge">
        <Text style={styles.badgeText}>M0 Bootstrap Shell</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  badge: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeText: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '600',
  },
});
