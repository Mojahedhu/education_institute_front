import { CreateButton } from "@/components/refine-ui/buttons/create";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import SearchableSelect from "@/components/searchable-select";
import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";

import { Department, Subject } from "@/types";
import { useSelect } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";

import { Search } from "lucide-react";
import { SetStateAction, useMemo, useState } from "react";

const SubjectsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const subjectColumns = useMemo<ColumnDef<Subject>[]>(
    () => [
      {
        id: "code",
        accessorKey: "code",
        size: 100,
        header: () => <p className="column-title ml-2">Code</p>,
        cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
      },
      {
        id: "name",
        accessorKey: "name",
        size: 200,
        header: () => <p className="column-title">Name</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<string>()}</span>
        ),
        filterFn: "includesString",
      },
      {
        id: "department",
        accessorKey: "department.name",
        size: 150,
        header: () => <p className="column-title">Department</p>,
        cell: ({ getValue }) => (
          <Badge variant="secondary">{getValue<string>()}</Badge>
        ),
      },
      {
        id: "description",
        accessorKey: "description",
        size: 300,
        header: () => <p className="column-title">Description</p>,
        cell: ({ getValue }) => (
          <span className="truncate line-clamp-2">{getValue<string>()}</span>
        ),
      },
      {
        id: "details",
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => (
          <ShowButton
            resource="subjects"
            recordItemId={row.original.id}
            variant={"outline"}
            size={"sm"}
          >
            View
          </ShowButton>
        ),
      },
    ],
    [],
  );

  const departmentFilters =
    selectedDepartment === "all"
      ? []
      : [
          {
            field: "department",
            operator: "eq" as const,
            value: selectedDepartment,
          },
        ];

  const searchFilter = searchQuery
    ? [
        {
          field: "name",
          operator: "contains" as const,
          value: searchQuery,
        },
      ]
    : [];

  const subjectTable = useTable<Subject>({
    columns: subjectColumns,
    refineCoreProps: {
      resource: "subjects",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        // Compose refine filters from the current UI selection
        permanent: [...departmentFilters, ...searchFilter],
      },
      sorters: {
        initial: [
          {
            field: "id",
            order: "desc",
          },
        ],
      },
    },
  });

  // Fetch department list
  const {
    options: departmentOptions,
    query: departmentsQuery,
    onSearch: onSearchDepartments,
  } = useSelect<Department>({
    resource: "departments",
    optionLabel: "name",
    optionValue: "name",
    debounce: 300,
    pagination: {
      mode: "off",
    },
    onSearch: (value) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Subjects</h1>
      <div className="intro-row">
        <p>Quick access to essential metrics and management tools.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by name..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {/* <Popover open={departmentOpen} onOpenChange={setDepartmentOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  role="combobox"
                  className={cn(
                    "justify-between font-normal",
                    // !subjectValue && "text-muted-foreground",
                  )}
                  disabled={departmentsQuery.isLoading}
                >
                  <span className="truncate">
                    {selectedDepartment === "all"
                      ? "All Departments"
                      : departmentOptions.find(
                          (opt) =>
                            String(opt.label).toLowerCase() ===
                            String(selectedDepartment).toLowerCase(),
                        )?.label ||
                        (selectedDepartment === "all"
                          ? "All Departments"
                          : selectedDepartment)}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                <Command shouldFilter={false}>
                  {" "}
                  <CommandInput
                  // shouldFilter={false} lets Refine/server handle the filtering 
                    className="w-full text-center placeholder:text-center"
                    value={departmentSearch}
                    placeholder="Search subjects..."
                    onValueChange={(val) => {
                      onSearchDepartments(val);
                      setDepartmentSearch(val);
                    }}
                  />
                  <CommandList>
                    <CommandEmpty className="text-center">
                      No department found.
                    </CommandEmpty>
                    <CommandGroup>
                      {(!departmentSearch ||
                      //  Always provide "All Departments" when search is empty or user is typing "all" 
                        "all departments".includes(
                          departmentSearch.toLocaleLowerCase().trim(),
                        )) && (
                        <CommandItem
                          value="all"
                          className="flex gap-2 cursor-pointer items-center w-full hover:bg-accent hover:text-accent-foreground px-2"
                          onSelect={() => {
                            setSelectedDepartment("all");
                            setDepartmentOpen(false);
                          }}
                        >
                          All Departments
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              "all" === selectedDepartment
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      )}
                      {departments.map(({ name, id }) => (
                        <CommandItem
                          key={id}
                          value={id.toString()}
                          className="flex gap-2 cursor-pointer items-center w-full hover:bg-accent hover:text-accent-foreground px-2"
                          onSelect={() => {
                            setSelectedDepartment(name);
                            setDepartmentOpen(false);
                          }}
                        >
                          {name}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              name === selectedDepartment
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover> */}

            <SearchableSelect
              variant="filter"
              value={selectedDepartment}
              onValueChange={(val) =>
                setSelectedDepartment(val as SetStateAction<string>)
              }
              options={departmentOptions} // e.g. [{ label: "Jane Doe", value: 1 }]
              placeholder="Filter by department"
              searchPlaceholder="Search department..."
              emptyMessage="No department found."
              isLoading={departmentsQuery.isLoading}
              onSearch={onSearchDepartments}
              allOptionLabel="All Departments"
            />

            <CreateButton resource="subjects" />
          </div>
        </div>
      </div>

      <DataTable table={subjectTable} />
    </ListView>
  );
};

export default SubjectsList;
