import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navbar from './components/Navbar';
import { NativeBaseProvider, Box } from 'native-base';
import { Provider } from 'react-redux';
import store from './store'
import React, { useEffect } from 'react';
import Main from './Main';
import "react-native-gesture-handler";

export default function App() {

  return (
    <NativeBaseProvider>
      <Provider store={store}>
        <Main />
      </Provider>

    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
