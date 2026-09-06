import {
  columnVisibilityFeature,
  createColumnHelper,
  createPaginatedRowModel,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { PencilIcon, Trash2Icon } from "lucide-react";
import * as React from "react";
import { useState } from "react";

import { Button } from "#/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog.tsx";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "#/components/ui/pagination.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table.tsx";
import { toast } from "#/components/ui/toast.tsx";

import type { Knowledge } from "../../../schemas.ts";
import { useDeleteKnowledge } from "../../hooks.ts";

const features = tableFeatures({
  rowPaginationFeature,
  columnVisibilityFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

type KnowledgeFeatures = typeof features;

const columnHelper = createColumnHelper<KnowledgeFeatures, Knowledge>();

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

type PaginationItemValue = number | "ellipsis-start" | "ellipsis-end";

function getPaginationItems(pageIndex: number, pageCount: number): PaginationItemValue[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index);
  }
  const start = Math.max(1, pageIndex - 2);
  const end = Math.min(pageCount - 2, pageIndex + 2);
  const items: PaginationItemValue[] = [0];
  if (start > 1) items.push("ellipsis-start");
  for (let index = start; index <= end; index++) items.push(index);
  if (end < pageCount - 2) items.push("ellipsis-end");
  items.push(pageCount - 1);
  return items;
}

export function KnowledgeTable({
  data,
  onEdit,
}: {
  data: Knowledge[];
  onEdit: (knowledge: Knowledge) => void;
}) {
  const deleteKnowledge = useDeleteKnowledge();
  const [knowledgeToDelete, setKnowledgeToDelete] = useState<Knowledge | null>(null);
  const isPending = deleteKnowledge.isPending;

  const columns = React.useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor("title", {
          header: "Title",
          cell: ({ row }) => (
            <div className="flex min-w-48 flex-col">
              <span className="line-clamp-1 font-medium">{row.original.title}</span>
              {row.original.subtitle ? (
                <span className="line-clamp-1 text-muted-foreground">{row.original.subtitle}</span>
              ) : null}
            </div>
          ),
        }),
        columnHelper.accessor("tags", {
          header: "Tags",
          cell: ({ row }) => (
            <span className="line-clamp-1 max-w-44">{row.original.tags || "—"}</span>
          ),
        }),
        columnHelper.accessor("updatedAt", {
          header: "Updated",
          cell: ({ row }) => dateFormatter.format(new Date(row.original.updatedAt)),
        }),
        columnHelper.display({
          id: "actions",
          header: "Actions",
          cell: ({ row }) => {
            const knowledge = row.original;
            return (
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Edit ${knowledge.title}`}
                  onClick={() => onEdit(knowledge)}
                >
                  <PencilIcon />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Delete ${knowledge.title}`}
                  className="text-destructive hover:text-destructive"
                  onClick={() => setKnowledgeToDelete(knowledge)}
                >
                  <Trash2Icon />
                </Button>
              </div>
            );
          },
        }),
      ]),
    [onEdit],
  );

  const table = useTable({
    features,
    data,
    columns,
  });

  const pageIndex = table.state.pagination.pageIndex;
  const paginationItems =
    table.getPageCount() > 1 ? getPaginationItems(pageIndex, table.getPageCount()) : [];

  const handleConfirmDelete = async () => {
    if (!knowledgeToDelete) return;
    try {
      await deleteKnowledge.mutateAsync(knowledgeToDelete);
      toast.add({
        title: "Knowledge path deleted",
        description: knowledgeToDelete.title,
        type: "success",
      });
      setKnowledgeToDelete(null);
    } catch (error) {
      toast.add({
        title: "Delete failed",
        description:
          error instanceof Error ? error.message : "An error occurred. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-none border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No knowledge paths yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {paginationItems.length > 0 ? (
        <Pagination className="py-2">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={(event) => {
                  event.preventDefault();
                  table.previousPage();
                }}
                aria-disabled={!table.getCanPreviousPage()}
                className={
                  table.getCanPreviousPage() ? undefined : "pointer-events-none opacity-50"
                }
              />
            </PaginationItem>
            {paginationItems.map((item) =>
              item === "ellipsis-start" || item === "ellipsis-end" ? (
                <PaginationItem key={item}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationLink
                    href="#"
                    isActive={item === pageIndex}
                    onClick={(event) => {
                      event.preventDefault();
                      table.setPageIndex(item);
                    }}
                  >
                    {item + 1}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationNext
                onClick={(event) => {
                  event.preventDefault();
                  table.nextPage();
                }}
                aria-disabled={!table.getCanNextPage()}
                className={table.getCanNextPage() ? undefined : "pointer-events-none opacity-50"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}

      <Dialog
        open={!!knowledgeToDelete}
        onOpenChange={(open) => !open && setKnowledgeToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete knowledge path</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{knowledgeToDelete?.title}&rdquo;? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => setKnowledgeToDelete(null)}
            >
              Cancel
            </Button>
            <Button variant="destructive" disabled={isPending} onClick={handleConfirmDelete}>
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
