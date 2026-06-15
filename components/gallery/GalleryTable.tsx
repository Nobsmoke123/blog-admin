"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteGallery } from "@/actions/gallery";
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

export interface GalleryRow {
  id: string;
  project_name: string;
  image: string;
}

interface GalleryTableProps {
  items: GalleryRow[];
}

export function GalleryTable({ items }: GalleryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pages = totalPages(items.length, PAGE_SIZE);
  const pageItems = paginate(items, currentPage, PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SN</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Update</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageItems.map((item, rowIndex) => {
            const sn = startIndex + rowIndex + 1;

            return (
              <TableRow key={item.id}>
                <TableCell>{sn}</TableCell>
                <TableCell>
                  <Link
                    href={`/gallery/${item.id}`}
                    className="hover:underline"
                  >
                    {item.project_name}
                  </Link>
                </TableCell>
                <TableCell>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.project_name}
                    className="h-10 w-14 rounded object-cover"
                  />
                </TableCell>
                <TableCell>
                  <Link
                    href={`/gallery/${item.id}`}
                    className="py-2 px-4 rounded-md bg-foreground text-background hover:opacity-90 border border-transparent"
                  >
                    Update
                  </Link>
                </TableCell>
                <TableCell>
                  <form action={deleteGallery.bind(null, item.id)}>
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
