import { createAuthClient } from "better-auth/react";
import { BACKEND_BASE_URL } from "../constants";
import { inferAdditionalFields } from "better-auth/client/plugins";
export const authClient = createAuthClient({
  baseURL: `${BACKEND_BASE_URL}auth`,
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
          required: true,
          defaultValue: "student",
          input: true,
        },
        department: {
          type: "string",
          required: false,
          input: true,
        },
        imageCldPubId: {
          type: "string",
          required: false,
          input: true,
        },
      },
    }),
  ],
});
