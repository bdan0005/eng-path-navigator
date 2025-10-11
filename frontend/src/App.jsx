import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SpecialisationsPage from './pages/SpecialisationsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/specialisations" element={<SpecialisationsPage />} />
      </Routes>
    </Router>
  );
}

export default App;