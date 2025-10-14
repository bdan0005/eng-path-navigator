import { useState } from 'react';
import TopBar from '../components/TopBar';
import Button from '../components/Button';

const specialisations = {
  aerospace: {
    name: "Aerospace Engineering",
    description: "Designs and develops flight vehicles, spacecraft, and related systems.",
    links: [
      { label: "Monash University - Bachelor of Aerospace Engineering", url: "https://www.monash.edu/study/courses/majors-minors-specialisations/specialisations/aerospace-engineering-xs0001" },
      { label: "Monash University Handbook - Aerospace Engineering", url: "https://handbook.monash.edu/current/aos/AEROENG04" },
      { label: "Seek - How to become an Aerospace Engineer", url: "https://www.seek.com.au/career-advice/role/aerospace-engineer" },
      { label: "What is aerospace engineering?", url: "https://www.careerexplorer.com/careers/aerospace-engineer/" },
      { label: "30 Second Engineering", url: "https://ebookcentral.proquest.com/lib/monash/detail.action?docID=5945029" }
    ]
  },
  biomedical: {
    name: "Biomedical Engineering",
    description: "Applies engineering principles to medicine and biology to improve healthcare technology and devices.",
    links: [
      { label: "Monash University - Bachelor of Biomedical Engineering", url: "https://www.monash.edu/study/courses/majors-minors-specialisations/specialisations/biomedical-engineering-xs0285" },
      { label: "Monash University Handbook - Biomedical Engineering", url: "https://handbook.monash.edu/2026/aos/BIOMDENG03" },
      { label: "University of Sydney - Biomedical engineering", url: "https://www.sydney.edu.au/engineering/study/study-areas/biomedical-engineering.html" }
    ]
  },
  chemical: {
    name: "Chemical Engineering",
    description: "Focuses on chemical processes, production, and the development of materials and chemicals.",
    links: [
      { label: "Monash University - Bachelor of Chemical Engineering", url: "https://www.monash.edu/study/courses/majors-minors-specialisations/specialisations/chemical-engineering-xs0002" },
      { label: "Monash University Handbook - Chemical Engineering", url: "https://handbook.monash.edu/2026/aos/CHEMENG04" },
      { label: "What is chemical engineering?", url: "https://www.icheme.org/about-us/what-is-chemical-engineering/" },
      { label: "Stanford University - Chemical engineering", url: "https://cheme.stanford.edu/node/1206" }
    ]
  },
  civil: {
    name: "Civil Engineering",
    description: "Designs and builds infrastructure projects such as roads, bridges, and buildings.",
    links: [
      { label: "Monash University - Bachelor of Civil Engineering", url: "https://www.monash.edu/study/courses/majors-minors-specialisations/specialisations/civil-engineering-xs0003" },
      { label: "Monash University Handbook - Civil Engineering", url: "https://handbook.monash.edu/current/aos/CIVILENG03" },
      { label: "Institution of Civil Engineering - What is civil engineering?", url: "https://www.ice.org.uk/what-is-civil-engineering" }
    ]
  },
  electrical: {
    name: "Electrical Engineering",
    description: "Works with electrical systems, electronics, and power generation.",
    links: [
      { label: "Monash University - Bachelor of Electrical Engineering", url: "https://www.monash.edu/study/courses/majors-minors-specialisations/specialisations/electrical-and-computer-systems-engineering-xs0004" },
      { label: "Monash University Handbook - Electrical Engineering", url: "https://handbook.monash.edu/current/aos/ECSYSENG04" },
      { label: "UNSW - What do electrical engineers do?", url: "https://www.unsw.edu.au/engineering/our-schools/electrical-engineering-telecommunications/student-life/high-school-students/What-do-electrical-engineers-do" }    
    ]
  },
  environmental: {
    name: "Environmental Engineering",
    description: "Solves environmental problems using engineering principles, focusing on sustainability and resource management.",
    links: [
      { label: "Monash University - Bachelor of Environmental Engineering", url: "https://www.monash.edu/study/courses/majors-minors-specialisations/specialisations/environmental-engineering-xs0005" },
      { label: "Monash University Handbook - Environmental Engineering", url: "https://handbook.monash.edu/2026/aos/ENVIRENG03" },
      { label: "UNSW - What is environmental engineering?", url: "https://www.unsw.edu.au/engineering/our-schools/civil-and-environmental-engineering/about-us/civil-environmental-eng-surveying-careers/what-is-environmental-engineering" },
      { label: "Your career - Environmental engineer", url: "https://www.yourcareer.gov.au/occupations/233915/environmental-engineer" }    
    ]
  },
  materials: {
    name: "Materials Engineering",
    description: "Develops and tests new materials for industrial, biomedical, and technological applications.",
    links: [
      { label: "Monash University - Bachelor of Materials Engineering", url: "https://www.monash.edu/study/courses/majors-minors-specialisations/specialisations/materials-engineering-xs0006" },
      { label: "Monash University Handbook - Materials Engineering", url: "https://handbook.monash.edu/2026/aos/MATSENG05" },
      { label: "Your career - Materials engineer", url: "https://www.yourcareer.gov.au/occupations/233112/materials-engineer" }
    ]
  },
  mechanical: {
    name: "Mechanical Engineering",
    description: "Utilises motion, energy, and mechanics to design, manufacture, and assemble machines and devices.",
    links: [
      { label: "Monash University - Bachelor of Mechanical Engineering", url: "https://www.monash.edu/study/courses/majors-minors-specialisations/specialisations/mechanical-engineering-xs0007" },
      { label: "Monash University Handbook - Mechanical Engineering", url: "https://handbook.monash.edu/2026/aos/MECHENG03" },
      { label: "https://www.yourcareer.gov.au/occupations/233512/mechanical-engineer", url: "https://www.yourcareer.gov.au/occupations/233512/mechanical-engineer" }
    ]
  },
  mechatronics: {
    name: "Mechatronics Engineering",
    description: "Combines mechanical, electrical, and computer engineering to create intelligent and automated systems.",
    links: [
      { label: "Monash University - Bachelor of Mechatronics Engineering", url: "https://www.monash.edu/study/courses/majors-minors-specialisations/specialisations/robotics-and-mechatronics-engineering-xs0246" },
      { label: "Monash University Handbook - Mechatronics Engineering", url: "https://handbook.monash.edu/2026/aos/ROBMCTRN03" },
      { label: "Michigan Tech - What is mechatronics?", url: "https://www.mtu.edu/applied-computing/undergraduate/mechatronics/what-is/" }
    ]
  },
  software: {
    name: "Software Engineering",
    description: "Designs and develops software systems, applications, and computational solutions.",
    links: [
      { label: "Monash University - Bachelor of Software Engineering", url: "https://www.monash.edu/study/courses/majors-minors-specialisations/specialisations/software-engineering-xs0010" },
      { label: "Monash University Handbook - Software Engineering", url: "https://handbook.monash.edu/2026/aos/SFTWRENG02" },
      { label: "Your career - Software engineer", url: "https://www.yourcareer.gov.au/occupations/261313/software-engineer" },
      { label: "ComputerScience.org - What is a software engineer?", url: "https://www.computerscience.org/careers/software-engineer/" }    
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
        <div className="w-72 align-start justify-start rounded-l-2xl p-6 flex flex-col space-y-4">
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
