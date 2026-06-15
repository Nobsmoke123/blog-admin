import { deleteExperience, listExperiences } from "@/actions/experience";
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

export default async function ExperiencesPage() {
  const experiences = await listExperiences();

  const tableData = experiences.map((experience, index) => ({
    sn: index + 1,
    id: experience.id,
    company: (
      <Link href={`/experiences/${experience.id}`} className="hover:underline">
        {experience.company}
      </Link>
    ),
    role: experience.role,
    duration: experience.duration,
    created_at: (
      <span className="line-clamp-2 max-w-xs">
        {new Date(experience.created_at).toDateString()}
      </span>
    ),
    updated_at: (
      <span className="line-clamp-2 max-w-xs">
        {new Date(experience.updated_at).toDateString()}
      </span>
    ),
    update: (
      <Link
        href={`/experiences/${experience.id}`}
        className="py-2 px-4 rounded-md bg-foreground text-background hover:opacity-90 border border-transparent"
      >
        Update
      </Link>
    ),
    delete: (
      <form action={deleteExperience.bind(null, experience.id)}>
        <Button type="submit" variant="primary">
          Delete
        </Button>
      </form>
    ),
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <PageHeader title="Experiences" subtitle="Manage work experiences" />
        <Link
          href="/experiences/create"
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-md font-medium bg-foreground text-background hover:opacity-90 border border-transparent shrink-0"
        >
          Create Experience
        </Link>
      </div>
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">SN</TableHead>
              <TableHead className="">ID</TableHead>
              <TableHead className="">Company</TableHead>
              <TableHead className="">Role</TableHead>
              <TableHead className="">Duration</TableHead>
              <TableHead className="">Created</TableHead>
              <TableHead className="">Updated</TableHead>
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
