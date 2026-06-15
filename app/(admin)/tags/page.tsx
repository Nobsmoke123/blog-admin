import { deleteTag, listTags } from "@/actions/tag";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import Link from "next/link";

export default async function TagsPage() {
  const tags = await listTags();

  const tableData = tags.map((tag, index) => ({
    sn: index + 1,
    id: tag.id,
    name: (
      <Link href={`/tags/${tag.id}`} className="hover:underline">
        {tag.name}
      </Link>
    ),
    update: (
      <Link
        href={`/tags/${tag.id}`}
        className="py-2 px-4 rounded-md bg-foreground text-background hover:opacity-90 border border-transparent"
      >
        Update
      </Link>
    ),
    delete: (
      <form action={deleteTag.bind(null, tag.id)}>
        <Button type="submit" variant="primary">
          Delete
        </Button>
      </form>
    ),
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <PageHeader title="Tags" subtitle="Manage blog tags" />
        <Link
          href="/tags/create"
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-md font-medium bg-foreground text-background hover:opacity-90 border border-transparent shrink-0"
        >
          Create Tag
        </Link>
      </div>
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">SN</TableHead>
              <TableHead className="">ID</TableHead>
              <TableHead className="">Name</TableHead>
              <TableHead className="">Update</TableHead>
              <TableHead className="">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((data, rowIndex) => {
              const sn = rowIndex + 1;

              return (
                <TableRow key={sn}>
                  {Object.values(data).map((value, index) => {
                    return (
                      <TableCell key={index} className={""}>
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
