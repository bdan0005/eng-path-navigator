import TopBar from '../components/TopBar';
import Module from '../components/Module';

export default function HomePage() {
  return (
    <div className="px-10 py-5 bg-gray-50 min-h-screen">
      <div className="pb-5">
        <TopBar />
      </div>

      <Module />
    </div>
  );
}
