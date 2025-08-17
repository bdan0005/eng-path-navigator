import { BrowserRouter as Router } from 'react-router-dom';
import TopBar from './components/TopBar';
import Module from './components/Module';

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
      </div>
    </Router>
  );
}

export default App;