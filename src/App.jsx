import React from 'react';
import AppRouter from './router/AppRouter';
import { ListingsProvider } from './context/ListingsContext';

function App() {
  return (
    <ListingsProvider>
      <AppRouter />
    </ListingsProvider>
  );
}

export default App