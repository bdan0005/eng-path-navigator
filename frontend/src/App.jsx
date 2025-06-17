import { BrowserRouter as Router } from 'react-router-dom';
import TopBar from './components/TopBar';

function App() {
  return (
    <Router>
      <div className="px-10 py-5">
        <div className="pb-5">
          <TopBar />
        </div>
      </div>
    </Router>
  );
}

export default App;