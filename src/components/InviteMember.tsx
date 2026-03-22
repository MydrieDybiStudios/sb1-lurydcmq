import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Mail, UserPlus } from 'lucide-react';

interface InviteMemberProps {
  projectId: string;
  onInvited: () => void;
}

const InviteMember: React.FC<InviteMemberProps> = ({ projectId, onInvited }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Найти пользователя по email
    const { data: users, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .limit(1);

    if (userError || !users || users.length === 0) {
      setMessage('Пользователь с таким email не найден');
      setLoading(false);
      return;
    }

    const userId = users[0].id;

    // Добавить в project_members
    const { error: insertError } = await supabase
      .from('project_members')
      .insert([{ project_id: projectId, user_id: userId, role: 'member' }]);

    if (insertError) {
      if (insertError.code === '23505') {
        setMessage('Пользователь уже является участником');
      } else {
        setMessage('Ошибка при добавлении');
        console.error(insertError);
      }
    } else {
      setMessage('Участник добавлен');
      setEmail('');
      onInvited();
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
      <h3 className="text-lg font-bold mb-4">Пригласить участника</h3>
      <form onSubmit={handleInvite} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email пользователя"
          className="flex-1 border rounded-lg px-3 py-2"
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading} className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg flex items-center gap-1">
          <UserPlus className="w-4 h-4" />
          Пригласить
        </button>
      </form>
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default InviteMember;