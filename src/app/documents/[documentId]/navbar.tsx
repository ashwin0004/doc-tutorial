"use client";

import Link from "next/link"
import Image from "next/image"
import { BsFilePdf } from "react-icons/bs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    BoldIcon,
    CodeIcon,
    FileIcon,
    FileJsonIcon,
    FilePenIcon,
    FilePlusIcon,
    FileTextIcon,
    GlobeIcon,
    HighlighterIcon,
    ItalicIcon,
    PrinterIcon,
    Redo2Icon,
    RemoveFormattingIcon,
    StrikethroughIcon,
    TextIcon,
    TrashIcon,
    UnderlineIcon,
    Undo2Icon,
    Presentation,
    FileText,
    CheckSquareIcon,
    NetworkIcon,
    TableIcon
} from "lucide-react";
import { useMutation } from "convex/react";
import { useStorage } from "@liveblocks/react/suspense";

import { RenameDialog } from "@/components/rename-dialog";
import { RemoveDialog } from "@/components/remove-dialog";
import { Button } from "@/components/ui/button";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/components/ui/menubar";
import { useEditorStore } from "@/store/use-editor-store";
import { DocumentInput } from "./document-input";
import { Avatars } from "./avatars";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Inbox } from "./inbox";
import { Doc } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

interface NavbarProps {
    data: Doc<"documents">;
    activeView?: "document" | "whiteboard" | "todo" | "flowchart" | "spreadsheet";
    setActiveView?: (view: "document" | "whiteboard" | "todo" | "flowchart" | "spreadsheet") => void;
};

export const Navbar = ({ data, activeView, setActiveView }: NavbarProps) => {
    const router = useRouter();
    const { editor } = useEditorStore();
    const mutation = useMutation(api.documents.create);

    const todos = useStorage((root) => root.todos);
    const spreadsheet = useStorage((root) => root.spreadsheet);
    const nodes = useStorage((root) => root.nodes);

    const onNewDocument = () => {
        mutation({
            title: "Untitled document",
            initialContent: ""
        })
            .catch(() => toast.error("Something went wrong"))
            .then((id) => {
                toast.success("Document created")
                router.push(`/documents/${id}`);
            });
    }

    const insertTable = ({ rows, cols }: { rows: number, cols: number }) => {
        editor
            ?.chain()
            .focus()
            .insertTable({ rows, cols, withHeaderRow: false })
            .run()
    };

    const onDownload = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const onSaveJSON = () => {
        if (!editor) return;

        const content = editor.getJSON();
        const blob = new Blob([JSON.stringify(content)], {
            type: "application/json",
        });
        onDownload(blob, `${data.title}.json`)
    };

    const onSaveHTML = () => {
        if (!editor) return;

        const content = editor.getHTML();
        const blob = new Blob([content], {
            type: "text/html",
        });
        onDownload(blob, `${data.title}.html`)
    };

    const onSaveText = () => {
        let content = "";

        if (activeView === "document") {
            if (!editor) {
                toast.error("Editor not ready");
                return;
            }
            content = editor.getText();
        } else if (activeView === "todo") {
            if (!todos) return;
            content = "TO-DO LIST\n==========\n\n";
            todos.forEach((todo) => {
                content += `[${todo.checked ? "x" : " "}] ${todo.text}\n`;
            });
        } else if (activeView === "spreadsheet") {
            if (!spreadsheet) return;
            spreadsheet.forEach((row) => {
                const rowText = row.map((cell) => cell.value).join("\t");
                content += rowText + "\n";
            });
        } else if (activeView === "flowchart") {
            if (!nodes) return;
            content = "FLOWCHART NODES\n===============\n\n";
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            nodes.forEach((node: any) => {
                content += `- ${node.data?.label || "Node"}\n`;
            });
        }

        if (!content) {
            toast.error("No content to save");
            return;
        }

        const blob = new Blob([content], {
            type: "text/plain",
        });
        onDownload(blob, `${data.title}.txt`);
    };

    return (
        <nav className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
                <Link href="/">
                    <Image src="/logo.svg" alt="Logo" width={36} height={36} />
                </Link>
                <div className="flex flex-col">
                    <DocumentInput title={data.title} id={data._id} />
                    <div className="flex">
                        <Menubar className="border-none bg-transparent shadow-none h-auto p-0">
                            <MenubarMenu>
                                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                                    File
                                </MenubarTrigger>
                                <MenubarContent className="print:hidden">
                                    <MenubarSub>
                                        <MenubarSubTrigger>
                                            <FileIcon className="size-4 mr-2" />
                                            Save
                                        </MenubarSubTrigger>
                                        <MenubarSubContent>
                                            <MenubarItem onClick={onSaveJSON}>
                                                <FileJsonIcon className="size-4 mr-2" />
                                                JSON
                                            </MenubarItem>
                                            <MenubarItem onClick={onSaveHTML}>
                                                <GlobeIcon className="size-4 mr-2" />
                                                HTML
                                            </MenubarItem>
                                            <MenubarItem onClick={() => window.print()}>
                                                <BsFilePdf className="size-4 mr-2" />
                                                PDF
                                            </MenubarItem>
                                            <MenubarItem onClick={onSaveText}>
                                                <FileTextIcon className="size-4 mr-2" />
                                                Text
                                            </MenubarItem>
                                        </MenubarSubContent>
                                    </MenubarSub>
                                    <MenubarItem onClick={onNewDocument}>
                                        <FilePlusIcon className="size-4 mr-2" />
                                        New Document
                                    </MenubarItem>
                                    <MenubarSeparator />
                                    <RenameDialog documentId={data._id} initialTitle={data.title}>
                                        <MenubarItem
                                            onClick={(e) => e.stopPropagation()}
                                            onSelect={(e) => e.preventDefault()}
                                        >
                                            <FilePenIcon className="size-4 mr-2" />
                                            Rename
                                        </MenubarItem>
                                    </RenameDialog>
                                    <RemoveDialog documentId={data._id}>
                                        <MenubarItem
                                            onClick={(e) => e.stopPropagation()}
                                            onSelect={(e) => e.preventDefault()}
                                        >
                                            <TrashIcon className="size-4 mr-2" />
                                            Remove
                                        </MenubarItem>
                                    </RemoveDialog>
                                    <MenubarSeparator />
                                    <MenubarItem onClick={() => window.print()}>
                                        <PrinterIcon className="size-4 mr-2" />
                                        Print <MenubarShortcut>CTRL+P</MenubarShortcut>
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                            <MenubarMenu>
                                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                                    Edit
                                </MenubarTrigger>
                                <MenubarContent>
                                    <MenubarItem onClick={() => editor?.chain().focus().undo().run()}>
                                        < Undo2Icon className="size-4 mr-2" />
                                        Undo <MenubarShortcut>CTRL+Z</MenubarShortcut>
                                    </MenubarItem>
                                    <MenubarItem onClick={() => editor?.chain().focus().redo().run()}>
                                        < Redo2Icon className="size-4 mr-2" />
                                        Redo <MenubarShortcut>CTRL+Y</MenubarShortcut>
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>

                            <MenubarMenu>
                                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                                    Insert
                                </MenubarTrigger>
                                <MenubarContent>
                                    <MenubarSub>
                                        <MenubarSubTrigger>Table</MenubarSubTrigger>
                                        <MenubarSubContent>
                                            <MenubarItem onClick={() => insertTable({ rows: 1, cols: 1 })}>
                                                1 x 1
                                            </MenubarItem>
                                            <MenubarItem onClick={() => insertTable({ rows: 2, cols: 2 })}>
                                                2 x 2
                                            </MenubarItem>
                                            <MenubarItem onClick={() => insertTable({ rows: 3, cols: 3 })}>
                                                3 x 3
                                            </MenubarItem>
                                            <MenubarItem onClick={() => insertTable({ rows: 4, cols: 4 })}>
                                                4 x 4
                                            </MenubarItem>
                                            <MenubarItem onClick={() => insertTable({ rows: 5, cols: 5 })}>
                                                5 x 5
                                            </MenubarItem>
                                            <MenubarItem onClick={() => insertTable({ rows: 6, cols: 6 })}>
                                                6 x 6
                                            </MenubarItem>
                                            <MenubarItem onClick={() => insertTable({ rows: 7, cols: 7 })}>
                                                7 x 7
                                            </MenubarItem>
                                            <MenubarItem onClick={() => insertTable({ rows: 8, cols: 8 })}>
                                                8 x 8
                                            </MenubarItem>
                                            <MenubarItem onClick={() => insertTable({ rows: 9, cols: 9 })}>
                                                9 x 9
                                            </MenubarItem>
                                            <MenubarItem onClick={() => insertTable({ rows: 10, cols: 10 })}>
                                                10 x 10
                                            </MenubarItem>
                                            <MenubarItem onClick={() => insertTable({ rows: 11, cols: 11 })}>
                                                11 x 11
                                            </MenubarItem>
                                            <MenubarItem onClick={() => insertTable({ rows: 12, cols: 12 })}>
                                                12 x 12
                                            </MenubarItem>
                                        </MenubarSubContent>
                                    </MenubarSub>
                                </MenubarContent>
                            </MenubarMenu>
                            <MenubarMenu>
                                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                                    Format
                                </MenubarTrigger>
                                <MenubarContent>
                                    <MenubarSub>
                                        <MenubarSubTrigger>
                                            < TextIcon className="size-4 mr-2" />
                                            Text
                                        </MenubarSubTrigger>
                                        <MenubarSubContent>
                                            <MenubarItem onClick={() => editor?.chain().focus().toggleBold().run()}>
                                                < BoldIcon className="size-4 mr-2" />
                                                Bold <MenubarShortcut>ctrl+B</MenubarShortcut>
                                            </MenubarItem>
                                            <MenubarItem onClick={() => editor?.chain().focus().toggleItalic().run()}>
                                                < ItalicIcon className="size-4 mr-2" />
                                                Italic <MenubarShortcut>ctrl+I</MenubarShortcut>
                                            </MenubarItem>
                                            <MenubarItem onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                                                < UnderlineIcon className="size-4 mr-2" />
                                                Underline <MenubarShortcut>ctrl+U</MenubarShortcut>
                                            </MenubarItem>
                                            <MenubarItem onClick={() => editor?.chain().focus().toggleStrike().run()}>
                                                < StrikethroughIcon className="size-4 mr-2" />
                                                <span>Strikethrough&nbsp;&nbsp;</span> <MenubarShortcut>⌘S</MenubarShortcut>
                                            </MenubarItem>
                                            <MenubarItem onClick={() => editor?.chain().focus().toggleHighlight().run()}>
                                                <HighlighterIcon className="size-4 mr-2" />
                                                Highlight <MenubarShortcut>Ctrl+H</MenubarShortcut>
                                            </MenubarItem>
                                            <MenubarItem onClick={() => editor?.chain().focus().toggleCode().run()}>
                                                <CodeIcon className="size-4 mr-2" />
                                                Code <MenubarShortcut>Ctrl+E</MenubarShortcut>
                                            </MenubarItem>

                                        </MenubarSubContent>
                                    </MenubarSub>
                                    <MenubarItem onClick={() => editor?.chain().focus().unsetAllMarks().run()}>
                                        <RemoveFormattingIcon className="size-4 mr-2" />
                                        Clear formatting
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                        </Menubar>
                    </div>
                </div>
            </div>
            <div className="flex gap-3 items-center pl-6">
                <Avatars />
                <Inbox />
                <OrganizationSwitcher
                    afterCreateOrganizationUrl="/"
                    afterLeaveOrganizationUrl="/"
                    afterSelectOrganizationUrl="/"
                    afterSelectPersonalUrl="/"
                />
                {(() => {
                    if (setActiveView) {
                        return (
                            <div className="flex bg-gray-100 p-1 rounded-md gap-1">
                                <Button
                                    variant={activeView === "document" ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setActiveView?.("document")}
                                    className={activeView === "document" ? "bg-white shadow-sm" : ""}
                                >
                                    <FileText className="size-4 mr-2" />
                                    Docs
                                </Button>
                                <Button
                                    variant={activeView === "whiteboard" ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setActiveView?.("whiteboard")}
                                    className={activeView === "whiteboard" ? "bg-white shadow-sm" : ""}
                                >
                                    <Presentation className="size-4 mr-2" />
                                    Board
                                </Button>
                                <Button
                                    variant={activeView === "todo" ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setActiveView?.("todo")}
                                    className={activeView === "todo" ? "bg-white shadow-sm" : ""}
                                >
                                    <CheckSquareIcon className="size-4 mr-2" />
                                    Todo
                                </Button>
                                <Button
                                    variant={activeView === "flowchart" ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setActiveView?.("flowchart")}
                                    className={activeView === "flowchart" ? "bg-white shadow-sm" : ""}
                                >
                                    <NetworkIcon className="size-4 mr-2" />
                                    Flow
                                </Button>
                                <Button
                                    variant={activeView === "spreadsheet" ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setActiveView?.("spreadsheet")}
                                    className={activeView === "spreadsheet" ? "bg-white shadow-sm" : ""}
                                >
                                    <TableIcon className="size-4 mr-2" />
                                    Sheet
                                </Button>
                            </div>
                        );
                    }
                    return <UserButton />;
                })()}
            </div>
        </nav>
    );
};
