import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import Module from './components/Module';

function App() {
  return (
    <Router>
      <div className="px-10 py-5 bg-gray-50">
        <div className="pb-5">
          <TopBar />
        </div>
        <Routes>
          <Route path="/" element={<Module />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;