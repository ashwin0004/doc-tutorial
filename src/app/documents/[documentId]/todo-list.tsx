"use client";

import React, { useState, useRef, useMemo } from "react";
import {
  useStorage,
  useMutation,
  useUpdateMyPresence,
  useOthers,
} from "@liveblocks/react/suspense";
import { LiveObject } from "@liveblocks/client";
import { useEditorStore } from "@/store/use-editor-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckSquare,
  Square,
  Trash2,
  Plus,
  X,
  Minus,
  CheckCircle2,
  FileDown,
  Edit2,
  Check,
  Users,
} from "lucide-react";
import { toast } from "sonner";

type FilterType = "all" | "active" | "completed";

export const TodoPopup: React.FC = () => {
  const { isTodoOpen, setIsTodoOpen, editor } = useEditorStore();
  const todos = useStorage((root) => root.todos);

  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [isMinimized, setIsMinimized] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Liveblocks presence for typing indicator (inspired by liveblocks nextjs-todo-list)
  const updateMyPresence = useUpdateMyPresence();
  const others = useOthers();

  // Handle typing presence broadcast
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft(e.target.value);

    updateMyPresence({ isTypingTodo: true });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      updateMyPresence({ isTypingTodo: false });
    }, 1200);
  };

  const handleInputBlur = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    updateMyPresence({ isTypingTodo: false });
  };

  // Find other collaborators who are currently typing in the todo list
  const typingUsers = useMemo(() => {
    return others
      .filter((other) => other.presence?.isTypingTodo)
      .map((other) => other.info?.name || "A collaborator");
  }, [others]);

  // Mutations for Liveblocks Storage
  const addTodo = useMutation(({ storage }, text: string) => {
    const liveTodos = storage.get("todos");
    if (!liveTodos) return;
    liveTodos.push(new LiveObject({ text: text.trim(), checked: false }));
  }, []);

  const toggleTodo = useMutation(({ storage }, index: number) => {
    const liveTodos = storage.get("todos");
    if (!liveTodos) return;
    const todo = liveTodos.get(index);
    if (todo) {
      const current = todo.toObject();
      todo.update({ checked: !current.checked });
    }
  }, []);

  const deleteTodo = useMutation(({ storage }, index: number) => {
    const liveTodos = storage.get("todos");
    if (!liveTodos) return;
    liveTodos.delete(index);
  }, []);

  const editTodo = useMutation(({ storage }, index: number, newText: string) => {
    const liveTodos = storage.get("todos");
    if (!liveTodos) return;
    const todo = liveTodos.get(index);
    if (todo && newText.trim()) {
      todo.update({ text: newText.trim() });
    }
  }, []);

  const clearCompleted = useMutation(({ storage }) => {
    const liveTodos = storage.get("todos");
    if (!liveTodos) return;
    // Delete from back to front to preserve valid index positions
    for (let i = liveTodos.length - 1; i >= 0; i--) {
      const item = liveTodos.get(i);
      if (item && item.toObject().checked) {
        liveTodos.delete(i);
      }
    }
  }, []);

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!draft.trim()) return;

    addTodo(draft.trim());
    setDraft("");
    updateMyPresence({ isTypingTodo: false });
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleStartEdit = (index: number, currentText: string) => {
    setEditingIndex(index);
    setEditText(currentText);
  };

  const handleSaveEdit = (index: number) => {
    if (editText.trim()) {
      editTodo(index, editText.trim());
    }
    setEditingIndex(null);
    setEditText("");
  };

  // Insert a task into the Tiptap document at cursor
  const handleInsertSingleToDoc = (todoText: string, checked: boolean) => {
    if (!editor) {
      toast.error("Editor not ready");
      return;
    }

    try {
      editor
        .chain()
        .focus()
        .insertContent([
          {
            type: "taskList",
            content: [
              {
                type: "taskItem",
                attrs: { checked },
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: todoText }],
                  },
                ],
              },
            ],
          },
        ])
        .run();
      toast.success("Task inserted into document");
    } catch {
      editor.chain().focus().insertContent(`\n- [${checked ? "x" : " "}] ${todoText}\n`).run();
      toast.success("Task inserted into document");
    }
  };

  // Insert all tasks into document
  const handleInsertAllToDoc = () => {
    if (!editor) {
      toast.error("Editor not ready");
      return;
    }
    if (!todos || todos.length === 0) {
      toast.info("No tasks to insert");
      return;
    }

    try {
      const taskItems = todos.map((t) => ({
        type: "taskItem",
        attrs: { checked: t.checked },
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: t.text }],
          },
        ],
      }));

      editor
        .chain()
        .focus()
        .insertContent([
          {
            type: "taskList",
            content: taskItems,
          },
        ])
        .run();
      toast.success(`Inserted ${todos.length} tasks into document`);
    } catch {
      const textBlock = todos.map((t) => `- [${t.checked ? "x" : " "}] ${t.text}`).join("\n");
      editor.chain().focus().insertContent(`\n${textBlock}\n`).run();
      toast.success(`Inserted ${todos.length} tasks into document`);
    }
  };

  const totalCount = todos ? todos.length : 0;
  const completedCount = todos ? todos.filter((t) => t.checked).length : 0;
  const activeCount = totalCount - completedCount;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTodos = useMemo(() => {
    if (!todos) return [];
    return todos
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => {
        if (filter === "active") return !item.checked;
        if (filter === "completed") return item.checked;
        return true;
      });
  }, [todos, filter]);

  // If closed, render a clean floating pill button to quickly re-open
  if (!isTodoOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-40 print:hidden">
        <button
          onClick={() => setIsTodoOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-xs font-semibold group cursor-pointer"
          title="Open Collaborative Tasks (Liveblocks Todo)"
        >
          <CheckSquare className="size-4 transition-transform group-hover:scale-110" />
          <span>Tasks</span>
          {activeCount > 0 && (
            <span className="bg-white/20 text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </button>
      </div>
    );
  }

  // Minimized popup pill
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 print:hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-2 p-2 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-2xl">
          <div
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <CheckSquare className="size-4 text-blue-600" />
            <span>Tasks ({completedCount}/{totalCount})</span>
          </div>
          <button
            onClick={() => setIsMinimized(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
            title="Expand"
          >
            <Plus className="size-3.5" />
          </button>
          <button
            onClick={() => setIsTodoOpen(false)}
            className="p-1 text-slate-400 hover:text-red-500 rounded-full"
            title="Close"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-32px)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[580px] transition-all duration-200 print:hidden animate-in fade-in zoom-in-95">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 select-none">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <CheckSquare className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none">
                Collaborative Tasks
              </h3>
              <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold px-1.5 py-0.2 rounded-full">
                Live
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {activeCount === 0 ? "All caught up!" : `${activeCount} task${activeCount === 1 ? "" : "s"} remaining`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsMinimized(true)}
            className="size-7 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            title="Minimize"
          >
            <Minus className="size-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsTodoOpen(false)}
            className="size-7 text-slate-400 hover:text-red-600"
            title="Close"
          >
            <X className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="px-4 pt-2.5 pb-1 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium mb-1">
            <span>Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Input Field */}
      <form onSubmit={handleAdd} className="p-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="Add a new task... (press Enter)"
            className="h-8 text-xs bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 focus-visible:ring-1 focus-visible:ring-blue-500"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!draft.trim()}
            className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white shrink-0 font-medium"
          >
            <Plus className="size-3.5 mr-1" />
            Add
          </Button>
        </div>

        {/* Live Typing Presence Indicator (from liveblocks nextjs-todo-list) */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-blue-600 dark:text-blue-400 font-medium animate-pulse">
            <span className="size-1.5 rounded-full bg-blue-500 animate-ping" />
            <span>
              {typingUsers.length === 1
                ? `${typingUsers[0]} is typing...`
                : `${typingUsers.join(", ")} are typing...`}
            </span>
          </div>
        )}
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-[11px]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilter("all")}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
              filter === "all"
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
              filter === "active"
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
              filter === "completed"
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Done ({completedCount})
          </button>
        </div>

        {completedCount > 0 && (
          <button
            onClick={() => clearCompleted()}
            className="text-[10px] text-muted-foreground hover:text-red-500 transition-colors"
          >
            Clear done
          </button>
        )}
      </div>

      {/* Todo Items List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 max-h-[300px]">
        {filteredTodos.map(({ item, index }) => {
          const isEditing = editingIndex === index;

          return (
            <div
              key={index}
              className={`group flex items-center justify-between p-2 rounded-lg border transition-all ${
                item.checked
                  ? "bg-slate-50/60 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800/50"
                  : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-300 dark:hover:border-blue-700"
              }`}
            >
              {/* Checkbox & Text */}
              <div className="flex items-center gap-2.5 flex-1 min-w-0 mr-2">
                <button
                  type="button"
                  onClick={() => toggleTodo(index)}
                  className="shrink-0 text-slate-400 hover:text-blue-600 focus:outline-none transition-colors"
                >
                  {item.checked ? (
                    <CheckSquare className="size-4 text-blue-600 fill-blue-50 dark:fill-blue-950" />
                  ) : (
                    <Square className="size-4 hover:border-blue-500" />
                  )}
                </button>

                {isEditing ? (
                  <div className="flex items-center gap-1 flex-1">
                    <Input
                      autoFocus
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit(index);
                        if (e.key === "Escape") setEditingIndex(null);
                      }}
                      className="h-6 text-xs px-1.5 py-0.5 bg-white dark:bg-slate-900"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleSaveEdit(index)}
                      className="size-6 text-emerald-600"
                    >
                      <Check className="size-3" />
                    </Button>
                  </div>
                ) : (
                  <span
                    onDoubleClick={() => handleStartEdit(index, item.text)}
                    className={`text-xs break-words select-text cursor-pointer leading-snug flex-1 ${
                      item.checked
                        ? "line-through text-slate-400 dark:text-slate-500"
                        : "text-slate-800 dark:text-slate-100 font-medium"
                    }`}
                    title="Double-click to edit"
                  >
                    {item.text}
                  </span>
                )}
              </div>

              {/* Action buttons (Insert into doc & Delete) */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => handleInsertSingleToDoc(item.text, item.checked)}
                  className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                  title="Insert task into Document at cursor"
                >
                  <FileDown className="size-3.5" />
                </button>
                <button
                  onClick={() => handleStartEdit(index, item.text)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                  title="Edit task text"
                >
                  <Edit2 className="size-3" />
                </button>
                <button
                  onClick={() => deleteTodo(index)}
                  className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                  title="Delete task"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {filteredTodos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground select-none">
            <CheckCircle2 className="size-8 text-slate-300 dark:text-slate-700 mb-2 stroke-[1.5]" />
            <p className="text-xs font-medium">
              {filter === "completed"
                ? "No completed tasks yet"
                : filter === "active"
                ? "No active tasks remaining"
                : "No tasks yet. Add one above!"}
            </p>
            <p className="text-[10px] text-muted-foreground/70 mt-0.5">
              Tasks sync in real-time with all room collaborators
            </p>
          </div>
        )}
      </div>

      {/* Footer bar */}
      {totalCount > 0 && (
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs select-none">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Users className="size-3 text-slate-400" />
            <span>{others.length + 1} online</span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleInsertAllToDoc}
            className="h-7 text-[11px] font-medium gap-1 text-slate-700 dark:text-slate-200 hover:text-blue-600 hover:border-blue-300"
            title="Paste all tasks as a checklist into the document"
          >
            <FileDown className="size-3" />
            Insert All into Doc
          </Button>
        </div>
      )}
    </div>
  );
};
