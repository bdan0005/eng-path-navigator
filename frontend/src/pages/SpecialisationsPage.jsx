import { useState } from 'react';
import TopBar from '../components/TopBar';
import Button from '../components/Button';

const specialisations = {
  civil: {
    name: 'Civil Engineering',
    description: 'Civil engineering involves designing, constructing, and maintaining infrastructure such as roads, bridges, and buildings.',
    links: [
      { label: 'Monash University - Bachelor of Civil Engineering', url: 'https://www.monash.edu/study/courses/majors-minors-specialisations/specialisations/civil-engineering-xs0003' },
      { label: 'Monash University Handbook - Civil engineering', url: 'https://handbook.monash.edu/current/aos/CIVILENG03' },
      { label: 'Institution of Civil Engineers - What is civil engineering?', url: 'https://www.ice.org.uk/what-is-civil-engineering' }
    ]
  },
  electrical: {
    name: 'Electrical Engineering',
    description: 'Electrical engineering focuses on electrical systems, electronics, and power generation.',
    links: [
      { label: 'Monash University - Bachelor of Electrical Engineering', url: 'https://www.monash.edu/study/courses/majors-minors-specialisations/specialisations/electrical-and-computer-systems-engineering-xs0004' },
      { label: 'Monash University Handbook - Electrical engineering', url: 'https://handbook.monash.edu/2024/aos/ecsyseng04' }
    ]
  },
  electrical: {
    name: 'Electrical Engineering',
    description: 'Electrical engineering focuses on electrical systems, electronics, and power generation.',
    links: [
      { label: 'Monash University - Bachelor of Electrical Engineering', url: 'https://www.monash.edu/study/courses/majors-minors-specialisations/specialisations/electrical-and-computer-systems-engineering-xs0004' },
      { label: 'Monash University Handbook - Electrical engineering', url: 'https://handbook.monash.edu/2024/aos/ecsyseng04' }
    ]
  },
};

export default function SpecialisationsPage() {
  const [activeKey, setActiveKey] = useState('civil');
  const active = specialisations[activeKey];

  return (
    <div className="px-10 py-5 bg-gray-50 min-h-screen">
      <div className="pb-5">
        <TopBar />
      </div>

      <div className="flex bg-white rounded-2xl shadow-sm min-h-[500px]">
        <div className="w-64 align-start justify-start rounded-l-2xl p-6 flex flex-col space-y-4">
          {Object.keys(specialisations).map((key) => (
            <Button
              key={key}
              type="quaternary"
              text={specialisations[key].name}
              fitContainerWidth={true}
              handleClick={() => setActiveKey(key)}
            />
          ))}
        </div>

        <div className="flex-1 p-10 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">{active.name}</h1>
          <p className="text-lg text-gray-700">{active.description}</p>

          {active.links && (
            <div>
              <h2 className="text-xl font-semibold mt-4">Useful links</h2>
              <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                {active.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline transition"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
