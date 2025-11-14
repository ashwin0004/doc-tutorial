"use client";
import { BoldIcon, 
    ItalicIcon, 
    UnderlineIcon, 
    LucideIcon, 
    PrinterIcon, 
    Redo2Icon, 
    SpellCheckIcon, 
    Undo2Icon, 
    MessageSquarePlusIcon,  
    ListTodoIcon, 
    RemoveFormattingIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from '@/store/use-editor-store';
import { Separator } from "@/components/ui/separator";
import { ChevronDownIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const FontFamilyButton = () => {
    const { editor } = useEditorStore();

    const fonts = [
        { label: "Arial", value: "Arial"},
        { label: "Georgia", value: "Georgia"},
        { label: "Impact", value: "Impact"},
        { label: "Tahoma", value: "Tahoma"},
        { label: "Times New Roman", value: "Times New Roman"},
        { label: "Verdana", value: "Verdana"},
        { label: "Courier New", value: "Courier New"},
    ];
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                className=
                "h-7 w-[120px] shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm"
                >
                    <span className="truncate">
                        {editor?.getAttributes("textStyle").fontFamily || "Arial"}
                        </span>
                        <ChevronDownIcon className="ml-2 size-4 shrink-0 "/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
                {fonts.map(({ label, value }) => (
                    <button
                    key={value}
                    className={cn(
                        "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
                        editor?.getAttributes("textStyle").fontFamily === value && "bg-neutral-200/80"
                    )}
                    style={{fontFamily: value }}
                    >

                    </button>
                ))}

                </DropdownMenuContent>
        </DropdownMenu>
    )

}
interface ToolbarButtonProps {
    onClick?: () => void;
    isActive?: boolean;
    icon: LucideIcon;
};

const ToolbarButton = ({
     onClick, 
     isActive, 
     icon: Icon 
    }: ToolbarButtonProps) => {
        return (
            <button
            onClick={onClick}
            className={cn(
                "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
                isActive && "bg-neutral-200/80"
            )}
            >
                <Icon className="size-4"/>
            </button>
        )
    }

export const Toolbar = () => {
    const { editor } = useEditorStore();

    const sections: {
        label: string;
        icon: LucideIcon;
        onClick: () => void;
        isActive?: boolean;
    }[] [] = [
        [
            {
                label: "Undo",
                icon: Undo2Icon,
                onClick: () =>  editor?.chain().focus().undo().run(),
            },
            {
                label: "Redo",
                icon: Redo2Icon,
                onClick: () =>  editor?.chain().focus().redo().run(),
            },
            {
                label: "Print",
                icon: PrinterIcon,
                onClick: () =>  window.print(),
            },
            {
                label: "Spell Check",
                icon: SpellCheckIcon,
                onClick: () =>  {
                    const current = editor?.view.dom.getAttribute("spellcheck");
                    editor?.view.dom.setAttribute("spellcheck", current ===  "false" ? "true" : "false");
                },

            }
        ],
        [
            {
                label: "Bold",
                icon: BoldIcon,
                isActive: editor?.isActive("bold"),
                onClick: () => editor?.chain().focus().toggleBold().run(),
            },
            {
                label: "Italic",
                icon: ItalicIcon,
                isActive: editor?.isActive("Italic"),
                onClick: () => editor?.chain().focus().toggleItalic().run(),
            },
            {
                label: "Underline",
                icon: UnderlineIcon,
                isActive: editor?.isActive("Underline"),
                onClick: () => editor?.chain().focus().toggleUnderline().run(),
            },
        ],
        [
            {
                label: "Comment",
                icon: MessageSquarePlusIcon,
                onClick: () =>  console.log("TODO: Comment"),
                isActive: false, //TODO: Enable this functionality 
            },
            {
                label: "List Todo",
                icon: ListTodoIcon,
                onClick: () =>  editor?.chain().focus().toggleTaskList().run(),
                isActive: editor?.isActive("taskList"),
            },
            {
                label: "Remove Formatting",
                icon: RemoveFormattingIcon,
                onClick: () =>  editor?.chain().focus().unsetAllMarks().run(),
            },
        ]
    ];

    return (
        <div className="bg-[#F1F4F9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5  overflow-x-auto">
            {sections[0].map((item) => (
                <ToolbarButton
                    key={item.label}
                    {...item} />
                ))}
               <Separator orientation="vertical" className="h-6 bg-neutral-300" />
               {/* TODO:Font Family */}
               <Separator orientation="vertical" className="h-6 bg-neutral-300" />
               {/* TODO: Heading */}
               <Separator orientation="vertical" className="h-6 bg-neutral-300" />
               {/* TODO: Font size */}
               <Separator orientation="vertical" className="h-6 bg-neutral-300" />
                {sections[1].map((item) => (
                <ToolbarButton
                    key={item.label}
                    {...item} />
                ))}
                {/* TODO: Text color*/}
                {/* TODO: Highlight color*/}
                <Separator orientation="vertical" className="h-6 bg-neutral-300" />
                {/* TODO: LInk */}
                {/* TODO: Image*/}
                {/* TODO: align */}
                {/* TODO: Line Height*/}
                {/* TODO: List */}
                {sections[2].map((item) => (
                <ToolbarButton
                    key={item.label}
                    {...item} />
                ))}
        </div>
    );
};