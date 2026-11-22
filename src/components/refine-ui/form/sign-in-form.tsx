"use client";

import { CircleHelp, Loader } from "lucide-react";

import { useLogin, useRefineOptions, useLink } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Checkbox } from "@/components/ui/checkbox";
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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInFormValues, signInSchema } from "@/lib/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GitHub, Google } from "@/lib/svg-icons";

export const SignInForm = () => {
  const Link = useLink();

  const { title } = useRefineOptions();

  const { mutate: login, isPending: isLoggingIn } = useLogin();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const {
    control,
    formState: { isSubmitting: isSigningIn },
    handleSubmit,
  } = form;

  const handleSignIn = async (values: SignInFormValues) => {
    login({
      email: values.email,
      password: values.password,
    });
  };

  const handleSignInWithGoogle = () => {
    login({
      providerName: "google",
    });
  };

  const handleSignInWithGitHub = () => {
    login({
      providerName: "github",
    });
  };

  return (
    <div className="sign-in">
      {title.icon && <div className="logo">{title.icon}</div>}

      <Card className="card">
        <CardHeader className="header">
          <CardTitle className="title">Sign in</CardTitle>
          <CardDescription className="description">
            Welcome back
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="content">
          <Form {...form}>
            <form onSubmit={handleSubmit(handleSignIn)} className="form">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="field">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@ex.com"
                        aria-required="true"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="field">
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <InputPassword
                        id="password"
                        aria-required="true"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="row">
                <FormField
                  control={control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="remember">
                      <FormControl>
                        <Checkbox
                          id="remember"
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(
                              checked === "indeterminate" ? false : checked,
                            )
                          }
                        />
                      </FormControl>
                      <FormLabel htmlFor="remember">Remember me</FormLabel>
                    </FormItem>
                  )}
                />
                <Link to="/forgot-password" className="forgot-link">
                  <span>Forgot password</span>
                  <CircleHelp />
                </Link>
              </div>

              <Button
                type="submit"
                size="lg"
                className="submit"
                disabled={isLoggingIn || isSigningIn}
              >
                {isLoggingIn || isSigningIn ? (
                  <>
                    <Loader className="animate-spin" /> Signing in
                  </>
                ) : (
                  <>Sign in</>
                )}
              </Button>

              <div className="split">
                <Separator />
                <span>or</span>
                <Separator />
              </div>

              <div className="social">
                <p>Sign in using</p>
                <div className="social-grid">
                  <Button
                    variant="outline"
                    className="social-button"
                    onClick={handleSignInWithGoogle}
                    type="button"
                  >
                    <Google />

                    <div>Google</div>
                  </Button>
                  <Button
                    variant="outline"
                    className="social-button"
                    onClick={handleSignInWithGitHub}
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

        <Separator className="divider" />

        <CardFooter className="footer">
          <span>No account? </span>
          <Link to="/register">Sign up</Link>
        </CardFooter>
      </Card>
    </div>
  );
};

SignInForm.displayName = "SignInForm";
