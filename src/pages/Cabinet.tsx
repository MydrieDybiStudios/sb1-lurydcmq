import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Footer from "../components/Footer";
import ResultsComponent from "../components/ResultsComponent";
import coursesData from "../data/coursesData";
import { useNavigate } from "react-router-dom";

interface ProgressItem {
  course_id: string;
  score: number;
  total: number;
  percentage: number;
  updated_at: string;
}

const Cabinet: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<ProgressItem | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profileData);

      const { data: progressData } = await supabase
        .from("progress")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      setProgress(progressData || []);

      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Загрузка...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-black text-white p-4 text-center font-bold">Личный кабинет</header>

      <main className="flex-grow container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Мои курсы</h2>
        {progress.length === 0 ? (
          <p>Пока нет данных по пройденным курсам</p>
        ) : (
          <div className="space-y-3">
            {progress.map((p) => {
              const course = coursesData.find((c) => c.id === p.course_id);
              return (
                <div
                  key={p.course_id}
                  className="flex justify-between bg-white p-4 border rounded-lg shadow-sm"
                >
                  <div>
                    <p className="font-semibold">{course?.title || p.course_id}</p>
                    <p className="text-sm text-gray-500">
                      Баллы: {p.score}/{p.total}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-bold text-yellow-600">{p.percentage}%</p>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded-lg"
                      onClick={() => setSelectedResult(p)}
                    >
                      Посмотреть результат
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      {selectedResult && profile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedResult(null)}
            >
              ✕
            </button>
            <ResultsComponent
              results={selectedResult}
              courseName={selectedResult.course_id}
              userName={`${profile.first_name || ""} ${profile.last_name || ""}`.trim()}
              onClose={() => setSelectedResult(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cabinet;
