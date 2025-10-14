import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function usePageTitle() {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        document.title = "Engineering Pathways Navigator";
        break;
      case "/specialisations":
        document.title = "Specialisations | Engineering Pathways Navigator";
        break;
      case "/interpret-results":
        document.title = "Interpreting your results | Engineering Pathways Navigator";
        break;
      default:
        document.title = "Engineering Pathways Navigator";
    }
  }, [location]);
}