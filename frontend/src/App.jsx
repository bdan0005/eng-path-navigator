import { BrowserRouter as Router } from 'react-router-dom';
import TopBar from './components/TopBar';

function App() {
  return (
    <Router>
      <div className="p-4">
        <TopBar />
      </div>
    </Router>
  );
}

export default App;