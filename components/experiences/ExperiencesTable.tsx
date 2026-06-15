"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteExperience } from "@/actions/experience";
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

export interface ExperienceRow {
  id: string;
  company: string;
  role: string;
  duration: string;
  created_at: string;
  updated_at: string;
}

interface ExperiencesTableProps {
  experiences: ExperienceRow[];
}

export function ExperiencesTable({ experiences }: ExperiencesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pages = totalPages(experiences.length, PAGE_SIZE);
  const pageExperiences = paginate(experiences, currentPage, PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SN</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Update</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageExperiences.map((experience, rowIndex) => {
            const sn = startIndex + rowIndex + 1;

            return (
              <TableRow key={experience.id}>
                <TableCell>{sn}</TableCell>
                <TableCell>{experience.id}</TableCell>
                <TableCell>
                  <Link
                    href={`/experiences/${experience.id}`}
                    className="hover:underline"
                  >
                    {experience.company}
                  </Link>
                </TableCell>
                <TableCell>{experience.role}</TableCell>
                <TableCell>{experience.duration}</TableCell>
                <TableCell>
                  <span className="line-clamp-2 max-w-xs">
                    {new Date(experience.created_at).toDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="line-clamp-2 max-w-xs">
                    {new Date(experience.updated_at).toDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/experiences/${experience.id}`}
                    className="py-2 px-4 rounded-md bg-foreground text-background hover:opacity-90 border border-transparent"
                  >
                    Update
                  </Link>
                </TableCell>
                <TableCell>
                  <form action={deleteExperience.bind(null, experience.id)}>
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
