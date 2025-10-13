import React, { useState } from 'react';
import { Test } from '../types/course';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface TestComponentProps {
  test: Test;
  onSubmit: (score: number, total: number) => void;
}

const TestComponent: React.FC<TestComponentProps> = ({ test, onSubmit }) => {
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showError, setShowError] = useState(false);
  
  const handleOptionSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
    setShowError(false);
  };

  const isLastQuestion = currentQuestion === test.questions.length - 1;

  const handleNextQuestion = () => {
    if (answers[currentQuestion] === undefined) {
      setShowError(true);
      return;
    }
    
    if (isLastQuestion) {
      // Calculate score
      let score = 0;
      answers.forEach((answer, index) => {
        if (answer === test.questions[index].correct) {
          score++;
        }
      });
      
      onSubmit(score, test.questions.length);
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const question = test.questions[currentQuestion];

  return (
    <div className="test-component">
      <h4 className="text-xl font-bold mb-6">{test.title}</h4>
      
      {/* Progress dots */}
      <div className="flex justify-center mb-6">
        {test.questions.map((_, index) => (
          <div 
            key={index}
            className={`w-3 h-3 rounded-full mx-1 transition-all ${
              index === currentQuestion 
                ? 'bg-yellow-500 w-6' 
                : answers[index] !== undefined 
                  ? 'bg-yellow-300' 
                  : 'bg-gray-300'
            }`}
            onClick={() => setCurrentQuestion(index)}
          ></div>
        ))}
      </div>
      
      <div>
        <h5 className="text-lg font-bold mb-4">
          Вопрос {currentQuestion + 1}: {question.question}
        </h5>
        
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => (
            <div 
              key={index}
              className={`p-3 border rounded-lg cursor-pointer transition transform hover:scale-[1.01] ${
                answers[currentQuestion] === index 
                  ? 'border-yellow-500 bg-yellow-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleOptionSelect(index)}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                  answers[currentQuestion] === index 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-200'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span>{option}</span>
              </div>
            </div>
          ))}
        </div>
        
        {showError && (
          <div className="flex items-center text-red-600 mb-4">
            <AlertCircle className="mr-2 h-5 w-5" />
            <span>Пожалуйста, выберите ответ перед продолжением</span>
          </div>
        )}
        
        <div className="flex justify-between mt-6">
          <button 
            className={`bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition ${
              currentQuestion === 0 ? 'invisible' : 'visible'
            }`}
            onClick={handlePrevQuestion}
          >
            Предыдущий вопрос
          </button>
          
          <button 
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-6 rounded-lg transition"
            onClick={handleNextQuestion}
          >
            {isLastQuestion ? 'Завершить тест' : 'Следующий вопрос'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;