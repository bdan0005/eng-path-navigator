import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SpecialisationsPage from "./pages/SpecialisationsPage";
import InterpretResultsPage from "./pages/InterpretResultsPage";
import { usePageTitle } from "./services/usePageTitle";

function App() {
  return (
    <Router>
      <PageTitleHandler />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/specialisations" element={<SpecialisationsPage />} />
        <Route path="/interpret-results" element={<InterpretResultsPage />} />
      </Routes>
    </Router>
  );
}

function PageTitleHandler() {
  usePageTitle();
  return null;
}

export default App;
