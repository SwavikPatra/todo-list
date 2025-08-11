import React, { useState, useEffect } from "react";
import {dataFiles} from '../data/dataFiles.js'

export default function DSAQuestionTracker() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSection, setSelectedSection] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [tempNote, setTempNote] = useState("");

  // Initial static data

  useEffect(() => {
    const savedData = localStorage.getItem("questionsData");
    if (savedData) {
      setQuestions(JSON.parse(savedData));
      setLoading(false);
    } else {
      loadQuestionsFromFiles();
    }
  }, []);

  function loadQuestionsFromFiles() {
    setLoading(true);
    try {
      const allQuestions = [
        ...dataFiles.dsa.questions.map(q => ({ ...q, section: "DSA" })),
        ...dataFiles.systemDesign.questions.map(q => ({ ...q, section: "System Design" })),
        ...dataFiles.oop.questions.map(q => ({ ...q, section: "OOP" })),
        ...dataFiles.general.questions.map(q => ({ ...q, section: "General" }))
      ];
      setQuestions(allQuestions);
      localStorage.setItem("questionsData", JSON.stringify(allQuestions)); // store initial data
      setLoading(false);
    } catch (err) {
      setError("Error loading question files");
      setLoading(false);
    }
  }

  function updateQuestionInFile(questionId, updates) {
    setQuestions(prev => {
      const updated = prev.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      );
      localStorage.setItem("questionsData", JSON.stringify(updated)); // save to localStorage
      return updated;
    });
  }

  function toggleStatus(id) {
    const question = questions.find(q => q.id === id);
    const newStatus = question.status === "completed" ? "pending" : "completed";
    updateQuestionInFile(id, { status: newStatus });
  }

  function saveNote(id) {
    updateQuestionInFile(id, { notes: tempNote });
    setEditingNote(null);
    setTempNote("");
  }

  function startEditNote(question) {
    setEditingNote(question.id);
    setTempNote(question.notes);
  }

  function cancelEditNote() {
    setEditingNote(null);
    setTempNote("");
  }

  function exportUpdatedFiles() {
    const sections = {
      "DSA": questions.filter(q => q.section === "DSA"),
      "System Design": questions.filter(q => q.section === "System Design"),
      "OOP": questions.filter(q => q.section === "OOP"),
      "General": questions.filter(q => q.section === "General")
    };

    Object.entries(sections).forEach(([sectionName, sectionQuestions]) => {
      const jsonContent = JSON.stringify(sectionQuestions, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sectionName.toLowerCase().replace(' ', '_')}_questions.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  function getDifficultyColor(difficulty) {
    switch (difficulty?.toLowerCase()) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  const sections = ["all", ...new Set(questions.map(q => q.section))];
  const filteredQuestions = questions.filter(q => {
    const matchesSection = selectedSection === "all" || q.section === selectedSection;
    const matchesStatus = statusFilter === "all" || q.status === statusFilter;
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSection && matchesStatus && matchesSearch;
  });

  const stats = {
    total: questions.length,
    completed: questions.filter(q => q.status === "completed").length,
    pending: questions.filter(q => q.status === "pending").length,
    bySection: sections.slice(1).reduce((acc, section) => {
      const sectionQuestions = questions.filter(q => q.section === section);
      acc[section] = {
        total: sectionQuestions.length,
        completed: sectionQuestions.filter(q => q.status === "completed").length
      };
      return acc;
    }, {})
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-slate-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-800 to-purple-800 bg-clip-text text-transparent">
          DSA Question Tracker
        </h1>
        <p className="text-slate-600 mb-6">Track your progress on interview prep</p>
      </header>


      {/* Section Cards */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* All Sections Card */}
          <div 
            onClick={() => setSelectedSection("all")}
            className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
              selectedSection === "all" 
                ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                : 'border-slate-200 bg-white hover:border-indigo-300'
            }`}
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">All Sections</h3>
              <div className="text-2xl font-bold text-indigo-600">
                {stats.completed}/{stats.total}
              </div>
              <p className="text-sm text-slate-600">Total Progress</p>
            </div>
          </div>

          {/* Individual Section Cards */}
          {sections.slice(1).map((section) => (
            <div 
              key={section}
              onClick={() => setSelectedSection(section)}
              className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                selectedSection === section 
                  ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                  : 'border-slate-200 bg-white hover:border-indigo-300'
              }`}
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{section}</h3>
                <div className="text-2xl font-bold text-indigo-600">
                  {stats.bySection[section]?.completed || 0}/{stats.bySection[section]?.total || 0}
                </div>
                <p className="text-sm text-slate-600">Completed</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Controls */}
      <section className="mb-6 bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-800">Question Manager</h2>
          <div className="flex gap-3">
            <button onClick={loadQuestionsFromFiles} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
              🔄 Reset to Default
            </button>
            <button onClick={exportUpdatedFiles} className="px-4 py-2 bg-green-600 text-white rounded-lg">
              💾 Export Updated Files
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Section:</label>
            <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="px-3 py-2 rounded-lg border">
              {sections.map(section => (
                <option key={section} value={section}>
                  {section === "all" ? "All Sections" : section}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border">
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 px-3 py-2 rounded-lg border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* Questions List */}
      <section className="bg-white rounded-2xl shadow-lg p-6">
        {filteredQuestions.map((question) => (
          <div key={question.id} className={`p-5 mb-4 rounded-xl border ${question.status === "completed" ? 'border-green-200 bg-green-50' : 'border-slate-200'}`}>
            <div className="flex justify-between">
              <div>
                <div className="flex gap-3 mb-2">
                  <span className="px-3 py-1 bg-indigo-100 rounded-full text-sm">{question.section}</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(question.difficulty)}`}>{question.difficulty}</span>
                  <span className="text-xs text-slate-500">ID: {question.id}</span>
                </div>
                <h3 className={`text-lg font-medium ${question.status === "completed" ? 'text-green-700' : ''}`}>{question.title}</h3>
                {editingNote === question.id ? (
                  <div className="mt-2">
                    <textarea className="w-full px-3 py-2 border rounded-lg" rows="3" value={tempNote} onChange={(e) => setTempNote(e.target.value)} />
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => saveNote(question.id)} className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
                      <button onClick={cancelEditNote} className="px-3 py-1 bg-gray-500 text-white rounded">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2">
                    {question.notes ? <p className="bg-slate-50 p-3 rounded-lg">{question.notes}</p> : <p className="text-slate-400 italic">No notes yet</p>}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => toggleStatus(question.id)} className={`px-4 py-2 rounded-lg ${question.status === "completed" ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {question.status === "completed" ? '✅ Completed' : '⏳ Mark Complete'}
                </button>
                <button onClick={() => startEditNote(question)} className="px-3 py-2 rounded-lg bg-slate-100">
                  📝 {question.notes ? 'Edit Note' : 'Add Note'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}