import React, { useState } from 'react';
import type { QuizQuestion } from '../../types';
import { CheckCircle2, XCircle, HelpCircle, Award, RotateCcw } from 'lucide-react';

interface QuizModuleProps {
  questions?: QuizQuestion[];
  onCompleteQuiz?: (scorePercent: number) => void;
}

export const QuizModule: React.FC<QuizModuleProps> = ({ questions = [], onCompleteQuiz }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-[#faf8f5] border border-stone-200 text-center text-stone-500">
        <HelpCircle className="w-8 h-8 mx-auto mb-2 text-stone-400" />
        <p className="text-sm">No hay preguntas registradas en este cuestionario.</p>
      </div>
    );
  }

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return; // Prevent changing after submission
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percent: Math.round((correct / questions.length) * 100),
    };
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = calculateScore();
    if (onCompleteQuiz) {
      onCompleteQuiz(score.percent);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const score = calculateScore();
  const allAnswered = questions.every(q => selectedAnswers[q.id] !== undefined);

  return (
    <div className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs">
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
            Evaluación Interactiva
          </span>
          <h3 className="text-xl font-bold text-[#281434] mt-1">
            Cuestionario de Comprensión ({questions.length} preguntas)
          </h3>
        </div>

        {submitted && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-stone-600 hover:text-[#281434] hover:bg-stone-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Repetir test</span>
          </button>
        )}
      </div>

      {/* Score Result Banner (when submitted) */}
      {submitted && (
        <div
          className={`p-6 rounded-2xl border flex items-center justify-between ${
            score.percent >= 70
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-2xl ${
                score.percent >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold">
                {score.percent >= 70 ? '¡Excelente trabajo! Has superado el test.' : 'Test completado. Revisa las explicaciones para reforzar.'}
              </h4>
              <p className="text-xs opacity-80 mt-0.5">
                Has acertado {score.correct} de {score.total} preguntas ({score.percent}%).
              </p>
            </div>
          </div>
          <span className="text-2xl font-black">{score.percent}%</span>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-8">
        {questions.map((q, qIndex) => {
          const selectedOption = selectedAnswers[q.id];
          const isCorrect = selectedOption === q.correctIndex;

          return (
            <div key={q.id} className="space-y-3 pb-6 border-b border-stone-100 last:border-0 last:pb-0">
              <div className="flex items-start gap-2">
                <span className="font-bold text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded shrink-0 mt-0.5">
                  #{qIndex + 1}
                </span>
                <p className="font-bold text-sm sm:text-base text-[#281434]">
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2 pt-1 pl-7">
                {q.options.map((option, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  let optionClass = 'border-stone-200 bg-[#faf8f5] hover:bg-purple-50/50 hover:border-purple-200';

                  if (submitted) {
                    if (optIdx === q.correctIndex) {
                      optionClass = 'border-emerald-300 bg-emerald-50 text-emerald-900 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      optionClass = 'border-rose-300 bg-rose-50 text-rose-900 line-through';
                    } else {
                      optionClass = 'border-stone-100 bg-stone-50 opacity-60';
                    }
                  } else if (isSelected) {
                    optionClass = 'border-[#724ae8] bg-purple-50 text-[#281434] font-semibold ring-1 ring-[#724ae8]';
                  }

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`p-3.5 rounded-2xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${optionClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-[#724ae8] bg-[#724ae8] text-white'
                              : 'border-stone-300 bg-white'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span>{option}</span>
                      </div>

                      {submitted && optIdx === q.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {submitted && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Teacher Explanation */}
              {submitted && q.explanation && (
                <div className="ml-7 p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs text-[#281434] leading-relaxed">
                  <strong className="text-purple-900 block mb-0.5">Explicación del profesor:</strong>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!submitted && (
        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="px-8 py-3 rounded-full bg-[#724ae8] hover:bg-[#5d38cc] disabled:bg-stone-200 disabled:text-stone-400 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            {allAnswered ? 'Enviar y corregir cuestionario' : 'Responde todas las preguntas para enviar'}
          </button>
        </div>
      )}
    </div>
  );
};
