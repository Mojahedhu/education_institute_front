import { InputPassword } from "@/components/refine-ui/form/input-password";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { ResetPasswordFormValues, resetPasswordSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-separator";
import { useLink } from "@refinedev/core";
import { AlertCircle, Loader } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const errorParam = searchParams.get("error");
  const navigate = useNavigate();
  const Link = useLink();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTokenInvalid, setIsTokenInvalid] = useState(false);
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await authClient.resetPassword({
        newPassword: values.password,
        token,
      });
      if (error) {
        console.error(error.message);

        // Detect expired or invalid token errors from Better Auth
        const isExpiredOrInvalid =
          error.status === 400 ||
          error.status === 401 ||
          /token|expired|invalid/i.test(error.message || "");
        if (isExpiredOrInvalid) {
          setIsTokenInvalid(true);
          return;
        }

        toast.error("Failed to reset password. Please try again.");
        return;
      }
      toast.success(
        "Password reset successfully! Please sign in with your new password.",
      );
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If token is missing or error param exists
  if (!token || errorParam || isTokenInvalid) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-8 min-h-svh">
        <Card className="sm:w-114 p-6 text-center">
          <CardHeader className="flex flex-col items-center gap-2">
            <AlertCircle className="w-12 h-12 text-destructive" />
            <CardTitle className="text-2xl font-bold">
              Invalid or Expired Link
            </CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired. Please request
              a new one.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center mt-4">
            <Button asChild>
              <Link to="/forgot-password">Request New Link</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 min-h-svh">
      <div className="flex items-center justify-center gap-2 mb-6">
        <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
      </div>
      <Card className="sm:w-114 p-12">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-3xl font-semibold text-primary">
            Set New Password
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium">
            Please enter and confirm your new password.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <InputPassword
                        {...field}
                        placeholder="Enter new password"
                        autoComplete="new-password"
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
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <InputPassword
                        {...field}
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size="lg"
                className="w-full mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" /> Resetting
                    Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <Separator className="my-6" />
        <CardFooter className="px-0 pb-0 justify-center text-sm text-muted-foreground">
          <span>Remember your password? </span>
          <Link
            to="/login"
            className="ml-1 text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;
