import React, { useState, useEffect } from 'react';
import type { LessonComment } from '../../types';
import { MessageSquare, BookOpen, Send, ThumbsUp, Check } from 'lucide-react';

interface LessonCommentsProps {
  lessonId: string;
  comments: LessonComment[];
  initialNote: string;
  onSaveNote: (note: string) => void;
  onAddComment: (comment: LessonComment) => void;
}

export const LessonComments: React.FC<LessonCommentsProps> = ({
  lessonId,
  comments,
  initialNote,
  onSaveNote,
  onAddComment,
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'discussion'>('notes');
  const [noteText, setNoteText] = useState(initialNote);
  const [isNoteSaved, setIsNoteSaved] = useState(false);

  // New comment input
  const [authorName, setAuthorName] = useState('Estudiante');
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    setNoteText(initialNote);
  }, [lessonId, initialNote]);

  const handleSaveNote = () => {
    onSaveNote(noteText);
    setIsNoteSaved(true);
    setTimeout(() => setIsNoteSaved(false), 2000);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: LessonComment = {
      id: `comm-${Date.now()}`,
      lessonId,
      authorName: authorName.trim() || 'Estudiante',
      authorAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authorName)}`,
      content: commentText.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    onAddComment(newComment);
    setCommentText('');
  };

  const lessonComments = comments.filter(c => c.lessonId === lessonId);

  return (
    <div className="mt-12 pt-8 border-t border-stone-200">
      {/* Podia-style Tab Bar */}
      <div className="flex items-center gap-6 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-colors relative ${
            activeTab === 'notes'
              ? 'text-[#724ae8] after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-0.5 after:bg-[#724ae8]'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Tus notas privadas</span>
        </button>

        <button
          onClick={() => setActiveTab('discussion')}
          className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-colors relative ${
            activeTab === 'discussion'
              ? 'text-[#724ae8] after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-0.5 after:bg-[#724ae8]'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Preguntas y discusión ({lessonComments.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'notes' ? (
          <div className="space-y-3">
            <p className="text-xs text-stone-500">
              Escribe tus reflexiones, soluciones a ejercicios de código o dudas. Se guardan automáticamente para ti.
            </p>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Escribe tus notas personales para esta lección aquí..."
              className="w-full p-4 rounded-2xl border border-stone-200 bg-white text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 min-h-[140px] resize-y"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveNote}
                className="flex items-center gap-1.5 bg-[#281434] hover:bg-stone-800 text-white font-medium px-4 py-2 rounded-full text-xs transition-all active:scale-95"
              >
                {isNoteSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>¡Guardado!</span>
                  </>
                ) : (
                  <span>Guardar notas</span>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* New Comment Input */}
            <form onSubmit={handlePostComment} className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-1/3 px-3 py-1.5 rounded-lg border border-stone-200 text-xs focus:outline-none focus:ring-1 focus:ring-purple-400"
                />
              </div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="¿Tienes alguna duda sobre el notebook o la teoría? Pregunta aquí..."
                rows={2}
                className="w-full p-3 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="flex items-center gap-1.5 bg-[#724ae8] hover:bg-[#5d38cc] disabled:bg-purple-300 text-white font-medium px-4 py-2 rounded-full text-xs shadow-xs transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publicar pregunta</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {lessonComments.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  No hay comentarios aún. ¡Sé el primero en iniciar la conversación!
                </div>
              ) : (
                lessonComments.map((comment) => (
                  <div key={comment.id} className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={comment.authorAvatar}
                          alt={comment.authorName}
                          className="w-6 h-6 rounded-full border border-purple-200"
                        />
                        <span className="font-semibold text-[#281434]">{comment.authorName}</span>
                      </div>
                      <span className="text-[11px] text-stone-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed pl-8">{comment.content}</p>
                    <div className="pl-8 flex items-center gap-3 text-[11px] text-stone-400">
                      <button className="flex items-center gap-1 hover:text-purple-600 transition-colors">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{comment.likes}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
