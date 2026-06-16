"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteConfig } from "@/actions/config";
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

export interface ConfigRow {
  id: string;
  key: string;
  value: string;
}

interface ConfigsTableProps {
  configs: ConfigRow[];
}

export function ConfigsTable({ configs }: ConfigsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pages = totalPages(configs.length, PAGE_SIZE);
  const pageConfigs = paginate(configs, currentPage, PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SN</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Update</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageConfigs.map((config, rowIndex) => {
            const sn = startIndex + rowIndex + 1;

            return (
              <TableRow key={config.id}>
                <TableCell>{sn}</TableCell>
                <TableCell>
                  <Link
                    href={`/configs/${config.id}`}
                    className="hover:underline"
                  >
                    {config.key}
                  </Link>
                </TableCell>
                <TableCell className="max-w-xs truncate">{config.value}</TableCell>
                <TableCell>
                  <Link
                    href={`/configs/${config.id}`}
                    className="py-2 px-4 rounded-md bg-foreground text-background hover:opacity-90 border border-transparent"
                  >
                    Update
                  </Link>
                </TableCell>
                <TableCell>
                  <form action={deleteConfig.bind(null, config.id)}>
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
