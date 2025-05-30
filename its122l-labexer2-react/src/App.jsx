import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Exam from './pages/Exam';
import Results from './pages/Results';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect the root to /exam */}
        <Route path="/" element={<Navigate to="/exam" replace />} />
        
        {/* Exam screen */}
        <Route path="/exam" element={<Exam />} />

        {/* Results screen */}
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;