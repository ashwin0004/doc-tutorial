"use client";


import { useMutation, useStorage } from "@liveblocks/react/suspense";
import { LiveObject } from "@liveblocks/client";
import { useState } from "react";
// removed unused import Todo from liveblocks.config to satisfy ESLint
import { TrashIcon } from "lucide-react";

export const TodoList = () => {
    const todos = useStorage((root) => root.todos);
    const [draft, setDraft] = useState("");

    const addTodo = useMutation(({ storage }, text: string) => {
        const todos = storage.get("todos");
        todos.push(new LiveObject({ text, checked: false }));
    }, []);

    const toggleTodo = useMutation(({ storage }, index: number) => {
        const todo = storage.get("todos").get(index);
        todo?.update({ checked: !todo.toObject().checked });
    }, []);

    const deleteTodo = useMutation(({ storage }, index: number) => {
        const todos = storage.get("todos");
        todos.delete(index);
    }, []);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (draft) {
            addTodo(draft);
            setDraft("");
        }
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-white pt-20">
            <div className="w-full max-w-md p-4 bg-gray-50 rounded shadow-sm border">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">To-Do List</h1>

                <form onSubmit={handleAdd} className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="Add a task..."
                        className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Add
                    </button>
                </form>

                <div className="flex flex-col gap-2">
                    {todos.map((todo, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white border rounded">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={todo.checked}
                                    onChange={() => toggleTodo(index)}
                                    className="w-5 h-5 cursor-pointer accent-blue-600"
                                />
                                <span className={todo.checked ? "line-through text-gray-400" : "text-gray-800"}>
                                    {todo.text}
                                </span>
                            </div>
                            <button
                                onClick={() => deleteTodo(index)}
                                className="text-red-500 hover:text-red-700 p-1"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {todos.length === 0 && (
                        <div className="text-center text-gray-400 py-4">
                            No tasks yet. Add one above!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
