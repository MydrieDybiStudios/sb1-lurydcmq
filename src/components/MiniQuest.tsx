import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle } from 'lucide-react';

interface MiniQuestProps {
  questionType: 'term' | 'choice';
}

const MiniQuest: React.FC<MiniQuestProps> = ({ questionType }) => {
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState('');

  // Questions database
  const termQuestions = [
    { 
      question: "Как называется процесс преобразования нефти в бензин и другие продукты?", 
      answer: "перегонка",
      alternatives: ["переработка", "ректификация", "дистилляция", "нефтепереработка", "крекинг"]
    },
    {
      question: "Как называется порода, в которой скапливается нефть?",
      answer: "коллектор",
      alternatives: ["вместилище", "резервуар", "пласт", "скважина"]
    },
    {
      question: "Как называется график, показывающий изменение производительности скважины со временем?",
      answer: "кривая падения",
      alternatives: ["кривая добычи", "дебитограмма", "профиль добычи"]
    }
  ];

  const choiceQuestions = [
    {
      question: "Какое свойство нефти влияет на её текучесть?",
      options: ["Плотность", "Вязкость", "Температура кипения", "Цвет"],
      correctAnswer: 1
    },
    {
      question: "Какой газ преобладает в составе природного газа?",
      options: ["Этан", "Метан", "Пропан", "Бутан"],
      correctAnswer: 1
    },
    {
      question: "В каком веке началась промышленная добыча нефти в России?",
      options: ["XVIII век", "XIX век", "XX век", "XXI век"],
      correctAnswer: 1
    }
  ];

  // Randomly select a question
  const randomTermQuestion = termQuestions[Math.floor(Math.random() * termQuestions.length)];
  const randomChoiceQuestion = choiceQuestions[Math.floor(Math.random() * choiceQuestions.length)];

  const handleTermSubmit = () => {
    const normalizedUserAnswer = userAnswer.toLowerCase().trim();
    const normalizedCorrectAnswer = randomTermQuestion.answer.toLowerCase();
    const isAnswerCorrect = normalizedUserAnswer === normalizedCorrectAnswer || 
                          randomTermQuestion.alternatives.some(alt => 
                            normalizedUserAnswer === alt.toLowerCase());
    
    setIsCorrect(isAnswerCorrect);
    setAnswered(true);
  };

  const handleChoiceSubmit = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setIsCorrect(optionIndex === randomChoiceQuestion.correctAnswer);
    setAnswered(true);
  };

  const resetQuest = () => {
    setAnswered(false);
    setIsCorrect(false);
    setSelectedOption(null);
    setUserAnswer('');
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4 transform hover:scale-[1.01] transition-transform">
      <div className="flex items-start">
        <HelpCircle className="text-yellow-500 mt-1 mr-2 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-yellow-700 font-bold mb-2">Мини-квест: {questionType === 'term' ? 'Угадай термин' : 'Выбери правильный ответ'}</p>
          
          {questionType === 'term' ? (
            <>
              <p className="text-gray-700 mb-3">{randomTermQuestion.question}</p>
              
              {!answered ? (
                <div className="flex items-center">
                  <input 
                    type="text" 
                    className="w-full md:w-2/3 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500" 
                    placeholder="Введите ваш ответ..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTermSubmit()}
                  />
                  <button 
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded-r-lg transition"
                    onClick={handleTermSubmit}
                  >
                    Ответить
                  </button>
                </div>
              ) : (
                <div className="mt-2">
                  <div className={`flex items-center ${isCorrect ? 'text-green-600' : 'text-red-600'} mb-2`}>
                    {isCorrect ? (
                      <><CheckCircle className="mr-2" /> Правильно!</>
                    ) : (
                      <><XCircle className="mr-2" /> Неверно! Правильный ответ: {randomTermQuestion.answer}</>
                    )}
                  </div>
                  <button 
                    className="text-sm text-yellow-600 hover:text-yellow-700 underline"
                    onClick={resetQuest}
                  >
                    Попробовать другой вопрос
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-gray-700 mb-3">{randomChoiceQuestion.question}</p>
              
              <div className="space-y-2 mb-3">
                {randomChoiceQuestion.options.map((option, index) => (
                  <div 
                    key={index}
                    className={`flex items-center p-2 rounded ${
                      answered 
                        ? index === randomChoiceQuestion.correctAnswer 
                          ? 'bg-green-100 border border-green-200' 
                          : index === selectedOption 
                            ? 'bg-red-100 border border-red-200' 
                            : 'bg-gray-50 border border-gray-200' 
                        : 'cursor-pointer hover:bg-gray-100 border border-gray-200'
                    }`}
                    onClick={() => !answered && handleChoiceSubmit(index)}
                  >
                    <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${
                      answered 
                        ? index === randomChoiceQuestion.correctAnswer 
                          ? 'bg-green-500 text-white' 
                          : index === selectedOption 
                            ? 'bg-red-500 text-white' 
                            : 'bg-gray-200' 
                        : 'bg-gray-200'
                    }`}>
                      {answered && index === randomChoiceQuestion.correctAnswer && <CheckCircle className="w-4 h-4" />}
                      {answered && index === selectedOption && index !== randomChoiceQuestion.correctAnswer && <XCircle className="w-4 h-4" />}
                    </div>
                    <span>{option}</span>
                  </div>
                ))}
              </div>
              
              {answered && (
                <button 
                  className="text-sm text-yellow-600 hover:text-yellow-700 underline"
                  onClick={resetQuest}
                >
                  Попробовать другой вопрос
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniQuest;