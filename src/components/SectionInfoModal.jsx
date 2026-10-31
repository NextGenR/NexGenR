import React from 'react';
import { X, Award, AlertTriangle, Clock } from 'lucide-react';
import { SECTIONS } from '../data/questions';

export default function SectionInfoModal({
  isOpen,
  onClose,
  sections = SECTIONS,
  totalDurationMinutes = 60,
  totalMarks = 200,
  positiveMarks = 2.0,
  negativeMarks = 0.5
}) {
  if (!isOpen) return null;

  const currentSections = sections || SECTIONS;
  const totalQuestions = currentSections.reduce((sum, s) => sum + s.totalQuestions, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-[#1b4d89] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-300" />
            <h3 className="font-bold text-base">Scheme of Examination &amp; Marking Pattern</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[75vh] overflow-y-auto text-sm space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-3 rounded text-blue-900 text-xs">
            <div className="font-bold mb-1 flex items-center">
              <Clock className="w-4 h-4 mr-1 text-[#1b4d89]" /> Total Duration: {totalDurationMinutes} Minutes | Total Questions: {totalQuestions} | Maximum Marks: {totalMarks}
            </div>
            <div>
              There is a negative marking of <span className="font-bold text-red-600">{Number(negativeMarks).toFixed(2)} marks</span> for each wrong answer. Each correct response fetches <span className="font-bold text-green-700">+{Number(positiveMarks).toFixed(2)} marks</span>.
            </div>
          </div>

          <table className="w-full text-left border-collapse border border-gray-300 text-xs">
            <thead>
              <tr className="bg-gray-100 text-gray-700 font-bold">
                <th className="border border-gray-300 p-2">Part</th>
                <th className="border border-gray-300 p-2">Subject / Section</th>
                <th className="border border-gray-300 p-2 text-center">Questions</th>
                <th className="border border-gray-300 p-2 text-center">Max Marks</th>
              </tr>
            </thead>
            <tbody>
              {currentSections.map((sec) => (
                <tr key={sec.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 font-bold text-gray-600">{sec.part}</td>
                  <td className="border border-gray-300 p-2 font-medium">{sec.title}</td>
                  <td className="border border-gray-300 p-2 text-center font-bold">{sec.totalQuestions}</td>
                  <td className="border border-gray-300 p-2 text-center font-bold text-emerald-700">{sec.maxMarks}</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold">
                <td colSpan="2" className="border border-gray-300 p-2 text-right">Total:</td>
                <td className="border border-gray-300 p-2 text-center">{totalQuestions}</td>
                <td className="border border-gray-300 p-2 text-center text-emerald-800">{totalMarks}</td>
              </tr>
            </tbody>
          </table>

          <div className="text-xs text-gray-600 space-y-1.5 pt-2">
            <h4 className="font-bold text-gray-800">Important Instructions:</h4>
            <p>1. Candidates can shuffle between sections and questions at any time during the examination.</p>
            <p>2. Questions marked for review with an answered option (<span className="text-[#7c3aed] font-semibold">Purple with Green Tick</span>) WILL be considered for evaluation in SSC CBT examination.</p>
            <p>3. Questions marked for review without choosing an option will NOT be evaluated.</p>
            <p>4. Click "Save &amp; Next" to save your response for the current question before moving to another question.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1b4d89] hover:bg-[#153e6e] text-white text-xs font-bold rounded shadow transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
