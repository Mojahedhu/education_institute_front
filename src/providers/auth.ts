import { authClient } from "@/lib/auth-client";
import { SignUpPayload, User } from "@/types";
import { AuthProvider } from "@refinedev/core";

export const authProvider: AuthProvider = {
  register: async ({
    email,
    password,
    name,
    role,
    image,
    imageCldPubId,
    providerName,
  }: SignUpPayload) => {
    try {
      // 1- Social provider Registration / Sign-up (Google / GitHub)
      if (providerName) {
        const { error } = await authClient.signIn.social({
          provider: providerName as "google" | "github",
          callbackURL: "/",
        });
        if (error) {
          console.error(error.message);
          return {
            success: false,
            error: {
              name: `${providerName} registration failed`,
              message: `Unable to register with ${providerName}`,
            },
          };
        }
        return {
          success: true,
        };
      }

      // 2. Email / Password Registration (Existing Flow)
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        image,
        role,
        imageCldPubId,
      });

      if (error) {
        console.error(error?.message);
        return {
          success: false,
          error: {
            name: "Registration failed",
            message: "Unable to create account. Please try again.",
          },
        };
      }

      // Store user data
      localStorage.setItem("user", JSON.stringify(data.user));

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        error: {
          name: "Registration failed",
          message: "Unable to create account. Please try again.",
        },
      };
    }
  },

  login: async ({ email, password, providerName }) => {
    try {
      // Social Login

      if (providerName) {
        const { error } = await authClient.signIn.social({
          provider: providerName as "google" | "github",
          callbackURL: "/",
        });
        if (error) {
          console.error(error.message);
          return {
            success: false,
            error: {
              name: "Login failed",
              message: `Unable to sign in with ${providerName}`,
            },
          };
        }
        return {
          success: true,
        };
      }

      // Email login
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        console.error("Login error from auth client:", error);
        return {
          success: false,
          error: {
            name: "Login failed",
            message: "Failed to login, please try again later.",
          },
        };
      }

      // Store user data
      localStorage.setItem("user", JSON.stringify(data.user));

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      console.error("Login exception:", error);
      return {
        success: false,
        error: {
          name: "Login failed",
          message: "Please try again later.",
        },
      };
    }
  },
  logout: async () => {
    const { error } = await authClient.signOut();

    if (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        error: {
          name: "Logout failed",
          message: "Unable to log out. Please try again.",
        },
      };
    }

    localStorage.removeItem("user");
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    if (
      error.response?.status === "401" ||
      error?.status === "401" ||
      error?.statusCode === "401"
    ) {
      return {
        logout: true,
      };
    }

    return { error };
  },
  check: async () => {
    // The basic code
    // try {
    //   // 1. Validate session with the backend via better-auth client
    //   const { data, error } = await authClient.getSession();
    //   if (error || !data?.session) {
    //     // Clear stale local storage if session is invalid or expired
    //     localStorage.removeItem("user");
    //     return {
    //       authenticated: false,
    //       logout: true,
    //       redirectTo: "/login",
    //       error: {
    //         name: "Unauthorized",
    //         message: error?.message || "Session expired or invalid",
    //       },
    //     };
    //   }
    //   // 2. Keep local user in sync with the session user if present
    //   if (data.user) {
    //     localStorage.setItem("user", JSON.stringify(data.user));
    //   }
    //   return {
    //     authenticated: true,
    //   };
    // } catch (err) {
    //   console.error("Check server auth error:", err);
    //   localStorage.removeItem("user");
    //   return {
    //     authenticated: false,
    //     logout: true,
    //     redirectTo: "/login",
    //     error: {
    //       name: "Unauthorized",
    //       message: "Failed to validate session",
    //     },
    //   };
    // }

    // Temp code for development
    const user = localStorage.getItem("user");

    if (user) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
      error: {
        name: "Unauthorized",
        message: "Check failed",
      },
    };
  },
  getPermissions: async () => {
    const user = localStorage.getItem("user");
    if (!user) return null;
    const parsedUser: User = JSON.parse(user);
    return {
      role: parsedUser.role,
    };
  },

  getIdentity: async () => {
    const user = localStorage.getItem("user");

    if (!user) return null;
    const parsedUser: User = JSON.parse(user);

    return {
      id: parsedUser.id,
      name: parsedUser.name,
      email: parsedUser.email,
      image: parsedUser.image,
      role: parsedUser.role,
      imageCldPubId: parsedUser.imageCldPubId,
    };
  },
  forgotPassword: async ({ email }: { email: string }) => {
    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password", // URL where the user will be redirected to enter a new password
      });

      if (error) {
        return {
          success: false,
          error: {
            name: "Forgot password failed",
            message:
              error.message || "Failed to send reset email. Please try again.",
          },
        };
      }

      return {
        success: true,
        successNotification: {
          message: "Check your email for a password reset link.",
          description: "Success",
        },
      };
    } catch (error) {
      console.error("Forgot password error:", error);
      return {
        success: false,
        error: {
          name: "Forgot password failed",
          message: "Unable to process request. Please try again.",
        },
      };
    }
  },
};
