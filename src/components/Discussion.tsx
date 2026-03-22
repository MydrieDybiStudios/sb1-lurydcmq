import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Send } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: { email: string; full_name: string | null };
}

interface DiscussionProps {
  projectId: string;
  userId: string;
}

const Discussion: React.FC<DiscussionProps> = ({ projectId, userId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchComments();

    const channel = supabase
      .channel(`project-${projectId}-comments`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'project_comments',
          filter: `project_id=eq.${projectId}`,
        },
        async (payload) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('id', payload.new.user_id)
            .single();

          const enriched: Comment = {
            id: payload.new.id,
            content: payload.new.content,
            created_at: payload.new.created_at,
            user_id: payload.new.user_id,
            profiles: profileData || undefined,
          };
          setComments((prev) => [...prev, enriched]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('project_comments')
      .select(
        `
        *,
        profiles:user_id ( email, full_name )
      `
      )
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Ошибка загрузки комментариев:', error);
    } else {
      setComments(data || []);
    }
    setLoading(false);
  };

  const sendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSending(true);

    const { error } = await supabase.from('project_comments').insert([
      {
        project_id: projectId,
        user_id: userId,
        content: newComment.trim(),
      },
    ]);

    if (error) {
      console.error('Ошибка отправки комментария:', error);
    } else {
      setNewComment('');
    }
    setSending(false);
  };

  if (loading) {
    return <div className="text-center py-4">Загрузка обсуждения...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
      <div className="h-96 overflow-y-auto mb-4 space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-700">
              {comment.profiles?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="bg-gray-100 rounded-lg p-2 max-w-md">
                <p className="text-sm font-semibold">
                  {comment.profiles?.full_name ||
                    comment.profiles?.email?.split('@')[0] ||
                    'Пользователь'}
                </p>
                <p className="text-sm">{comment.content}</p>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(comment.created_at).toLocaleTimeString('ru-RU')}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendComment} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Напишите сообщение..."
          className="flex-1 border rounded-lg px-3 py-2"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg flex items-center gap-1"
        >
          <Send className="w-4 h-4" />
          Отправить
        </button>
      </form>
    </div>
  );
};

export default Discussion;