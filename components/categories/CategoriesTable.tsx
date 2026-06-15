"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteCategory } from "@/actions/category";
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

export interface CategoryRow {
  id: string;
  name: string;
}

interface CategoriesTableProps {
  categories: CategoryRow[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pages = totalPages(categories.length, PAGE_SIZE);
  const pageCategories = paginate(categories, currentPage, PAGE_SIZE);
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
          {pageCategories.map((category, rowIndex) => {
            const sn = startIndex + rowIndex + 1;

            return (
              <TableRow key={category.id}>
                <TableCell>{sn}</TableCell>
                {/* <TableCell>{category.id}</TableCell> */}
                <TableCell>
                  <Link
                    href={`/categories/${category.id}`}
                    className="hover:underline"
                  >
                    {category.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/categories/${category.id}`}
                    className="py-2 px-4 rounded-md bg-foreground text-background hover:opacity-90 border border-transparent"
                  >
                    Update
                  </Link>
                </TableCell>
                <TableCell>
                  <form action={deleteCategory.bind(null, category.id)}>
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
