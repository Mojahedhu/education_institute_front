import { useBack } from "@refinedev/core";
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
import { MOCK_SUBJECTS } from "@/constants/mock-data";
import { teachers } from "@/constants";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ControllerRenderProps } from "react-hook-form";
import { UploadWidgetValue } from "@/types";

type FormArgs = z.infer<typeof classSchema>;

const ClassesCreate = () => {
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
    control,
    formState: { errors },
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

  const onSubmit = async (value: FormArgs) => {};
  return (
    <CreateView className="class-view">
      <Breadcrumb />
      <h1>Create a class</h1>
      <div className="intro-row">
        <p>Provide the required information below to add a class.</p>
        <button onClick={back}>Go Back</button>
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
                  <FormField
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
                          // disabled={subject}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {MOCK_SUBJECTS.map(({ id, code, name }) => (
                              <SelectItem key={id} value={id.toString()}>
                                {name} {code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
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
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a teacher" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teachers.map(({ id, name }) => (
                              <SelectItem key={id} value={id}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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

                <Button type="submit" size={"lg"} className="w-full">
                  <div>Create Class</div>
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
