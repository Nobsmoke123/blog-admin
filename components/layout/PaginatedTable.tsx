"use client";

import Link from "next/link";
import { useState } from "react";
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

export interface Column<T> {
  header: string;
  cell: (item: T, index: number) => React.ReactNode;
  className?: string;
}

interface PaginatedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowHref?: (item: T) => string;
  pageSize?: number;
}

export function PaginatedTable<T>({
  data,
  columns,
  getRowHref,
  pageSize = PAGE_SIZE,
}: PaginatedTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const pages = totalPages(data.length, pageSize);
  const pageData = paginate(data, currentPage, pageSize);
  const startIndex = (currentPage - 1) * pageSize;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.header} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageData.map((item, rowIndex) => {
            const sn = startIndex + rowIndex + 1;
            const href = getRowHref?.(item);

            return (
              <TableRow key={sn}>
                {columns.map((column, colIndex) => {
                  const content =
                    colIndex === 0 && column.header === "SN"
                      ? sn
                      : column.cell(item, sn);

                  return (
                    <TableCell key={column.header} className={column.className}>
                      {href && column.header.toLowerCase() === "id" ? (
                        <Link
                          href={href}
                          className="text-foreground underline-offset-4 hover:underline"
                        >
                          {content}
                        </Link>
                      ) : (
                        content
                      )}
                    </TableCell>
                  );
                })}
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
