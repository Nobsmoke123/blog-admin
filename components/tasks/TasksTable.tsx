"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteTask } from "@/actions/task";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { PAGE_SIZE, paginate, totalPages } from "@/lib/utils";

export interface TaskRow {
  id: string;
  experience_name: string;
  task: string;
  created_at: string;
  updated_at: string;
}

interface TasksTableProps {
  tasks: TaskRow[];
}

export function TasksTable({ tasks }: TasksTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pages = totalPages(tasks.length, PAGE_SIZE);
  const pageTasks = paginate(tasks, currentPage, PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SN</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Task</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Update</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageTasks.map((task, rowIndex) => {
            const sn = startIndex + rowIndex + 1;

            return (
              <TableRow key={task.id}>
                <TableCell>{sn}</TableCell>
                <TableCell>{task.id}</TableCell>
                <TableCell>
                  <span className="line-clamp-2 max-w-xs">
                    {task.experience_name}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="line-clamp-2 max-w-xs">{task.task}</span>
                </TableCell>
                <TableCell>
                  <span className="line-clamp-2 max-w-xs">
                    {new Date(task.created_at).toDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="line-clamp-2 max-w-xs">
                    {new Date(task.updated_at).toDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/tasks/${task.id}`}
                    className="py-2 px-4 rounded-md bg-foreground text-background hover:opacity-90 border border-transparent"
                  >
                    Update
                  </Link>
                </TableCell>
                <TableCell>
                  <form action={deleteTask.bind(null, task.id)}>
                    <Button type="submit" variant="primary">
                      Delete
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {pages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
