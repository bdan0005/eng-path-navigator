
import { Link } from 'react-router-dom';
import Button from './Button';
import Logo from '../assets/temp_logo.png';

const TopBar = () => {
  return (
    <div className="w-full bg-white shadow-sm px-20 py-4 rounded-2xl flex items-center justify-between">
      <img src={Logo} alt="Logo" className="h-12 w-auto" />
      <Button 
        type="secondary" 
        text="About"
      />
      <Link to="/Specialisations">
        <Button 
          type="secondary" 
          text="Specialisations"
          rounded="md"
        />
      </Link>
      <Button 
        type="primary" 
        text="Contact us"
        textSize="text-md"
        size="sm"
        rounded="lg"
        minHeight={40}
      />
    </div>
  );
};

export default TopBar;
