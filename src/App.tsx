import React from 'react';
import { AppProvider } from './context/AppContext';
import MainApp from './components/MainApp';

function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;