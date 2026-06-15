"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteProject } from "@/actions/projects";
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

export interface ProjectRow {
  id: string;
  name: string;
  year: string;
  live_url: string;
  source_code: string;
}

interface ProjectsTableProps {
  projects: ProjectRow[];
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pages = totalPages(projects.length, PAGE_SIZE);
  const pageProjects = paginate(projects, currentPage, PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SN</TableHead>
            <TableHead>Project title</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Live URL</TableHead>
            <TableHead>Source code</TableHead>
            <TableHead>Update</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageProjects.map((project, rowIndex) => {
            const sn = startIndex + rowIndex + 1;

            return (
              <TableRow key={project.id}>
                <TableCell>{sn}</TableCell>
                <TableCell>
                  <Link
                    href={`/projects/${project.id}`}
                    className="hover:underline"
                  >
                    {project.name}
                  </Link>
                </TableCell>
                <TableCell>{project.year}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {project.live_url ? (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground underline-offset-4 hover:underline"
                    >
                      {project.live_url}
                    </a>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {project.source_code ? (
                    <a
                      href={project.source_code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground underline-offset-4 hover:underline"
                    >
                      {project.source_code}
                    </a>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/projects/${project.id}`}
                    className="py-2 px-4 rounded-md bg-foreground text-background hover:opacity-90 border border-transparent"
                  >
                    Update
                  </Link>
                </TableCell>
                <TableCell>
                  <form action={deleteProject.bind(null, project.id)}>
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
