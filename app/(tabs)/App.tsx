import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import JogosList from '../../src/screens/JogosList';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {/* Deixa a parte de cima azul escuro com texto claro */}
        <StatusBar backgroundColor="#003366" barStyle="light-content" />
        <Text style={styles.loadingText}>U$D GAMES</Text>
      </View>
    );
  }

  return (
    <>
      {/* Também aplica na tela principal */}
      <StatusBar backgroundColor="#003366" barStyle="light-content" />
      <JogosList />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#003366', // azul escuro
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
});
