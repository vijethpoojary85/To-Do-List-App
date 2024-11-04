"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Trash2, Edit2, X, Check } from "lucide-react";

const defaultTasks = [
  {
    id: 1,
    text: "Complete daily coding challenge",
    completed: false,
    isHovered: false,
    dateAdded: new Date(Date.now() - 7200000).toISOString(), 
  },
  {
    id: 2,
    text: "Review project documentation",
    completed: true,
    isHovered: false,
    dateAdded: new Date(Date.now() - 3600000).toISOString(), 
  },
  {
    id: 3,
    text: "Setup team meeting",
    completed: false,
    isHovered: false,
    dateAdded: new Date().toISOString(), // current time
  },
];

export default function TodoList() {
  const [tasks, setTasks] = useState(defaultTasks);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "dateAdded",
    direction: "desc",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to sort tasks based on current config
  const getSortedTasks = (tasksToSort) => {
    return [...tasksToSort].sort((a, b) => {
      if (sortConfig.key === "dateAdded") {
        const compareResult = new Date(b.dateAdded) - new Date(a.dateAdded);
        return sortConfig.direction === "asc" ? -compareResult : compareResult;
      } else if (sortConfig.key === "completed") {
        if (a.completed === b.completed) {
          return new Date(b.dateAdded) - new Date(a.dateAdded);
        }
        return sortConfig.direction === "asc"
          ? a.completed
            ? 1
            : -1
          : a.completed
          ? -1
          : 1;
      }
      return 0;
    });
  };

  useEffect(() => {
    setTasks((prevTasks) => getSortedTasks(prevTasks));
  }, [sortConfig]);

  const addTask = () => {
    if (newTask.trim() === "") return;
    const newTaskItem = {
      id: Date.now(),
      text: newTask,
      completed: false,
      isHovered: false,
      dateAdded: new Date().toISOString(),
    };
    setTasks((prevTasks) => getSortedTasks([...prevTasks, newTaskItem]));
    setNewTask("");
  };

  const deleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditText(task.text);
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setEditText("");
  };

  const saveEdit = (taskId) => {
    if (editText.trim() === "") return;
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, text: editText } : task
      )
    );
    setEditingTask(null);
    setEditText("");
  };

  const toggleTask = (taskId) => {
    setTasks((prevTasks) =>
      getSortedTasks(
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      )
    );
  };

  const setHovered = (taskId, isHovered) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, isHovered } : task
      )
    );
  };

  const clearTasks = () => {
    setTasks([]);
  };

  const sortTasks = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "desc"
        ? "asc"
        : "desc";
    setSortConfig({ key, direction });
    setIsDropdownOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div className="flex items-center justify-center bg-[#F5F9FF] min-h-screen px-4 md:px-0">
      <div
        className="w-full md:w-[65vw] h-[630px] bg-white items-center rounded-3xl shadow-lg p-4 md:p-8 flex flex-col"
        style={{
          boxShadow: "0px 0px 4px 0px rgba(0, 23, 71, 0.15)",
          marginTop: "160px",
          marginBottom: "160px",
        }}
      >
        <div className="w-full md:w-[38vw] flex flex-col flex-grow py-4 md:py-8">
          <h1 className="text-[36px] md:text-[48px] font-bold leading-tight tracking-tight mb-6 text-left text-[#11175E] font-sans">
            Daily To Do List
          </h1>

          <div className="flex mb-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Add new list item"
                className="w-full px-4 py-4 text-gray-700 bg-transparent border border-[#EEEEEE] rounded-lg focus:outline-none focus:border-blue-500 pr-20 placeholder-[#B1BACB]"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTask()}
              />
              <button
                onClick={addTask}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 px-7 py-3 bg-[#2D70FD] text-white rounded focus:outline-none hover:bg-red-600"
              >
                Add
              </button>
            </div>
          </div>

          <div className="relative mb-4">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-500 focus:outline-none bg-white border border-gray-200 rounded-lg px-4 py-2"
            >
              <span>
                Sort by:{" "}
                {sortConfig.key === "dateAdded"
                  ? "Date Added"
                  : "Completion Status"}
                {sortConfig.key === "dateAdded" &&
                  ` (${
                    sortConfig.direction === "desc"
                      ? "Newest First"
                      : "Oldest First"
                  })`}
                {sortConfig.key === "completed" &&
                  ` (${
                    sortConfig.direction === "desc"
                      ? "Completed First"
                      : "Incomplete First"
                  })`}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => sortTasks("dateAdded")}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    sortConfig.key === "dateAdded"
                      ? "font-semibold"
                      : "text-gray-700"
                  } hover:bg-gray-100`}
                >
                  {sortConfig.direction === "desc"
                    ? "Oldest First"
                    : "Newest First"}{" "}
                  (Date Added)
                </button>
                <button
                  onClick={() => sortTasks("completed")}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    sortConfig.key === "completed"
                      ? "font-semibold"
                      : "text-gray-700"
                  } hover:bg-gray-100`}
                >
                  {sortConfig.direction === "desc"
                    ? "Incomplete First"
                    : "Completed First"}{" "}
                  (Completion Status)
                </button>
              </div>
            )}
          </div>

          <div className="flex-grow overflow-hidden pt-6">
            <ul className="max-h-[220px] overflow-y-auto space-y-8 ml-4 md:ml-6">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center group"
                  onMouseEnter={() => setHovered(task.id, true)}
                  onMouseLeave={() => setHovered(task.id, false)}
                >
                  <label className="flex items-center w-full cursor-pointer">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="hidden"
                      />
                      {task.completed ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                      )}
                    </div>
                    <div className="ml-3">
                      {editingTask === task.id ? (
                        <input
                          type="text"
                          className="text-sm px-2 py-1 border rounded-md"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && saveEdit(task.id)
                          }
                          autoFocus
                        />
                      ) : (
                        <span
                          className={`${
                            task.completed
                              ? "line-through text-gray-500"
                              : "text-gray-800"
                          } text-sm`}
                        >
                          {task.text}
                        </span>
                      )}
                    </div>
                  </label>
                  <div className="ml-auto flex space-x-2 opacity-0 group-hover:opacity-100">
                    {editingTask === task.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(task.id)}
                          className="text-green-500 hover:text-green-600 focus:outline-none"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-red-500 hover:text-red-600 focus:outline-none"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(task)}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full px-6 md:px-0 md:w-[38vw] text-right flex justify-between items-center">
          <span className="text-gray-600">{tasks.length} items</span>
          <button
            onClick={clearTasks}
            className="text-sm text-blue-500 hover:text-red-600 focus:outline-none ml-4"
          >
            Clear all tasks
          </button>
        </div>
      </div>
    </div>
  );
}