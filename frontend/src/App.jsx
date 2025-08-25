import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import Module from './components/Module';
import Specialisations from './components/Specialisations';

function App() {
  return (
    <Router>
      <div className="px-10 py-5">
        <div className="pb-5">
          <TopBar />
        </div>
        <Routes>
          <Route path="/" element={<Module />} />
          <Route path="/specialisations" element={<Specialisations />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;