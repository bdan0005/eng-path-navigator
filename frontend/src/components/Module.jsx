import Button from './Button';

const Module = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-light-blue to-white text-white p-10 rounded-2xl shadow-sm transition-shadow hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.07)]">
      <div className="space-y-4">
        <div className="text-center text-black text-5xl font-bold whitespace-pre-line leading-normal">
          {"Engineering Pathways\nNavigator"}
        </div>
        <div className="text-center text-black text-base font-medium whitespace-pre-line leading-normal">
          {"Take this short quiz to find what specialisation suits\nyou best."}
        </div>
      </div>
    </div>
  );
};

export default Module;