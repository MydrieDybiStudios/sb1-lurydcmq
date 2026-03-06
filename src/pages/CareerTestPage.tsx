// src/pages/CareerTestPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, RotateCcw, Briefcase } from 'lucide-react';
import { testQuestions } from '../data/careerTestData';
import { directions } from '../data/directionsData';
import { professions } from '../data/professionsData';
import { supabase } from '../lib/supabaseClient';

const CareerTestPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [resultDirection, setResultDirection] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (answers[currentQuestion] === undefined) {
      alert('Пожалуйста, выберите ответ');
      return;
    }
    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const calculateResult = () => {
    setLoading(true);
    // Суммируем веса по направлениям
    const totalWeights: { [key: string]: number } = {};
    answers.forEach((answerIdx, qIdx) => {
      const answer = testQuestions[qIdx].answers[answerIdx];
      Object.entries(answer.weights).forEach(([dir, weight]) => {
        totalWeights[dir] = (totalWeights[dir] || 0) + weight;
      });
    });

    // Находим направление с максимальным весом
    let maxDir = '';
    let maxWeight = -1;
    Object.entries(totalWeights).forEach(([dir, weight]) => {
      if (weight > maxWeight) {
        maxWeight = weight;
        maxDir = dir;
      }
    });

    setResultDirection(maxDir);
    setShowResult(true);
    setLoading(false);

    // Если пользователь авторизован, сохраняем направление в профиль
    if (user && maxDir) {
      supabase
        .from('profiles')
        .update({ direction: maxDir })
        .eq('id', user.id)
        .then(({ error }) => {
          if (error) console.error('Ошибка сохранения направления:', error);
        });
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setResultDirection(null);
  };

  const goToCourses = () => {
    if (resultDirection) {
      navigate(`/cabinet?direction=${resultDirection}`);
    } else {
      navigate('/cabinet');
    }
  };

  const directionName = resultDirection
    ? directions.find(d => d.id === resultDirection)?.name
    : '';

  const recommendedProfessions = resultDirection
    ? professions.filter(p => p.direction === resultDirection)
    : [];

  if (showResult && resultDirection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-yellow-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <h2 className="text-4xl font-bold text-center mb-6">Ваш результат</h2>
            <div className="text-center mb-8">
              <span className="inline-block bg-yellow-500 text-black text-2xl font-bold px-8 py-4 rounded-full shadow-lg">
                {directionName}
              </span>
            </div>
            <p className="text-gray-700 text-lg mb-6">
              Вам подходят следующие профессии:
            </p>
            <div className="space-y-4 mb-8">
              {recommendedProfessions.map(prof => (
                <div key={prof.id} className="border border-yellow-200 rounded-xl p-6 hover:shadow-xl transition bg-gradient-to-r from-white to-yellow-50">
                  <h3 className="text-2xl font-bold text-gray-800">{prof.title}</h3>
                  <p className="text-gray-600 mt-2">{prof.description}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">💰 {prof.salary}</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">🎓 {prof.education}</span>
                  </div>
                  {prof.skills && (
                    <div className="mt-3">
                      <span className="font-semibold">Ключевые навыки: </span>
                      {prof.skills.join(' • ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={goToCourses}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-6 rounded-xl transition transform hover:scale-105 flex items-center justify-center text-lg"
              >
                <Briefcase className="w-6 h-6 mr-2" />
                Перейти к курсам
              </button>
              <button
                onClick={resetTest}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-4 px-6 rounded-xl transition flex items-center justify-center text-lg"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Пройти заново
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Анализируем ваши ответы...</p>
        </div>
      </div>
    );
  }

  const question = testQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / testQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-yellow-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Тест профориентации</h2>
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
              title="Назад"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div
              className="bg-yellow-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-2">
              Вопрос {currentQuestion + 1} из {testQuestions.length}
            </p>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">{question.question}</h3>
            <div className="space-y-3">
              {question.answers.map((answer, idx) => (
                <div
                  key={idx}
                  className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${
                    answers[currentQuestion] === idx
                      ? 'border-yellow-500 bg-yellow-50 shadow-lg'
                      : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-50/50'
                  }`}
                  onClick={() => handleAnswer(idx)}
                >
                  <span className="text-lg font-medium">{answer.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentQuestion === 0}
              className={`px-8 py-3 rounded-xl flex items-center text-lg font-medium ${
                currentQuestion === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Назад
            </button>
            <button
              onClick={handleNext}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-xl flex items-center text-lg transition transform hover:scale-105"
            >
              {currentQuestion === testQuestions.length - 1 ? 'Завершить' : 'Далее'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerTestPage;
