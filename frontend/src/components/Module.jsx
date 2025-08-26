import { useState } from 'react';
import Button from './Button';
import Slider from './Slider';
import ProgressHeader from './ProgressHeader';

const questions = [
  {
    id: 1,
    text: "What were the results of your ITP Metrics Personality Assessment?",
    options: ["Extraversion", "Emotionality", "Conscientiousness", "Agreeableness", "Openness"]
  },
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
      <ProgressHeader currentSection={currentQuestionIndex}/>
      <div className="text-3xl font-bold text-black mb-6 text-center">
        {currentQuestion.text}
      </div>

      <div className="flex flex-col space-y-4">
        {/* For some reason the slider doesn't go to 0 if you change manually and jumps back to default val */}
        <Slider 
          value={answers[currentQuestion.id] || 5}
          onChange={(value) => setAnswers({ ...answers, [currentQuestion.id]: value })}
        />
      </div>
    </div>
  );
};

export default Module;