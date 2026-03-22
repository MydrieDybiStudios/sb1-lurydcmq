import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Upload, Download, Trash2 } from 'lucide-react';

interface FileItem {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  uploaded_at: string;
  user_id: string;
}

interface FileListProps {
  projectId: string;
  userId: string;
}

const FileList: React.FC<FileListProps> = ({ projectId, userId }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, [projectId]);

  const fetchFiles = async () => {
    const { data, error } = await supabase
      .from('project_files')
      .select('*')
      .eq('project_id', projectId)
      .order('uploaded_at', { ascending: false });
    if (error) console.error(error);
    else setFiles(data || []);
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${projectId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('project-files')
      .upload(filePath, file);

    if (uploadError) {
      console.error(uploadError);
      setUploading(false);
      return;
    }

    const { data: publicUrl } = supabase.storage
      .from('project-files')
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase
      .from('project_files')
      .insert([{
        project_id: projectId,
        user_id: userId,
        file_name: file.name,
        file_url: publicUrl.publicUrl,
        file_size: file.size,
        file_type: file.type,
      }]);

    if (dbError) console.error(dbError);
    else fetchFiles();
    setUploading(false);
  };

  const deleteFile = async (file: FileItem) => {
    if (!confirm(`Удалить файл ${file.file_name}?`)) return;
    // удаляем из storage (нужно знать путь)
    const path = file.file_url.split('/').slice(-2).join('/'); // projectId/filename
    await supabase.storage.from('project-files').remove([path]);
    await supabase.from('project_files').delete().eq('id', file.id);
    fetchFiles();
  };

  if (loading) return <div className="text-center py-4">Загрузка файлов...</div>;

  return (
    <div>
      <div className="mb-4">
        <label className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg cursor-pointer">
          <Upload className="w-4 h-4" />
          {uploading ? 'Загрузка...' : 'Загрузить файл'}
          <input type="file" onChange={handleFileUpload} disabled={uploading} className="hidden" />
        </label>
      </div>

      <div className="space-y-2">
        {files.map(file => (
          <div key={file.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center border border-gray-200">
            <div>
              <p className="font-medium">{file.file_name}</p>
              <p className="text-xs text-gray-500">
                {Math.round(file.file_size / 1024)} KB · {new Date(file.uploaded_at).toLocaleString('ru-RU')}
              </p>
            </div>
            <div className="flex gap-2">
              <a href={file.file_url} download target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                <Download className="w-5 h-5" />
              </a>
              <button onClick={() => deleteFile(file)} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {files.length === 0 && <p className="text-center text-gray-500">Файлов пока нет</p>}
      </div>
    </div>
  );
};

export default FileList;