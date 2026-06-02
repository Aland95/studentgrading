"use client";

import { useEffect, useState } from "react";

interface Student {
  id: number;
  name: string;
  grade: number;
  letterGrade: string;
}

const letterColor: Record<string, string> = {
  A: "bg-green-100 text-green-800",
  B: "bg-blue-100 text-blue-800",
  C: "bg-yellow-100 text-yellow-800",
  D: "bg-orange-100 text-orange-800",
  F: "bg-red-100 text-red-800",
};

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [average, setAverage] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newGrade, setNewGrade] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editGrade, setEditGrade] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchStudents() {
    const [studentsRes, avgRes] = await Promise.all([
      fetch("/api/students"),
      fetch("/api/students/average"),
    ]);
    const studentsData = await studentsRes.json();
    const avgData = await avgRes.json();
    setStudents(studentsData);
    setAverage(avgData.average);
    setLoading(false);
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const grade = Number(newGrade);
    if (!newName.trim()) return setError("Name is required.");
    if (isNaN(grade) || grade < 0 || grade > 100) return setError("Grade must be 0–100.");

    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim(), grade }),
    });
    if (!res.ok) {
      const data = await res.json();
      return setError(data.error ?? "Failed to add student.");
    }
    setNewName("");
    setNewGrade("");
    fetchStudents();
  }

  async function handleDelete(id: number) {
    await fetch(`/api/students/${id}`, { method: "DELETE" });
    fetchStudents();
  }

  function startEdit(student: Student) {
    setEditingId(student.id);
    setEditGrade(String(student.grade));
  }

  async function handleUpdate(id: number) {
    const grade = Number(editGrade);
    if (isNaN(grade) || grade < 0 || grade > 100) return;
    await fetch(`/api/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grade }),
    });
    setEditingId(null);
    fetchStudents();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Student Grade Manager</h1>
          <p className="text-gray-500 mt-1">Track and manage student grades in one place</p>
        </div>

        {/* Average card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center gap-4">
          <div className="bg-indigo-100 rounded-xl p-3">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Class Average</p>
            <p className="text-2xl font-bold text-gray-900">
              {average === null ? "—" : `${average} / 100`}
            </p>
          </div>
          <div className="ml-auto text-gray-400 text-sm">{students.length} student{students.length !== 1 ? "s" : ""}</div>
        </div>

        {/* Add student form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Student</h2>
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Student name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="number"
              placeholder="Grade (0–100)"
              value={newGrade}
              onChange={(e) => setNewGrade(e.target.value)}
              min={0}
              max={100}
              className="w-36 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Add Student
            </button>
          </form>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        {/* Students table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">All Students</h2>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-400 text-sm">Loading…</div>
          ) : students.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-sm">No students yet. Add one above.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
                <tr>
                  <th className="text-left px-6 py-3">Name</th>
                  <th className="text-center px-6 py-3">Grade</th>
                  <th className="text-center px-6 py-3">Letter</th>
                  <th className="text-right px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>

                    <td className="px-6 py-4 text-center">
                      {editingId === student.id ? (
                        <input
                          type="number"
                          value={editGrade}
                          onChange={(e) => setEditGrade(e.target.value)}
                          min={0}
                          max={100}
                          className="w-20 text-center rounded-md border border-indigo-400 px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleUpdate(student.id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                        />
                      ) : (
                        <span className="font-mono text-gray-700">{student.grade}</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${letterColor[student.letterGrade]}`}>
                        {student.letterGrade}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {editingId === student.id ? (
                          <>
                            <button
                              onClick={() => handleUpdate(student.id)}
                              className="text-xs bg-green-100 hover:bg-green-200 text-green-800 font-medium px-3 py-1.5 rounded-md transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-3 py-1.5 rounded-md transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(student)}
                              className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium px-3 py-1.5 rounded-md transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(student.id)}
                              className="text-xs bg-red-50 hover:bg-red-100 text-red-700 font-medium px-3 py-1.5 rounded-md transition-colors"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="text-center text-xs text-gray-400">Data is stored in memory and resets on server restart.</p>
      </div>
    </main>
  );
}
