"use client";

import { useRegister, useLink } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { InputPassword } from "@/components/refine-ui/form/input-password";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormValues, registerSchema } from "@/lib/schema";
import { UploadWidgetValue, UserRole } from "@/types";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ROLE_OPTIONS } from "@/constants";
import UploadWidget from "@/components/upload-widget";
import { ControllerRenderProps } from "react-hook-form";
import { Loader } from "lucide-react";
import { GitHub, Google } from "@/lib/svg-icons";

export const SignUpForm = () => {
  const Link = useLink();

  const { mutate: register, isPending: isRegistering } = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: UserRole.STUDENT,
      image: "",
      imageCldPubId: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = form;

  const imagePublicId = form.watch("imageCldPubId");

  const setBannerImage = (
    file: UploadWidgetValue | null,
    field: ControllerRenderProps<RegisterFormValues>,
  ) => {
    if (file) {
      field.onChange(file.url);
      form.setValue("imageCldPubId", file.publicId, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      field.onChange("");
      form.setValue("imageCldPubId", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      register(
        {
          ...values,
          image: values.image || undefined,
          imageCldPubId: values.imageCldPubId || undefined,
        },
        {
          onSuccess: (data) => {
            if (data.success === false) {
              toast.error(data.error?.message, {
                richColors: true,
              });
              return;
            }

            toast.success("Account created successfully!", {
              richColors: true,
            });
            form.reset();
          },
        },
      );
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed", {
        richColors: true,
      });
    }
  };

  const handleSignUpWithGoogle = () => {
    register({
      providerName: "google",
    });
  };

  const handleSignUpWithGitHub = () => {
    register({
      providerName: "github",
    });
  };

  return (
    <div className="sign-up">
      <div className="logo">
        <img src="/logo.png" alt="Logo" />
      </div>

      <Card className="card">
        <CardHeader className="header">
          <CardTitle className="title">Register</CardTitle>
          <CardDescription
            className={cn("text-muted-foreground", "font-medium")}
          >
            Create an account to get started.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="content">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="form">
              {/* User Type Selection */}
              <FormField
                control={control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role *</FormLabel>
                    <FormControl>
                      <div className="roles">
                        {ROLE_OPTIONS.map(({ value, label, icon: Icon }) => {
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => field.onChange(value)}
                              className={cn(
                                "role-button",
                                field.value === value && "is-active",
                              )}
                            >
                              <Icon />
                              <span>{label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Profile Photo Upload */}
              <FormField
                control={control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Photo</FormLabel>
                    <FormControl>
                      <UploadWidget
                        value={
                          field.value
                            ? {
                                url: field.value,
                                publicId: imagePublicId ?? "",
                              }
                            : null
                        }
                        onChange={(file) => {
                          setBannerImage(file, field);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password *</FormLabel>
                    <FormControl>
                      <InputPassword
                        {...field}
                        placeholder="Enter your password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password *</FormLabel>
                    <FormControl>
                      <InputPassword
                        {...field}
                        placeholder="Confirm password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="submit"
                disabled={isSubmitting || isRegistering}
              >
                {isSubmitting || isRegistering ? (
                  <>
                    <Loader className="animate-spin" /> Creating Account
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className={cn("flex", "items-center", "gap-4", "mt-6")}>
                <Separator className={cn("flex-1")} />
                <span className={cn("text-sm", "text-muted-foreground")}>
                  or
                </span>
                <Separator className={cn("flex-1")} />
              </div>

              <div className={cn("flex", "flex-col", "gap-4", "mt-6")}>
                <div className={cn("grid grid-cols-2", "gap-6")}>
                  <Button
                    variant="outline"
                    className={cn("flex", "items-center", "gap-2")}
                    onClick={handleSignUpWithGoogle}
                    type="button"
                  >
                    <Google />
                    <div>Google</div>
                  </Button>
                  <Button
                    variant="outline"
                    className={cn("flex", "items-center", "gap-2")}
                    onClick={handleSignUpWithGitHub}
                    type="button"
                  >
                    <GitHub />
                    <div>GitHub</div>
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>

        <Separator />

        <CardFooter className="footer">
          <span>Have an account? </span>
          <Link to="/login">Sign in</Link>
        </CardFooter>
      </Card>
    </div>
  );
};

SignUpForm.displayName = "SignUpForm";
