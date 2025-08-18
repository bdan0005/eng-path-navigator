import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import Module from './components/Module';
import Specialisations from './components/Specialisations';

function App() {
  return (
    <Router>
      <div className="px-10 py-5">
        <div className="pb-5">
          <div className="pb-5">
            <TopBar />
          </div>
          <Module />
        </div>
        <Routes>
          <Route path="/" element={<div>{/* Home content here */}</div>} />
          <Route path="/Specialisations" element={<Specialisations />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;