// src/App.js
import React from 'react';
import DicomViewer from './components/DicomViewer';
import { DicomProvider } from './context/DicomContext';
import './App.css';

function App() {
  return (
    <DicomProvider>
      <DicomViewer />
    </DicomProvider>
  );
}

export default App;