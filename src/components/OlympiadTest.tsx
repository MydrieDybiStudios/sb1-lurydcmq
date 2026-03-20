import React, { useState, useEffect } from 'react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  maxScore: number;
}

interface OlympiadTestProps {
  questions: Question[];
  durationMinutes: number;
  onComplete: (answers: { questionId: number; selected: number | null; isCorrect: boolean }[], score: number) => void;
  onTimeOut: () => void;
}

const OlympiadTest: React.FC<OlympiadTestProps> = ({
  questions,
  durationMinutes,
  onComplete,
  onTimeOut
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (durationMinutes === 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [durationMinutes]);

  const handleTimeOut = () => {
    if (!submitted) {
      setSubmitted(true);
      onTimeOut();
      calculateAndSubmit();
    }
  };

  const calculateAndSubmit = () => {
    let score = 0;
    const answerDetails = questions.map((q, idx) => {
      const selected = answers[idx];
      const isCorrect = selected !== null && q.options[selected] === q.correctAnswer;
      if (isCorrect) score += q.maxScore;
      return { questionId: q.id, selected, isCorrect };
    });
    onComplete(answerDetails, score);
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    calculateAndSubmit();
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const allAnswered = answers.every(a => a !== null);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 text-gray-900">
      {durationMinutes > 0 && (
        <div className="mb-4 text-right text-lg font-mono">
          ⏱ {formatTime(timeLeft)}
        </div>
      )}
      <div className="mb-4">
        <span className="text-sm text-gray-500">
          Вопрос {currentIndex + 1} из {questions.length}
        </span>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">{questions[currentIndex].question}</h3>
        <div className="space-y-3">
          {questions[currentIndex].options.map((opt, idx) => (
            <label
              key={idx}
              className={`block p-3 border rounded-lg cursor-pointer transition ${
                answers[currentIndex] === idx
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-gray-200 hover:border-yellow-300'
              }`}
            >
              <input
                type="radio"
                name="question"
                value={idx}
                checked={answers[currentIndex] === idx}
                onChange={() => handleAnswer(idx)}
                className="mr-3"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
        >
          Назад
        </button>
        {currentIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg disabled:opacity-50"
          >
            Завершить
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg"
          >
            Далее
          </button>
        )}
      </div>
    </div>
  );
};

export default OlympiadTest;
