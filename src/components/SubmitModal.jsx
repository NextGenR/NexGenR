import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { SECTIONS, STATUS } from '../data/questions';

export default function SubmitModal({
  isOpen,
  onClose,
  onConfirmSubmit,
  questions,
  questionStatuses,
  sections = SECTIONS
}) {
  if (!isOpen) return null;

  // Calculate per section statistics
  const currentSections = sections || SECTIONS;
  const sectionStats = currentSections.map((sec) => {
    const secQuestions = questions.slice(sec.startIndex, sec.endIndex + 1);
    let answered = 0;
    let notAnswered = 0;
    let marked = 0;
    let markedAnswered = 0;
    let notVisited = 0;

    secQuestions.forEach((q) => {
      const s = questionStatuses[q.question_number]?.status;
      if (s === STATUS.ANSWERED) answered++;
      else if (s === STATUS.NOT_ANSWERED) notAnswered++;
      else if (s === STATUS.MARKED_FOR_REVIEW) marked++;
      else if (s === STATUS.ANSWERED_AND_MARKED) markedAnswered++;
      else notVisited++;
    });

    return {
      sec,
      total: secQuestions.length,
      answered,
      notAnswered,
      marked,
      markedAnswered,
      notVisited,
    };
  });

  const grandTotal = sectionStats.reduce(
    (acc, curr) => ({
      total: acc.total + curr.total,
      answered: acc.answered + curr.answered,
      notAnswered: acc.notAnswered + curr.notAnswered,
      marked: acc.marked + curr.marked,
      markedAnswered: acc.markedAnswered + curr.markedAnswered,
      notVisited: acc.notVisited + curr.notVisited,
    }),
    { total: 0, answered: 0, notAnswered: 0, marked: 0, markedAnswered: 0, notVisited: 0 }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-300">
        {/* Header */}
        <div className="bg-[#1b4d89] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-300" />
            <h3 className="font-bold text-base">Examination Summary</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
          <p className="text-xs sm:text-sm text-gray-700">
            Please review the summary of your responses across all sections before final submission:
          </p>

          {/* Table */}
          <div className="overflow-x-auto border border-gray-300 rounded">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100 text-gray-700 font-bold">
                  <th className="border-b border-gray-300 p-2.5">Section Name</th>
                  <th className="border-b border-gray-300 p-2.5 text-center">Total</th>
                  <th className="border-b border-gray-300 p-2.5 text-center text-green-700">Answered</th>
                  <th className="border-b border-gray-300 p-2.5 text-center text-red-600">Not Answered</th>
                  <th className="border-b border-gray-300 p-2.5 text-center text-purple-700">Marked Review</th>
                  <th className="border-b border-gray-300 p-2.5 text-center text-purple-800">Answered &amp; Marked</th>
                  <th className="border-b border-gray-300 p-2.5 text-center text-gray-500">Not Visited</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sectionStats.map(({ sec, total, answered, notAnswered, marked, markedAnswered, notVisited }) => (
                  <tr key={sec.id} className="hover:bg-gray-50">
                    <td className="p-2.5 font-medium text-gray-800">{sec.shortTitle}</td>
                    <td className="p-2.5 text-center font-bold">{total}</td>
                    <td className="p-2.5 text-center font-bold text-green-600 bg-green-50/50">{answered}</td>
                    <td className="p-2.5 text-center font-bold text-red-600 bg-red-50/50">{notAnswered}</td>
                    <td className="p-2.5 text-center font-bold text-purple-700 bg-purple-50/50">{marked}</td>
                    <td className="p-2.5 text-center font-bold text-purple-900 bg-purple-100/50">{markedAnswered}</td>
                    <td className="p-2.5 text-center font-semibold text-gray-500">{notVisited}</td>
                  </tr>
                ))}
                {/* Grand Total Row */}
                <tr className="bg-gray-100 font-bold text-gray-900">
                  <td className="p-2.5">Total</td>
                  <td className="p-2.5 text-center">{grandTotal.total}</td>
                  <td className="p-2.5 text-center text-green-700">{grandTotal.answered}</td>
                  <td className="p-2.5 text-center text-red-700">{grandTotal.notAnswered}</td>
                  <td className="p-2.5 text-center text-purple-700">{grandTotal.marked}</td>
                  <td className="p-2.5 text-center text-purple-900">{grandTotal.markedAnswered}</td>
                  <td className="p-2.5 text-center text-gray-600">{grandTotal.notVisited}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-amber-50 border border-amber-300 p-3 rounded text-amber-900 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Are you sure you want to submit your mock test?</span>
              <p className="mt-0.5 text-amber-800">
                Once submitted, you will not be able to modify your answers. You will be shown your detailed scorecard and solutions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-300 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-400 text-gray-700 hover:bg-gray-100 text-xs font-semibold rounded transition"
          >
            Resume Exam
          </button>
          <button
            onClick={onConfirmSubmit}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded shadow transition tracking-wide"
            id="modal-confirm-submit"
          >
            Yes, Submit Test
          </button>
        </div>
      </div>
    </div>
  );
}
