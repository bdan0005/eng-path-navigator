import { useState } from 'react';
import Button from './Button';

const questions = [
  {
    id: 1,
    text: "Which of these best describes you?",
    options: ["Analytical", "Creative", "Practical", "Social"]
  },
  {
    id: 2,
    text: "Which subject do you enjoy the most?",
    options: ["Math", "Physics", "Design", "Biology"]
  },
  {
    id: 3,
    text: "Do you prefer working alone or in a team?",
    options: ["Alone", "Team"]
  }
];

const Module = () => {
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleStart = () => {
    setStarted(true);
  };

  const handleAnswerSelect = (option) => {
    // Save the answer
    const updatedAnswers = {
      ...answers,
      [questions[currentQuestionIndex].id]: option
    };
    setAnswers(updatedAnswers);

    // Automatically go to next question (or finish)
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log("Survey complete! User answers:", updatedAnswers);
      // you can send results to backend here
    }
  };

  // Starting page
  if (!started) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-light-blue to-white text-white p-10 rounded-2xl shadow-sm transition-shadow hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.07)]">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="text-center text-black text-5xl font-bold whitespace-pre-line leading-normal">
              {"Engineering Pathways\nNavigator"}
            </div>
            <div className="text-center text-black text-base font-medium whitespace-pre-line leading-normal">
              {"Take this short quiz to find what specialisation suits\nyou best."}
            </div>
          </div>
          <div className="flex justify-center">
            <Button 
              type='primary-shadow'
              text='Get started'
              minHeight={70}
              fitContainerHeight={true}
              textSize='text-md'
              handleClick={handleStart}
            />
          </div>
        </div>
      </div>
    );
  }

  // Survey pages
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-light-blue to-white p-10 rounded-2xl shadow-sm">
      <div className="text-3xl font-bold text-black mb-6 text-center">
        {currentQuestion.text}
      </div>

      <div className="flex flex-col space-y-4">
        {currentQuestion.options.map((option) => (
          <button
            key={option}
            className={`px-6 py-3 rounded-lg border transition ${
              answers[currentQuestion.id] === option
                ? 'bg-blue-600 text-white'
                : 'bg-white text-black hover:bg-blue-100'
            }`}
            onClick={() => handleAnswerSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Module;