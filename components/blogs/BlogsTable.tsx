"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteBlog } from "@/actions/blog";
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

export interface BlogRow {
  id: string;
  title: string;
  summary: string;
  tag_names: string;
  read_time: number;
  created_at: string;
  updated_at: string;
  category_name: string;
}

interface BlogsTableProps {
  blogs: BlogRow[];
}

export function BlogsTable({ blogs }: BlogsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pages = totalPages(blogs.length, PAGE_SIZE);
  const pageBlogs = paginate(blogs, currentPage, PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SN</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Read time</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Update</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageBlogs.map((blog, rowIndex) => {
            const sn = startIndex + rowIndex + 1;

            return (
              <TableRow key={blog.id}>
                <TableCell>{sn}</TableCell>
                <TableCell>
                  <Link href={`/blogs/${blog.id}`} className="hover:underline">
                    {blog.title}
                  </Link>
                </TableCell>

                <TableCell>{blog.category_name}</TableCell>
                {/* <TableCell>
                  <span className="line-clamp-2 max-w-xs">{blog.summary}</span>
                </TableCell> */}
                {/* <TableCell>
                  <span className="line-clamp-2 max-w-xs">{blog.tag_names}</span>
                </TableCell> */}
                <TableCell>{blog.read_time} min</TableCell>
                <TableCell>
                  {new Date(blog.created_at).toDateString()}
                </TableCell>
                <TableCell>
                  {new Date(blog.updated_at).toDateString()}
                </TableCell>

                <TableCell>
                  <Link
                    href={`/blogs/${blog.id}`}
                    className="py-2 px-4 rounded-md bg-foreground text-background hover:opacity-90 border border-transparent"
                  >
                    Update
                  </Link>
                </TableCell>
                <TableCell>
                  <form action={deleteBlog.bind(null, blog.id)}>
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
