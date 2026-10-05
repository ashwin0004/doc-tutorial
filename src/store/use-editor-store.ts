import { create } from "zustand";
import { type Editor } from "@tiptap/react";

interface EditorState {
    editor: Editor | null;
    setEditor: (editor: Editor | null) => void;
    isTodoOpen: boolean;
    setIsTodoOpen: (isOpen: boolean) => void;
    toggleTodoOpen: () => void;
};

export const useEditorStore = create<EditorState>((set) => ({
    editor: null,
    setEditor: (editor) => set({ editor }),
    isTodoOpen: false,
    setIsTodoOpen: (isTodoOpen) => set({ isTodoOpen }),
    toggleTodoOpen: () => set((state) => ({ isTodoOpen: !state.isTodoOpen })),
}));

