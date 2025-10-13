import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SpecialisationsPage from './pages/SpecialisationsPage';
import InterpretResultsPage from './pages/InterpretResultsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/specialisations" element={<SpecialisationsPage />} />
        <Route path="/interpret-results" element={<InterpretResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;