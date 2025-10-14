import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import ProgressHeader from './ProgressHeader';
import SliderQuestion from './SliderQuestion';
import CheckboxQuestion from './CheckboxQuestion';
import Recommendations from './Recommendations';
import RankQuestion from './RankQuestion';
import InterestForm from './InterestForm';
import { recommend } from "../services/recommendApi";
import { sendToSheet } from '../services/sendToSheetApi';
import { ReactComponent as ArrowLeft } from "../assets/arrow-left-blk.svg";
import { ReactComponent as ArrowRight } from "../assets/arrow-right-wht.svg";

const questions = [
  {
    id: 1,
    type: 'slider',
    text: "What were the results of your ITP Metrics Personality Assessment?",
    options: ["Extraversion", "Emotionality", "Conscientiousness", "Agreeableness", "Openness"],
    minValue: 0,
    maxValue: 100,
    step: 1,
  },
  {
    id: 2,
    type: 'checkbox',
    text: "Please select the hobbies/activities you enjoy in your spare time.",
    options: ["Arts and crafts", "Board games", "Bouldering", "Cars/automotive", "Cooking/Baking", "Gaming", "Gardening", "Lego", "Music", "Outdoor activities (e.g. hiking)", "Programming or other computer-related activities", "Reading", "Sports", "Travelling", "3D printing"],
    maxSelectable: 5,
  },
  {
    id: 3,
    type: 'rank',
    text: "Please rank four content items that you found most interesting from the first-year engineering foundation units.",
    options: ["Chemical processes (wastewater)", "Circuits", "Coding", "Computer aided design (CAD)", "Data analysis", "Dynamics", "Engineering design", "Materials properties", "Numerical modelling", "Smart systems", "Statics", "3D printing"],
    maxRank: 4,
  }
];

const Module = () => {
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);
  const [ranking, setRanking] = useState([]);
  const [studentData, setStudentData] = useState(null);

  const handleStart = () => setStarted(true);

  const handleFormSubmit = async ({ email, rating }) => {
    if (!studentData || !ranking) return;

    try {
      const payload = {
        ...studentData,
        ranking,
        email,
        rating
      };

      console.log("Saving combined data:", payload);

      const data = await sendToSheet(payload);

      try {
        console.log("Response from Send to Sheet Function:", data);
      } catch {
        console.warn("Received non-JSON response:", data);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      console.error("Error submitting. Please try again later.");
    }
  };

  const handleAnswerChange = (value) => {
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const studentData = buildStudentData(answers);
      setStudentData(studentData)
      try {
        const data = await recommend(studentData);
        setRanking(data.ranking);
        setCompleted(true);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      setStarted(false);
      setAnswers({});
      setCurrentQuestionIndex(0);
    }
  };

  const buildStudentData = (answers) => {
    const personality = answers[1] || {};
    const hobbies = answers[2] || [];
    const interestRanks = answers[3] || {};

    const interests = Object.entries(interestRanks)
      .sort(([, a], [, b]) => a - b)
      .map(([key]) => key);

    return {
      extraversion: personality["Extraversion"] || 0,
      emotionality: personality["Emotionality"] || 0,
      conscientiousness: personality["Conscientiousness"] || 0,
      agreeableness: personality["Agreeableness"] || 0,
      openness: personality["Openness"] || 0,
      hobbies,
      interests
    };
  };

  const renderQuestion = () => {
    if (completed) {
      return (
        <div className="space-y-6 w-full text-center">
          <h1 className="text-4xl font-bold">Your Recommendations</h1>

          {ranking.length > 0 ? (
            <div className="w-full overflow-y-auto">
              <div className="w-full max-w-[1200px] mx-auto">
                <Recommendations specialisations={ranking} />
              </div>
            </div>
          ) : (
            <p>Loading your results...</p>
          )}

          <div className="w-full max-w-full flex justify-center gap-4">
            <Link to="/specialisations">
              <Button
                type="tertiary-bordered"
                text="Learn more"
              />
            </Link>
            <Button
              type="tertiary"
              text="Restart quiz"
              handleClick={() => {
                setAnswers({});
                setRanking(null);
                setCompleted(false);
                setStarted(false);
                setCurrentQuestionIndex(0);
                setStudentData(null);
              }}
            />
          </div>
          
          <InterestForm onChange={handleFormSubmit} />
        </div>
      );
    }

    const currentQuestion = questions[currentQuestionIndex];

    switch (currentQuestion.type) {
      case 'slider':
        return (
          <SliderQuestion
            text={currentQuestion.text}
            options={currentQuestion.options}
            min={currentQuestion.minValue}
            max={currentQuestion.maxValue}
            step={currentQuestion.step}
            onChange={handleAnswerChange}
          />
        );
      case 'checkbox':
        return (
          <CheckboxQuestion
            text={currentQuestion.text}
            options={currentQuestion.options}
            maxSelectable={currentQuestion.maxSelectable}
            onChange={handleAnswerChange}
          />
        );
      case 'rank':
        return (
          <RankQuestion
            text={currentQuestion.text}
            options={currentQuestion.options}
            maxRank={currentQuestion.maxRank}
            onChange={handleAnswerChange}
          />
        );
      default:
        return <div>Unsupported question type</div>;
    }
  };

  if (!started) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white p-10 rounded-2xl shadow-md">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="text-center text-black text-5xl font-bold whitespace-pre-line leading-normal">
              {"Engineering Pathways\nNavigator"}
            </div>
            <div className="text-center text-black text-lg font-medium whitespace-pre-line leading-normal">
              {"Take this short quiz to find what specialisation suits\nyou best."}
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              type="primary-shadow"
              text="Get started"
              minHeight={70}
              fitContainerHeight={true}
              textSize="text-lg"
              handleClick={handleStart}
              size="lg"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-br from-sky-50 to-white p-6 rounded-2xl shadow-sm transition-shadow hover:shadow-[0_10px_10px_-10px_rgba(0,0,0,0.07)]">
      <ProgressHeader
        totalSections={questions.length}
        currentSection={currentQuestionIndex}
        isComplete={completed}
      />

      <div className="flex-1 w-full max-w-4xl overflow-y-auto mt-1 mb-6 pt-5">
        {renderQuestion()}
      </div>

      {!completed && (
        <div className="w-full max-w-3xl flex justify-center">
          <div className="px-5">
            <Button
              type="secondary"
              icon={<ArrowLeft />}
              handleClick={handleBack}
              rounded="full"
            />
          </div>
          <div className="px-5">
            <Button
              type="tertiary"
              icon={<ArrowRight />}
              handleClick={handleNext}
              size="md"
              rounded="full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Module;

