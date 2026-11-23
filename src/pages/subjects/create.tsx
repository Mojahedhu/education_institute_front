import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { subjectCreateSchema, SubjectFormValues } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { Department } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { BaseRecord, HttpError, useBack, useSelect } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "cmdk";
import { Check, ChevronsDown, Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SubjectCreate = () => {
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [departmentSearch, setDepartmentSearch] = useState("");
  const back = useBack();

  const form = useForm<BaseRecord, HttpError, SubjectFormValues>({
    resolver: zodResolver(subjectCreateSchema),
    refineCoreProps: {
      resource: "subjects",
      action: "create",
    },
    defaultValues: {
      departmentId: 0,
      name: "",
      code: "",
      description: "",
    },
  });

  const {
    refineCore: { onFinish },
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = form;

  const {
    options: departmentsOptions,
    query: departmentsQuery,
    onSearch: onSearchDepartment,
  } = useSelect<Department>({
    resource: "departments",
    optionLabel: "name",
    optionValue: "id",
    debounce: 300,
    pagination: {
      mode: "off", // or customize page limits
    },
    onSearch: (value) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],
  });

  const departments = departmentsQuery.data?.data ?? [];
  const departmentsLoading = departmentsQuery.isLoading;

  const onSubmit = async (values: SubjectFormValues) => {
    try {
      await onFinish(values);
      toast.success("Subject created successfully", { richColors: true });
    } catch (error) {
      console.error("Error creating subject:", error);
      toast.error("Subject creation failed, please try again", {
        richColors: true,
      });
    }
  };

  return (
    <CreateView className="class-view">
      <Breadcrumb />

      <h1 className="page-title">Create a Subject</h1>
      <div className="intro-row">
        <p>Provide the required information below to add a subject.</p>
        <Button onClick={() => back()}>Go Back</Button>
      </div>

      <Separator />

      <div className="my-4 flex items-center">
        <Card className="class-form-card">
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl pb-0 font-bold text-gradient">
              Fill out form
            </CardTitle>
          </CardHeader>

          <Separator />
          <CardContent className="mt-7">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Department field */}
                <FormField
                  control={control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      Department <span className="text-orange-600">*</span>
                      <Popover
                        open={departmentOpen}
                        onOpenChange={setDepartmentOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                              disabled={departmentsLoading}
                            >
                              {field.value
                                ? (departmentsOptions.find(
                                    (opt) => opt.value === field.value,
                                  )?.label ?? "Select subject")
                                : "Select subject"}
                              <ChevronsDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[calc(var(--radix-popover-trigger-width)*0.8)] p-0">
                          <Command shouldFilter={false}>
                            {" "}
                            {/* shouldFilter={false} lets Refine/server handle the filtering */}
                            <CommandInput
                              className="w-full text-center placeholder:text-center"
                              placeholder="Search department..."
                              value={departmentSearch}
                              onValueChange={(val) => {
                                onSearchDepartment(val);
                                setDepartmentSearch(val);
                              }}
                            />
                            <CommandList>
                              <CommandEmpty className="text-center">
                                No subject found.
                              </CommandEmpty>
                              <CommandGroup>
                                {departments.map(
                                  ({ name: label, id: value }) => (
                                    <CommandItem
                                      key={value}
                                      value={value.toString()}
                                      className="flex gap-2 cursor-pointer items-center w-full hover:bg-accent hover:text-accent-foreground px-2"
                                      onSelect={() => {
                                        field.onChange(Number(value));
                                        setDepartmentOpen(false);
                                      }}
                                    >
                                      {label}
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4 ml-auto",
                                          value === field.value
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                    </CommandItem>
                                  ),
                                )}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Name field */}
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Subject Name <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Intro to Programming" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Subject code */}
                <FormField
                  control={control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Subject Code <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="CS101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description field */}
                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Description <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the subject focus..."
                          className="min-h-28"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin" /> <>Creating...</>
                    </>
                  ) : (
                    "Create Subject"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </CreateView>
  );
};

export default SubjectCreate;
