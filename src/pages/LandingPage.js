import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";

export default function TodoExcelApp() {
  // Define the initial todos with explicit structure
  const initialTodos = [
    { 
      id: Math.random().toString(36).slice(2, 9), 
      title: "Buy groceries", 
      done: false, 
      notes: "Milk, eggs, bread",
      priority: "medium",
      createdAt: new Date().toISOString(),
      dueDate: ""
    },
    { 
      id: Math.random().toString(36).slice(2, 9), 
      title: "Read 20 pages", 
      done: true, 
      notes: "Chapter 4 - Great Expectations",
      priority: "low",
      createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      dueDate: ""
    },
    { 
      id: Math.random().toString(36).slice(2, 9), 
      title: "Finish project proposal", 
      done: false, 
      notes: "Include budget and timeline",
      priority: "high",
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      dueDate: new Date(Date.now() + 604800000).toISOString() // Next week
    },
  ];

  const [todos, setTodos] = useState(initialTodos);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [filter, setFilter] = useState("all"); // all, done, pending, high, medium, low
  const [sortBy, setSortBy] = useState("created"); // created, title, priority, due
  const titleRef = useRef(null);

  function cryptoRandomId() {
    return Math.random().toString(36).slice(2, 9);
  }

  function addTodo(e) {
    e && e.preventDefault();
    if (!title.trim()) return;
    
    const newTodo = { 
      id: cryptoRandomId(), 
      title: title.trim(), 
      done: false, 
      notes: notes.trim(),
      priority: priority,
      createdAt: new Date().toISOString(),
      dueDate: dueDate
    };
    
    setTodos((prevTodos) => [newTodo, ...prevTodos]);
    setTitle("");
    setNotes("");
    setPriority("medium");
    setDueDate("");
    titleRef.current?.focus();
  }

  function startEdit(todo) {
    setEditingId(todo.id);
    setTitle(todo.title);
    setNotes(todo.notes || "");
    setPriority(todo.priority || "medium");
    setDueDate(todo.dueDate || "");
    titleRef.current?.focus();
  }

  function saveEdit(e) {
    e && e.preventDefault();
    if (!title.trim()) return;
    
    setTodos((prevTodos) => 
      prevTodos.map((todo) => 
        todo.id === editingId 
          ? { 
              ...todo, 
              title: title.trim(), 
              notes: notes.trim(),
              priority: priority,
              dueDate: dueDate
            } 
          : todo
      )
    );
    cancelEdit();
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle("");
    setNotes("");
    setPriority("medium");
    setDueDate("");
  }

  function toggleDone(id) {
    setTodos((prevTodos) => 
      prevTodos.map((todo) => 
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  }

  function removeTodo(id) {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    setSelected(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }

  function getPriorityColor(priority) {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  }

  function isOverdue(dueDate) {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  }

  // Filter and sort todos
  function getFilteredAndSortedTodos() {
    let filtered = todos;

    // Apply filter
    switch (filter) {
      case "done":
        filtered = todos.filter(todo => todo.done);
        break;
      case "pending":
        filtered = todos.filter(todo => !todo.done);
        break;
      case "high":
        filtered = todos.filter(todo => todo.priority === "high");
        break;
      case "medium":
        filtered = todos.filter(todo => todo.priority === "medium");
        break;
      case "low":
        filtered = todos.filter(todo => todo.priority === "low");
        break;
      case "overdue":
        filtered = todos.filter(todo => !todo.done && isOverdue(todo.dueDate));
        break;
      default:
        filtered = todos;
    }

    // Apply sort
    switch (sortBy) {
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      case "due":
        filtered.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
        break;
      case "created":
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  }

  // Export helpers
  function exportToExcel({ all = true, filename = "todos.xlsx", selectedIds = [] } = {}) {
    const todosToExport = all ? todos : todos.filter((todo) => selectedIds.includes(todo.id));
    
    const rows = todosToExport.map((todo, idx) => ({
      "#": idx + 1,
      ID: todo.id,
      Title: todo.title,
      Status: todo.done ? "Completed" : "Pending",
      Priority: todo.priority ? todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1) : "Medium",
      Notes: todo.notes || "",
      "Created Date": formatDate(todo.createdAt),
      "Due Date": formatDate(todo.dueDate),
      "Is Overdue": (!todo.done && isOverdue(todo.dueDate)) ? "Yes" : "No"
    }));

    if (rows.length === 0) {
      alert("Nothing to export — add or select todos first.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    
    // Auto-size columns
    const colWidths = [
      { wch: 5 },   // #
      { wch: 10 },  // ID
      { wch: 30 },  // Title
      { wch: 12 },  // Status
      { wch: 10 },  // Priority
      { wch: 40 },  // Notes
      { wch: 15 },  // Created Date
      { wch: 15 },  // Due Date
      { wch: 12 }   // Is Overdue
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Todos");
    XLSX.writeFile(workbook, filename);
  }

  // Selection system
  function toggleSelect(id) {
    setSelected((s) => {
      const next = new Set(Array.from(s));
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function clearSelection() { 
    setSelected(new Set()); 
  }

  function selectAll() { 
    const visibleTodos = getFilteredAndSortedTodos();
    setSelected(new Set(visibleTodos.map(todo => todo.id))); 
  }

  const filteredTodos = getFilteredAndSortedTodos();
  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.done).length,
    pending: todos.filter(t => !t.done).length,
    overdue: todos.filter(t => !t.done && isOverdue(t.dueDate)).length,
    high: todos.filter(t => t.priority === "high").length
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 to-blue-50 text-slate-900">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
            Todo Manager Pro
          </h1>
          <p className="text-slate-600 mb-4">
            Manage your tasks with priorities, due dates, and Excel export capabilities.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-3 rounded-xl shadow-sm text-center">
              <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
              <div className="text-sm text-slate-600">Total</div>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-slate-600">Completed</div>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
              <div className="text-sm text-slate-600">Pending</div>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm text-center">
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
              <div className="text-sm text-slate-600">Overdue</div>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.high}</div>
              <div className="text-sm text-slate-600">High Priority</div>
            </div>
          </div>
        </header>

        {/* Add/Edit Form */}
        <section className="mb-8 bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Task Title *
                </label>
                <input
                  ref={titleRef}
                  className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter task title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (editingId) {
                        saveEdit();
                      } else {
                        addTodo();
                      }
                    }
                  }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Priority
                  </label>
                  <select
                    className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Notes
              </label>
              <textarea
                className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                placeholder="Add notes (optional)"
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={editingId ? saveEdit : addTodo}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {editingId ? "Save Changes" : "Add Task"}
              </button>
              {editingId && (
                <button 
                  onClick={cancelEdit} 
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Controls */}
        <section className="mb-6 bg-white p-4 rounded-2xl shadow-sm">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">Filter:</span>
                <select
                  className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending</option>
                  <option value="done">Completed</option>
                  <option value="overdue">Overdue</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">Sort by:</span>
                <select
                  className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="created">Created Date</option>
                  <option value="title">Title</option>
                  <option value="priority">Priority</option>
                  <option value="due">Due Date</option>
                </select>
              </div>
            </div>

            {/* Export & Selection */}
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => exportToExcel({ all: true })} 
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Export All
              </button>
              <button 
                onClick={() => exportToExcel({ all: false, selectedIds: Array.from(selected), filename: 'todos-selected.xlsx' })} 
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={selected.size === 0}
              >
                Export Selected ({selected.size})
              </button>
              <button 
                onClick={selectAll} 
                className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors text-sm"
              >
                Select All
              </button>
              <button 
                onClick={clearSelection} 
                className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors text-sm"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </section>

        {/* Todo List */}
        <section className="bg-white rounded-2xl shadow-lg border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold">
              Tasks ({filteredTodos.length} {filter !== 'all' && `of ${todos.length}`})
            </h2>
          </div>

          <div className="p-6">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-slate-500 text-lg">
                  {filter === 'all' ? 'No tasks yet. Add your first task above!' : `No ${filter} tasks found.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTodos.map((todo) => (
                  <div 
                    key={todo.id} 
                    className={`p-4 rounded-xl border transition-all hover:shadow-md ${
                      selected.has(todo.id) 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <input 
                        type="checkbox" 
                        checked={selected.has(todo.id)} 
                        onChange={() => toggleSelect(todo.id)} 
                        className="mt-1.5 rounded border-slate-300"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className={`text-lg font-medium ${
                              todo.done ? 'line-through text-slate-400' : 'text-slate-900'
                            }`}>
                              {todo.title}
                            </h3>
                            {todo.notes && (
                              <p className={`text-sm mt-1 ${
                                todo.done ? 'text-slate-400' : 'text-slate-600'
                              }`}>
                                {todo.notes}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                            <button
                              onClick={() => toggleDone(todo.id)}
                              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                todo.done
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {todo.done ? 'Done' : 'Mark Done'}
                            </button>
                            <button
                              onClick={() => startEdit(todo)}
                              className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => removeTodo(todo.id)}
                              className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                            {todo.priority?.charAt(0).toUpperCase() + todo.priority?.slice(1)} Priority
                          </span>
                          
                          {todo.dueDate && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isOverdue(todo.dueDate) && !todo.done
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              Due: {formatDate(todo.dueDate)}
                              {isOverdue(todo.dueDate) && !todo.done && ' (Overdue)'}
                            </span>
                          )}
                          
                          <span className="text-slate-500">
                            Created: {formatDate(todo.createdAt)}
                          </span>
                          
                          <span className="text-slate-400 text-xs">
                            ID: {todo.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <footer className="mt-8 text-center text-sm text-slate-500">
          <p>Built with React + SheetJS • Enhanced with priorities, due dates, and advanced filtering</p>
        </footer>
      </div>
    </div>
  );
}