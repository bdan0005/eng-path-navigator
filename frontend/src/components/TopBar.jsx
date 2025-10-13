import { Link } from 'react-router-dom';
import Button from './Button';
import Logo from '../assets/temp_logo.png';

const TopBar = () => {
  return (
    <div className="w-full bg-white shadow-sm px-20 py-4 rounded-2xl flex items-center justify-between">
      <img src={Logo} alt="Logo" className="h-12 w-auto" />
      <Link to="/">
        <Button 
          type="secondary" 
          text="Take the quiz"
        />
      </Link>
      <Link to="/interpret-results">
        <Button 
          type="secondary" 
          text="Interpreting your results"
          rounded="md"
        />
      </Link>
      <Link to="/specialisations">
        <Button 
          type="primary" 
          text="Specialisations"
          rounded="md"
        />
      </Link>
    </div>
  );
};

export default TopBar;
