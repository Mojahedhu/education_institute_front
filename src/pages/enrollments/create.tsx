import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CreateView } from "@/components/refine-ui/views/create-view";
import SearchableSelect from "@/components/searchable-select";
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

import { Separator } from "@/components/ui/separator";
import { EnrollFormValues, enrollSchema } from "@/lib/schema";
import { ClassDetails, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBack, useCreate, useGetIdentity, useSelect } from "@refinedev/core";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const EnrollmentCreate = () => {
  const navigate = useNavigate();
  const back = useBack();
  const {
    mutateAsync: createEnrollment,
    mutation: { isPending },
  } = useCreate();
  const { data: currentUser } = useGetIdentity<User>();

  const {
    options: classOptions,
    query: classesQueryS,
    onSearch: onSearchClasses,
  } = useSelect<ClassDetails>({
    resource: "classes",
    optionLabel: "name",
    optionValue: "id",
    debounce: 400,
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

  // const classes = classesQueryS.data?.data ?? [];
  const classesLoading = classesQueryS.isLoading;

  const form = useForm<EnrollFormValues>({
    resolver: zodResolver(enrollSchema),
    defaultValues: {
      classId: 0,
    },
  });

  const selectedClassId = form.watch("classId");

  const onSubmit = async (values: EnrollFormValues) => {
    if (!currentUser?.id) return;

    const response = await createEnrollment({
      resource: "enrollments",
      values: {
        classId: values.classId,
        studentId: currentUser.id,
      },
    });

    navigate("/enrollments/confirm", {
      state: {
        enrollment: response?.data,
      },
    });
  };

  const isSubmitDisabled =
    isPending ||
    classesLoading ||
    !currentUser?.id ||
    // !classes.length ||
    !selectedClassId;

  return (
    <CreateView className="class-view">
      <Breadcrumb />

      <h1 className="page-title">Enroll in a Class</h1>
      <div className="intro-row">
        <p>Select a class to enroll as the current user.</p>
        <Button onClick={back}>Go Back</Button>
      </div>

      <Separator />

      <div className="my-4 flex items-center">
        <Card className="class-form-card">
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl pb-0 font-bold text-gradient">
              Enrollment Form
            </CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="mt-7">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Class <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <SearchableSelect
                          variant="form"
                          value={field.value}
                          onValueChange={field.onChange}
                          options={classOptions} // e.g. [{ label: "Math (MATH101)", value: 1 }]
                          placeholder="Select class"
                          searchPlaceholder="Search class..."
                          emptyMessage="No class found."
                          isLoading={classesQueryS.isLoading}
                          onSearch={onSearchClasses}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Student</FormLabel>
                  <FormControl>
                    <Input
                      value={currentUser?.email ?? "Not signed in"}
                      readOnly
                    />
                  </FormControl>
                </FormItem>

                <Button type="submit" size="lg" disabled={isSubmitDisabled}>
                  {isPending ? "Enrolling..." : "Enroll"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </CreateView>
  );
};

export default EnrollmentCreate;
