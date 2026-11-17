import { useBack, useSelect } from "@refinedev/core";
import z from "zod";

import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { classSchema } from "@/lib/schema";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import UploadWidget from "@/components/upload-widget";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ControllerRenderProps } from "react-hook-form";
import { Subject, UploadWidgetValue, User } from "@/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "cmdk";
import { cn } from "@/lib/utils";
import { useState } from "react";

type FormArgs = z.infer<typeof classSchema>;

const ClassesCreate = () => {
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const back = useBack();

  const form = useForm({
    resolver: zodResolver(classSchema),
    refineCoreProps: {
      resource: "classes",
      action: "create",
    },
    defaultValues: {
      status: "active",
    },
  });

  const {
    refineCore: { onFinish },
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = form;

  const bannerPublicId = form.watch("bannerCldPubId");

  const setBannerImage = (
    file: UploadWidgetValue | null,
    field: ControllerRenderProps<FormArgs>,
  ) => {
    if (file) {
      field.onChange(file.url);
      form.setValue("bannerCldPubId", file.publicId, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      field.onChange("");
      form.setValue("bannerCldPubId", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const onSubmit = async (value: FormArgs) => {
    try {
      await onFinish(value);
    } catch (error) {
      console.error("Error creating class:", error);
    }
  };

  // Fetch subjects list
  // const { query: subjectsQuery } = useList<Subject>({
  //   resource: "subjects",
  //   pagination: {
  //     pageSize: 100,
  //   },
  // });

  // Fetch teacher list
  // const { query: teachersQuery } = useList<User>({
  //   resource: "users",
  //   filters: [
  //     {
  //       field: "role",
  //       operator: "eq",
  //       value: "teacher",
  //     },
  //   ],
  //   pagination: {
  //     pageSize: 100,
  //   },
  // });

  // Subjects dropdown options
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

  // Teachers dropdown options
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

  const teachers = teachersQuery.data?.data || [];
  // const teacherIsLoading = teachersQuery.isLoading;

  const subjects = subjectsQuery.data?.data || [];
  // const subjectIsLoading = subjectsQuery.isLoading;

  return (
    <CreateView className="class-view">
      <Breadcrumb />
      <h1>Create a class</h1>
      <div className="intro-row">
        <p>Provide the required information below to add a class.</p>
        <Button onClick={back}>Go Back</Button>
      </div>
      <Separator />
      <div className="my-4 flex items-center">
        <Card className="class-form-card">
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl pb-0 font-bold text-primary">
              Fill out Form
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="mt-7">
            <Form {...form}>
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <FormField
                  control={control}
                  name="bannerUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Banner Image <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <UploadWidget
                          value={
                            field.value
                              ? {
                                  url: field.value,
                                  publicId: bannerPublicId ?? "",
                                }
                              : null
                          }
                          onChange={(file) => setBannerImage(file, field)}
                        />
                      </FormControl>
                      <FormMessage />
                      {errors.bannerCldPubId && !errors.bannerUrl && (
                        <p className="text-destructive text-sm">
                          {errors.bannerCldPubId.message?.toString()}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Class Name <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Introduction to Biology - Section A"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* <FormField
                    control={control}
                    name="subjectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Subject <span className="text-orange-600">*</span>
                        </FormLabel>

                        <Select
                          value={field.value?.toString()}
                          onValueChange={(val) => field.onChange(Number(val))}
                          disabled={subjectsQuery.isLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subjects.map(({ id, name, code }) => (
                              <SelectItem key={id} value={id.toString()}>
                                {name} {code}
                              </SelectItem>
                            ))}
                            {
                              // {subjects.map(({ id, code, name }) => (
                              //   <SelectItem key={id} value={id.toString()}>
                              //     {name} {code}
                              //   </SelectItem>
                              // ))}
                            }
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

                  <FormField
                    control={control}
                    name="subjectId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Subject</FormLabel>
                        <Popover
                          open={subjectOpen}
                          onOpenChange={setSubjectOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                                disabled={subjectsQuery.isLoading}
                              >
                                {field.value
                                  ? subjectOptions.find(
                                      (opt) => opt.value === field.value,
                                    )?.label
                                  : "Select subject"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command shouldFilter={false}>
                              {" "}
                              {/* shouldFilter={false} lets Refine/server handle the filtering */}
                              <CommandInput
                                placeholder="Search subject..."
                                onValueChange={onSearchSubjects}
                              />
                              <CommandList>
                                <CommandEmpty className="text-center">
                                  No subject found.
                                </CommandEmpty>
                                <CommandGroup>
                                  {subjects.map(({ id, name, code }) => (
                                    <CommandItem
                                      key={id}
                                      value={id.toString()}
                                      className="flex gap-2 cursor-pointer items-center w-full hover:bg-accent hover:text-accent-foreground"
                                      onSelect={() => {
                                        field.onChange(Number(id));
                                        setSubjectOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          id === field.value
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                      {name} ({code})
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <FormField
                    control={control}
                    name="teacherId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Teacher <span className="text-orange-600">*</span>
                        </FormLabel>

                        <Select
                          value={field.value?.toString()}
                          onValueChange={field.onChange}
                          disabled={teachersQuery.isLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a teacher" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teacherOptions.map(({ label, value }) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                            {
                            //  {teachers.map(({ id, name }) => (
                            //   <SelectItem key={id} value={id}>
                            //     {name}
                            //   </SelectItem>
                            // ))} 
                            }
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  <FormField
                    control={control}
                    name="teacherId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Teacher</FormLabel>
                        <Popover
                          open={teacherOpen}
                          onOpenChange={setTeacherOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                                disabled={teachersQuery.isLoading}
                              >
                                {field.value
                                  ? teacherOptions.find(
                                      (opt) => opt.value === field.value,
                                    )?.label
                                  : "Select teacher"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command shouldFilter={false}>
                              {" "}
                              {/* shouldFilter={false} lets Refine/server handle the filtering */}
                              <CommandInput
                                placeholder="Search teacher..."
                                onValueChange={onSearchTeachers}
                              />
                              <CommandList>
                                <CommandEmpty className="text-center">
                                  No teacher found.
                                </CommandEmpty>
                                <CommandGroup>
                                  {teachers.map(({ id, name }) => (
                                    <CommandItem
                                      className="flex gap-2 cursor-pointer items-center w-full hover:bg-accent hover:text-accent-foreground"
                                      key={id.toString()}
                                      value={name}
                                      onSelect={() => {
                                        field.onChange(id);
                                        setTeacherOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          id === field.value
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                      {name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Capacity <span className="text-orange-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            placeholder="30"
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value ? Number(value) : undefined);
                            }}
                            value={(field.value as number | undefined) ?? ""}
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Status <span className="text-orange-600">*</span>
                        </FormLabel>

                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                          placeholder="Brief description about the class"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <Button
                  type="submit"
                  size={"lg"}
                  className="w-full"
                  disabled={isSubmitting}
                >
                  <div className="flex gap-2">
                    {" "}
                    {!isSubmitting ? (
                      <>
                        <Plus /> Create Class
                      </>
                    ) : (
                      <>
                        <Loader2 className="animate-spin" /> Generating...
                      </>
                    )}
                  </div>
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </CreateView>
  );
};

export default ClassesCreate;
