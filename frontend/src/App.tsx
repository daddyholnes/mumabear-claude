import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import Dashboard from './components/Dashboard';
import ChatWidget from './components/ChatWidget';
import ThemeProvider from './components/ThemeProvider';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Dashboard />
        <ChatWidget />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
