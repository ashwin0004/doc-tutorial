"use client";

import Spreadsheet from "react-spreadsheet";
import { useMutation, useStorage, useHistory, useCanUndo, useCanRedo } from "@liveblocks/react/suspense";
import { LiveObject, LiveList, LiveMap } from "@liveblocks/client";
import { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, MoreHorizontal, Trash, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, GripVertical, Undo2, Redo2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnIndicatorProps, RowIndicatorProps, TableProps, RowProps, HeaderRowProps, CornerIndicatorProps, CellComponentProps, DataEditor, DataViewer } from "react-spreadsheet";
import { Ruler, Maximize } from "lucide-react";

type SpreadsheetCell = { value: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSize = (map: any, key: string, def: number) => {
    if (!map) return def;
    if (typeof map.get === 'function') return map.get(key) || def;
    return map[key] || def;
};

// --- Custom Hooks ---

const useSpreadsheetActions = () => {
    const addRow = useMutation(({ storage }) => {
        const spreadsheet = storage.get("spreadsheet");
        if (!spreadsheet || spreadsheet.length === 0) return;

        const firstRow = spreadsheet.get(0);
        const colCount = firstRow ? firstRow.length : 5;

        const newRow = new LiveList(
            Array(colCount).fill(null).map(() => new LiveObject({ value: "" }))
        );
        spreadsheet.push(newRow);
    }, []);

    const addColumn = useMutation(({ storage }) => {
        const spreadsheet = storage.get("spreadsheet");
        if (!spreadsheet) return;

        spreadsheet.forEach((row) => {
            row.push(new LiveObject({ value: "" }));
        });
    }, []);

    const insertRow = useMutation(({ storage }, rowIndex: number) => {
        const spreadsheet = storage.get("spreadsheet");
        if (!spreadsheet || spreadsheet.length === 0) return;

        const firstRow = spreadsheet.get(0);
        const colCount = firstRow ? firstRow.length : 5;

        const newRow = new LiveList(
            Array(colCount).fill(null).map(() => new LiveObject({ value: "" }))
        );
        spreadsheet.insert(newRow, rowIndex);
    }, []);

    const deleteRow = useMutation(({ storage }, rowIndex: number) => {
        const spreadsheet = storage.get("spreadsheet");
        if (!spreadsheet || spreadsheet.length <= 1) return; // Prevent deleting last row
        spreadsheet.delete(rowIndex);
    }, []);

    const moveRow = useMutation(({ storage }, fromIndex: number, toIndex: number) => {
        const spreadsheet = storage.get("spreadsheet");
        if (!spreadsheet) return;
        spreadsheet.move(fromIndex, toIndex);
    }, []);

    const insertColumn = useMutation(({ storage }, colIndex: number) => {
        const spreadsheet = storage.get("spreadsheet");
        if (!spreadsheet) return;

        spreadsheet.forEach((row) => {
            row.insert(new LiveObject({ value: "" }), colIndex);
        });
    }, []);

    const deleteColumn = useMutation(({ storage }, colIndex: number) => {
        const spreadsheet = storage.get("spreadsheet");
        if (!spreadsheet) return;
        // Check if there's at least one column (checking first row)
        const firstRow = spreadsheet.get(0);
        if (firstRow && firstRow.length <= 1) return;

        spreadsheet.forEach((row) => {
            row.delete(colIndex);
        });
    }, []);

    const moveColumn = useMutation(({ storage }, fromIndex: number, toIndex: number) => {
        const spreadsheet = storage.get("spreadsheet");
        if (!spreadsheet) return;

        spreadsheet.forEach((row) => {
            row.move(fromIndex, toIndex);
        });
    }, []);

    const resizeColumn = useMutation(({ storage }, index: number, width: number) => {
        const sizes = storage.get("columnSizes");
        if (sizes) sizes.set(String(index), width);
    }, []);

    const resizeRow = useMutation(({ storage }, index: number, height: number) => {
        const sizes = storage.get("rowSizes");
        if (sizes) sizes.set(String(index), height);
    }, []);

    const setRowHeaderWidth = useMutation(({ storage }, width: number) => {
        storage.set("rowHeaderWidth", width);
    }, []);

    const setColumnHeaderHeight = useMutation(({ storage }, height: number) => {
        storage.set("columnHeaderHeight", height);
    }, []);

    return {
        addRow,
        addColumn,
        insertRow,
        deleteRow,
        moveRow,
        insertColumn,
        deleteColumn,
        moveColumn,
        resizeColumn,
        resizeRow,
        setRowHeaderWidth,
        setColumnHeaderHeight
    };
};

// --- Stable Components ---

const ColumnIndicator = ({ column, onSelect, selected }: ColumnIndicatorProps) => {
    const label = String.fromCharCode(65 + column);
    const columnSizes = useStorage((root) => root.columnSizes);
    const columnHeaderHeight = useStorage((root) => root.columnHeaderHeight) || 32;
    const { resizeColumn, insertColumn, deleteColumn, moveColumn } = useSpreadsheetActions();

    const width = getSize(columnSizes, String(column), 80);

    const handleResize = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const startX = e.clientX;
        const startWidth = width;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const diff = moveEvent.clientX - startX;
            const newWidth = Math.max(40, startWidth + diff);
            resizeColumn(column, newWidth);
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }, [column, width, resizeColumn]);

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData("application/x-spreadsheet-column", String(column));
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const fromIndex = e.dataTransfer.getData("application/x-spreadsheet-column");
        if (fromIndex && fromIndex !== String(column)) {
            moveColumn(Number(fromIndex), column);
        }
    };

    return (
        <div
            style={{ width, height: columnHeaderHeight }}
            className={`flex-none flex justify-between items-center px-1 relative group border-r border-b transition-colors ${selected ? "bg-blue-100 hover:bg-blue-200" : "bg-slate-50 hover:bg-slate-100"}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => onSelect(column, false)}
        >
            <div
                className="flex items-center justify-center cursor-grab active:cursor-grabbing"
                draggable
                onDragStart={handleDragStart}
            >
                <GripVertical className="size-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <span className="text-gray-700 font-medium text-sm flex-1 text-center">
                {label}
            </span>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="px-0.5 opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-slate-200">
                        <MoreHorizontal className="size-3 text-slate-500" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Column {label}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => insertColumn(column)}>
                        <ArrowLeft className="size-4 mr-2" /> Insert Before
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => insertColumn(column + 1)}>
                        <ArrowRight className="size-4 mr-2" /> Insert After
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => moveColumn(column, Math.max(0, column - 1))}>
                        <ArrowLeft className="size-4 mr-2" /> Move Left
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => moveColumn(column, column + 1)}>
                        <ArrowRight className="size-4 mr-2" /> Move Right
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => deleteColumn(column)} className="text-red-600">
                        <Trash className="size-4 mr-2" /> Delete Column
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                        const newWidth = prompt("Enter column width (px):", String(width));
                        if (newWidth && !isNaN(Number(newWidth))) {
                            resizeColumn(column, Number(newWidth));
                        }
                    }}>
                        <Ruler className="size-4 mr-2" /> Set Width
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <div
                className="absolute right-0 top-0 h-full w-2 cursor-col-resize hover:bg-blue-400 z-50 opacity-0 hover:opacity-100 transition-opacity"
                onMouseDown={handleResize}
                draggable={false}
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
};

const RowIndicator = ({ row, onSelect, selected }: RowIndicatorProps) => {
    const label = row + 1;
    const rowSizes = useStorage((root) => root.rowSizes);
    const rowHeaderWidth = useStorage((root) => root.rowHeaderWidth) || 40;
    const { resizeRow, insertRow, deleteRow, moveRow } = useSpreadsheetActions();

    const height = getSize(rowSizes, String(row), 32);

    const handleResize = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const startY = e.clientY;
        const startHeight = height;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const diff = moveEvent.clientY - startY;
            const newHeight = Math.max(20, startHeight + diff);
            resizeRow(row, newHeight);
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }, [row, height, resizeRow]);

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData("application/x-spreadsheet-row", String(row));
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const fromIndex = e.dataTransfer.getData("application/x-spreadsheet-row");
        if (fromIndex && fromIndex !== String(row)) {
            moveRow(Number(fromIndex), row);
        }
    };

    return (
        <div
            style={{ height, width: rowHeaderWidth }}
            className={`flex-none flex items-center justify-between px-1 relative group border-b border-r transition-colors ${selected ? "bg-blue-100 hover:bg-blue-200" : "bg-slate-50 hover:bg-slate-100"}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => onSelect(row, false)}
        >
            {/* Grip Icon */}
            <div
                className="cursor-grab active:cursor-grabbing"
                draggable
                onDragStart={handleDragStart}
            >
                <GripVertical className="size-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <span className="text-gray-700 font-medium text-xs flex-1 text-center">
                {label}
            </span>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="px-0.5 opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-slate-200">
                        <MoreHorizontal className="size-3 text-slate-500" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Row {label}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => insertRow(row)}>
                        <ArrowUp className="size-4 mr-2" /> Insert Above
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => insertRow(row + 1)}>
                        <ArrowDown className="size-4 mr-2" /> Insert Below
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => moveRow(row, Math.max(0, row - 1))}>
                        <ArrowUp className="size-4 mr-2" /> Move Up
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => moveRow(row, row + 1)}>
                        <ArrowDown className="size-4 mr-2" /> Move Down
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => deleteRow(row)} className="text-red-600">
                        <Trash className="size-4 mr-2" /> Delete Row
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                        const newHeight = prompt("Enter row height (px):", String(height));
                        if (newHeight && !isNaN(Number(newHeight))) {
                            resizeRow(row, Number(newHeight));
                        }
                    }}>
                        <Maximize className="size-4 mr-2 rotate-90" /> Set Height
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <div
                className="absolute left-0 bottom-0 w-full h-2 cursor-row-resize hover:bg-blue-400 z-50 opacity-0 hover:opacity-100 transition-opacity"
                onMouseDown={handleResize}
                draggable={false}
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
};

const CustomCell = ({ row, column, mode, data, activate, setCellData, selected, active }: CellComponentProps<SpreadsheetCell>) => {
    const columnSizes = useStorage((root) => root.columnSizes);
    const rowSizes = useStorage((root) => root.rowSizes);

    // Optimize: We should arguably only subscribe to *this* column's size, but useStorage granularity is limited without selectors
    // For now we accept this.
    const width = getSize(columnSizes, String(column), 80);
    const height = getSize(rowSizes, String(row), 32);

    return (
        <div
            style={{ width, height }}
            className={`border-r border-b relative flex-none transition-colors ${selected ? "bg-blue-100" : ""} ${active ? "ring-2 ring-blue-500 z-10" : ""}`}
            onClick={() => activate({ row, column })}
        >
            {mode === "edit" ? (
                <div className="w-full h-full flex items-center">
                    <DataEditor
                        row={row}
                        column={column}
                        cell={data}
                        onChange={setCellData}
                        exitEditMode={() => activate({ row, column })}
                    />
                </div>
            ) : (
                <div className="w-full h-full flex items-center px-1 overflow-hidden text-sm">
                    <DataViewer
                        row={row}
                        column={column}
                        cell={data}
                        setCellData={setCellData}
                        evaluatedCell={data}
                    />
                </div>
            )}
        </div>
    );
};

const CornerIndicator = ({ onSelect }: CornerIndicatorProps) => {
    const rowHeaderWidth = useStorage((root) => root.rowHeaderWidth) || 40;
    const columnHeaderHeight = useStorage((root) => root.columnHeaderHeight) || 32;
    const { setRowHeaderWidth, setColumnHeaderHeight } = useSpreadsheetActions();

    const handleResizeWidth = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const startX = e.clientX;
        const startWidth = rowHeaderWidth;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const diff = moveEvent.clientX - startX;
            setRowHeaderWidth(Math.max(20, startWidth + diff));
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }, [rowHeaderWidth, setRowHeaderWidth]);

    const handleResizeHeight = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const startY = e.clientY;
        const startHeight = columnHeaderHeight;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const diff = moveEvent.clientY - startY;
            setColumnHeaderHeight(Math.max(20, startHeight + diff));
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }, [columnHeaderHeight, setColumnHeaderHeight]);

    return (
        <div
            style={{ width: rowHeaderWidth, height: columnHeaderHeight }}
            className="bg-slate-50 border-r border-b z-20 relative"
            onClick={onSelect}
        >
            <div
                className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-400"
                onMouseDown={handleResizeWidth}
            />
            <div
                className="absolute left-0 bottom-0 w-full h-1 cursor-row-resize hover:bg-blue-400"
                onMouseDown={handleResizeHeight}
            />
        </div>
    );
};

const Table = ({ children }: TableProps) => (
    <div className="flex flex-col">
        {children}
    </div>
);

const Row = ({ children }: RowProps) => (
    <div className="flex">
        {children}
    </div>
);

const HeaderRow = ({ children }: HeaderRowProps) => (
    <div className="flex">
        {children}
    </div>
);


export const SpreadsheetComponent = () => {
    const storageData = useStorage((root) => root.spreadsheet);
    const { addRow, addColumn } = useSpreadsheetActions();

    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();

    const initStorage = useMutation(({ storage }) => {
        if (!storage.get("spreadsheet")) {
            const initialData = new LiveList(
                Array(5).fill(null).map(() =>
                    new LiveList(Array(5).fill(null).map(() => new LiveObject({ value: "" })))
                )
            );
            storage.set("spreadsheet", initialData);
        }
        if (!storage.get("columnSizes")) {
            storage.set("columnSizes", new LiveMap());
        }
        if (!storage.get("rowSizes")) {
            storage.set("rowSizes", new LiveMap());
        }
        if (storage.get("rowHeaderWidth") === undefined) {
            storage.set("rowHeaderWidth", 40);
        }
        if (storage.get("columnHeaderHeight") === undefined) {
            storage.set("columnHeaderHeight", 32);
        }
    }, []);

    useEffect(() => {
        if (storageData === undefined) {
            initStorage();
        }
    }, [storageData, initStorage]);

    const data = storageData ? storageData.map((row) => row.map((cell) => ({ value: cell.value }))) : [];

    const onChange = useMutation(({ storage }, newData) => {
        const liveRows = storage.get("spreadsheet");
        if (!liveRows) return;

        newData.forEach((row: SpreadsheetCell[], rowIndex: number) => {
            let liveRow = liveRows.get(rowIndex);
            if (!liveRow) {
                liveRow = new LiveList(row.map(cell => new LiveObject({ value: cell?.value || "" })));
                liveRows.push(liveRow);
            }

            row.forEach((cell, colIndex) => {
                let liveCell = liveRow.get(colIndex);
                if (!liveCell) {
                    liveCell = new LiveObject({ value: cell?.value || "" });
                    liveRow.push(liveCell);
                } else {
                    if (liveCell.get("value") !== (cell?.value || "")) {
                        liveCell.set("value", cell?.value || "");
                    }
                }
            });
        });
    }, []);

    if (!storageData) {
        return <div className="flex items-center justify-center h-full">Loading Spreadsheet...</div>;
    }

    return (
        <div className="w-full h-full flex flex-col bg-white">
            <div className="flex items-center gap-2 p-2 border-b bg-gray-50">
                <Button onClick={addRow} size="sm" variant="outline">
                    <PlusIcon className="size-4 mr-2" />
                    Add Row
                </Button>
                <Button onClick={addColumn} size="sm" variant="outline">
                    <PlusIcon className="size-4 mr-2" />
                    Add Column
                </Button>
                <div className="w-[1px] h-6 bg-gray-300 mx-1" />
                <Button
                    onClick={() => history.undo()}
                    disabled={!canUndo}
                    size="sm"
                    variant="outline"
                    title="Undo"
                >
                    <Undo2 className="size-4 mr-2" />
                    Undo
                </Button>
                <Button
                    onClick={() => history.redo()}
                    disabled={!canRedo}
                    size="sm"
                    variant="outline"
                    title="Redo"
                >
                    <Redo2 className="size-4 mr-2" />
                    Redo
                </Button>
            </div>
            <div className="flex-1 overflow-auto p-4">
                <Spreadsheet
                    data={data}
                    onChange={onChange}
                    ColumnIndicator={ColumnIndicator}
                    RowIndicator={RowIndicator}
                    CornerIndicator={CornerIndicator}
                    Table={Table}
                    Row={Row}
                    HeaderRow={HeaderRow}
                    Cell={CustomCell}
                />
            </div>
        </div>
    );
};
