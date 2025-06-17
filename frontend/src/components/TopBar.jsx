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
      <Button 
        type="secondary" 
        text="Specialisations"
      />
      <Button 
        type="primary" 
        text="Contact us"
      />
    </div>
  );
};

export default TopBar;
