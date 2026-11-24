import { CreateButton } from "@/components/refine-ui/buttons/create";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import SearchableSelect from "@/components/searchable-select";
import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";

import { ClassListItem, Subject, User } from "@/types";
import { useSelect } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";

import { Search } from "lucide-react";
import { SetStateAction, useEffect, useMemo, useState } from "react";

const ClassesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("all");

  const classColumn = useMemo<ColumnDef<ClassListItem>[]>(
    () => [
      {
        id: "banner",
        accessorKey: "bannerUrl",
        size: 120,
        header: () => <p className="column-title ml-2">Banner</p>,
        cell: ({ getValue }) => {
          const bannerUrl = getValue<string>();
          return bannerUrl ? (
            <img
              src={bannerUrl}
              alt="Class banner"
              className="ml-2 w-10 h-10 rounded-md object-cover"
              loading="lazy"
            />
          ) : (
            <span className="text-muted ml-2">No image</span>
          );
        },
      },
      {
        id: "name",
        accessorKey: "name",
        size: 220,
        header: () => <p className="column-title">Class name</p>,
        cell: ({ getValue }) => {
          const className = getValue<string>();
          return <span className="text-foreground">{className}</span>;
        },
      },
      {
        id: "status",
        accessorKey: "status",
        size: 140,
        cell: ({ getValue }) => {
          const status = getValue<string>();
          const variant = status === "active" ? "default" : "secondary";
          return <Badge variant={variant}>{status}</Badge>;
        },
      },
      {
        id: "subject",
        accessorKey: "subject.name",
        size: 200,
        header: () => <p className="column-title">Subject</p>,
        cell: ({ getValue }) => {
          const subjectName = getValue<string>();
          return subjectName ? (
            <Badge variant={"secondary"}>{subjectName}</Badge>
          ) : (
            <span className="text-muted-foreground">No Subject</span>
          );
        },
      },
      {
        id: "teacher",
        accessorKey: "teacher.name",
        size: 200,
        header: () => <p className="column-title">Teacher</p>,
        cell: ({ getValue }) => {
          const teacherName = getValue<string>();
          return teacherName ? (
            <span className="text-foreground">{teacherName}</span>
          ) : (
            <span className="text-muted-foreground">No assigned teacher</span>
          );
        },
      },
      {
        id: "capacity",
        accessorKey: "capacity",
        header: () => <p className="column-title">Capacity</p>,
        cell: ({ getValue }) => {
          const capacity = getValue<number>();

          return <span className="text-foreground">{capacity}</span>;
        },
      },
      {
        id: "details",
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => (
          <ShowButton
            resource="classes"
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

  // Fetch subject list
  const {
    options: subjectOptions,
    query: subjectsQuery,
    onSearch: onSearchSubjects,
  } = useSelect<Subject>({
    resource: "subjects",
    optionLabel: "name",
    optionValue: "id",
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

  // Teacher options
  const {
    options: teacherOptions,
    query: teachersQuery,
    onSearch: onSearchTeachers,
  } = useSelect<User>({
    resource: "users",
    optionLabel: "name",
    optionValue: "id",
    debounce: 300,
    filters: [
      {
        field: "role",
        operator: "eq",
        value: "teacher",
      },
    ],
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

  // Map selected ID to name for backend filter payload
  const selectedSubjectName = useMemo(() => {
    if (selectedSubject === "all") return "all";
    const found = subjectOptions.find(
      (opt) => String(opt.value) === String(selectedSubject),
    );
    return found ? String(found.label) : selectedSubject;
  }, [selectedSubject, subjectOptions]);
  const selectedTeacherName = useMemo(() => {
    if (selectedTeacher === "all") return "all";
    const found = teacherOptions.find(
      (opt) => String(opt.value) === String(selectedTeacher),
    );
    return found ? String(found.label) : selectedTeacher;
  }, [selectedTeacher, teacherOptions]);

  const subjectFilters =
    selectedSubject === "all"
      ? []
      : [
          {
            field: "subject",
            operator: "eq" as const,
            value: selectedSubjectName,
          },
        ];

  const teacherFilters =
    selectedTeacher === "all"
      ? []
      : [
          {
            field: "teacher",
            operator: "eq" as const,
            value: selectedTeacherName,
          },
        ];

  const searchFilters = searchQuery
    ? [
        {
          field: "name",
          operator: "contains" as const,
          value: searchQuery,
        },
      ]
    : [];

  const classesTable = useTable({
    columns: classColumn,
    refineCoreProps: {
      resource: "classes",
      pagination: {
        mode: "server",
        pageSize: 10,
      },
      filters: {
        // Compose refine filters from the current UI selection
        permanent: [...subjectFilters, ...teacherFilters, ...searchFilters],
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

  useEffect(() => {
    classesTable.refineCore.setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubject, selectedTeacher, searchQuery]);

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Classes</h1>

      <div className="intro-row">
        <p>Quick access to essential metrics and management tools.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name..."
              className="pl-10 w-full"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <SearchableSelect
              variant="filter"
              value={selectedSubject}
              onValueChange={(val) =>
                setSelectedSubject(val as SetStateAction<string>)
              }
              options={subjectOptions} // e.g. [{ label: "Jane Doe", value: 1 }]
              placeholder="Filter by subject"
              searchPlaceholder="Search subject..."
              emptyMessage="No subject found."
              isLoading={subjectsQuery.isLoading}
              onSearch={onSearchSubjects}
              allOptionLabel="All Subjects"
            />
            {/* <Popover open={subjectOpen} onOpenChange={setSubjectOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  role="combobox"
                  className={cn(
                    "justify-between font-normal",
                    // !subjectValue && "text-muted-foreground",
                  )}
                  disabled={subjectsQuery.isLoading}
                >
                  <span className="truncate">
                    {selectedSubject === "all"
                      ? "All Subjects"
                      : subjectOptions.find(
                          (opt) =>
                            String(opt.label).toLowerCase() ===
                            String(selectedSubject).toLowerCase(),
                        )?.label ||
                        (selectedSubject === "all"
                          ? "All Subjects"
                          : selectedSubject)}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                <Command shouldFilter={false}>
                  {" "}
                  <CommandInput
                    //  shouldFilter={false} lets Refine/server handle the filtering
                    className="w-full text-center placeholder:text-center"
                    value={subjectSearch}
                    placeholder="Search subjects..."
                    onValueChange={(val) => {
                      onSearchSubjects(val);
                      setSubjectSearch(val);
                    }}
                  />
                  <CommandList>
                    <CommandEmpty className="text-center">
                      No subject found.
                    </CommandEmpty>
                    <CommandGroup>
                      {(!subjectSearch ||
                        //  Always provide "All Subjects" when search is empty or user is typing "all"
                        "all subjects".includes(
                          subjectSearch.toLocaleLowerCase().trim(),
                        )) && (
                        <CommandItem
                          value="all"
                          className="flex gap-2 cursor-pointer items-center w-full hover:bg-accent hover:text-accent-foreground px-2"
                          onSelect={() => {
                            setSelectedSubject("all");
                            setSubjectOpen(false);
                          }}
                        >
                          All Subjects
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              "all" === selectedSubject
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      )}
                      {subjects.map(({ name, id }) => (
                        <CommandItem
                          key={id}
                          value={id.toString()}
                          className="flex gap-2 cursor-pointer items-center w-full hover:bg-accent hover:text-accent-foreground px-2"
                          onSelect={() => {
                            setSelectedSubject(name);
                            setSubjectOpen(false);
                          }}
                        >
                          {name}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              name === selectedSubject
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
              value={selectedTeacher}
              onValueChange={(val) =>
                setSelectedTeacher(val as SetStateAction<string>)
              }
              options={teacherOptions} // e.g. [{ label: "Jane Doe", value: 1 }]
              placeholder="Filter by teacher"
              searchPlaceholder="Search teacher..."
              emptyMessage="No teacher found."
              isLoading={teachersQuery.isLoading}
              onSearch={onSearchTeachers}
              allOptionLabel="All Teachers"
            />

            {/* <Popover open={teacherOpen} onOpenChange={setTeacherOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  role="combobox"
                  className={cn(
                    "justify-between font-normal",
                    // !subjectValue && "text-muted-foreground",
                  )}
                  disabled={teachersQuery.isLoading}
                >
                  <span className="truncate">
                    {selectedTeacher === "all"
                      ? "All Teachers"
                      : teacherOptions.find(
                          (opt) =>
                            String(opt.label).toLowerCase() ===
                            String(selectedTeacher).toLowerCase(),
                        )?.label ||
                        (selectedTeacher === "all"
                          ? "All Teachers"
                          : selectedTeacher)}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command shouldFilter={false}>
                  {" "}
                  <CommandInput
                    // shouldFilter={false} lets Refine/server handle the filtering
                    placeholder="Search Teachers..."
                    value={teacherSearch}
                    onValueChange={(val) => {
                      onSearchTeachers(val);
                      setTeacherSearch(val);
                    }}
                  />
                  <CommandList>
                    <CommandEmpty className="text-center">
                      No Teachers found.
                    </CommandEmpty>
                    <CommandGroup>
                      {(!teacherSearch ||
                        //  Always provide "All Subjects" when search is empty or user is typing "all"
                        "all teachers".includes(
                          teacherSearch.toLocaleLowerCase().trim(),
                        )) && (
                        <CommandItem
                          value="all"
                          className="flex gap-2 cursor-pointer items-center w-full hover:bg-accent hover:text-accent-foreground px-2"
                          onSelect={() => {
                            setSelectedTeacher("all");
                            setTeacherOpen(false);
                          }}
                        >
                          All Teachers
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              "all" === selectedTeacher
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      )}
                      {teachers.map(({ name, id }) => (
                        <CommandItem
                          key={id}
                          value={id.toString()}
                          className="flex gap-2 cursor-pointer items-center w-full hover:bg-accent hover:text-accent-foreground px-2"
                          onSelect={() => {
                            setSelectedTeacher(name);
                            setTeacherOpen(false);
                          }}
                        >
                          {name}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              name === selectedTeacher
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
            <CreateButton resource="classes" />
          </div>
        </div>
      </div>
      <DataTable table={classesTable} />
    </ListView>
  );
};

export default ClassesList;
