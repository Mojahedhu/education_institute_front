import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { getInitials } from "@/lib/utils";
import { User } from "@/types";
import { useTable } from "@refinedev/react-table";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

const FacultyList = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") ?? "",
  );

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400); // 400ms delay
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const facultyColumns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        size: 220,
        header: () => <p className="column-title">Name</p>,
        cell: ({ row, getValue }) => {
          const name = getValue<string>();
          const image = row.original.image;
          return (
            <div className="flex items-center gap-3">
              <Avatar>
                {image && <AvatarImage src={image} alt={name} />}
                <AvatarFallback>{getInitials(name)}</AvatarFallback>
              </Avatar>
              <span className="text-foreground">{name}</span>
            </div>
          );
        },
      },
      {
        id: "email",
        accessorKey: "email",
        size: 240,
        header: () => <p className="column-title">Email</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<string>()}</span>
        ),
      },
      {
        id: "role",
        accessorKey: "role",
        size: 120,
        header: () => <p className="column-title">Role</p>,
        cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
      },
      {
        id: "details",
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => (
          <ShowButton
            resource="users"
            recordItemId={row.original.id}
            variant="outline"
            size="sm"
          >
            View
          </ShowButton>
        ),
      },
    ],
    [],
  );

  const facultyTable = useTable<User>({
    columns: facultyColumns,

    refineCoreProps: {
      resource: "users",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        mode: "server",

        permanent: [
          {
            field: "role",
            operator: "eq" as const,
            value: "teacher",
          },
        ],
      },
      //   sorters: {
      //     initial: [
      //       {
      //         field: "id",
      //         order: "desc",
      //       },
      //     ],
      //   },
    },
  });

  const { setFilters, setCurrentPage } = facultyTable.refineCore;

  useEffect(() => {
    setFilters(
      debouncedSearchQuery
        ? [
            {
              field: "search",
              operator: "contains",
              value: debouncedSearchQuery,
            },
          ]
        : [],
      "replace",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery]);

  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery]);

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Faculty</h1>

      <div className="intro-row">
        <p>Browse and manage faculty members.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </div>
      </div>

      <DataTable table={facultyTable} />
    </ListView>
  );
};

export default FacultyList;
