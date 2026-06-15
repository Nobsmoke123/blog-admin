"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteTechnology } from "@/actions/technology";
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

export interface TechnologyRow {
  id: string;
  name: string;
}

interface TechnologiesTableProps {
  technologies: TechnologyRow[];
}

export function TechnologiesTable({ technologies }: TechnologiesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pages = totalPages(technologies.length, PAGE_SIZE);
  const pageTechnologies = paginate(technologies, currentPage, PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SN</TableHead>
            {/* <TableHead>ID</TableHead> */}
            <TableHead>Name</TableHead>
            <TableHead>Update</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageTechnologies.map((technology, rowIndex) => {
            const sn = startIndex + rowIndex + 1;

            return (
              <TableRow key={technology.id}>
                <TableCell>{sn}</TableCell>
                {/* <TableCell>{technology.id}</TableCell> */}
                <TableCell>
                  <Link
                    href={`/technologies/${technology.id}`}
                    className="hover:underline"
                  >
                    {technology.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/technologies/${technology.id}`}
                    className="py-2 px-4 rounded-md bg-foreground text-background hover:opacity-90 border border-transparent"
                  >
                    Update
                  </Link>
                </TableCell>
                <TableCell>
                  <form action={deleteTechnology.bind(null, technology.id)}>
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
