import { BACKEND_BASE_URL } from "@/constants";
import { ListResponse } from "@/types";
import { HttpError, ValidationErrors } from "@refinedev/core";
import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";

if (!BACKEND_BASE_URL) {
  throw new Error(
    "BACKEND_BASE_URL is not configure. Please set VITE_BACKEND_BASE_URL in your .env file",
  );
}

const buildHttpError = async (response: Response): Promise<HttpError> => {
  let errorData: {
    message?: string;
    error?: string;
    errors?: ValidationErrors;
  };

  try {
    errorData = await response.json();
  } catch (error) {
    console.error(error);
    errorData = { message: response.statusText };
  }

  return {
    message:
      errorData?.message ||
      errorData?.error ||
      response?.statusText ||
      "Request failed",
    statusCode: response.status,
    errors: errorData?.errors,
  };
};

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,

    buildQueryParams: async ({ resource, pagination, filters }) => {
      const params: Record<string, string | number> = {};

      if (pagination?.mode !== "off") {
        const page = pagination?.currentPage ?? 1;
        const pageSize = pagination?.pageSize ?? 10;

        params.page = page;
        params.limit = pageSize;
      }

      filters?.forEach((filter) => {
        const field = "field" in filter ? filter.field : "";
        const value = String(filter.value);

        if (resource === "departments") {
          if (field === "name" || field === "code") params.search = value;
        }

        if (resource === "subjects") {
          if (field === "department") params.department = value;
          if (field === "name" || field === "code") params.search = value;
        }
      });
      return params;
    },

    mapResponse: async (response) => {
      // if (!response.ok) {
      //   let errorData: {
      //     message?: string;
      //     error?: string;
      //     errors?: ValidationErrors;
      //   };
      //   try {
      //     errorData = await response.json();
      //   } catch {
      //     errorData = { message: response.statusText };
      //   }
      //   const error: HttpError = {
      //     message:
      //       errorData?.message ||
      //       errorData?.error ||
      //       response.statusText ||
      //       "Request failed",
      //     statusCode: response.status,
      //     errors: errorData?.errors,
      //   };
      //   throw error;
      // }
      if (!response.ok) throw await buildHttpError(response);
      const payload: ListResponse = await response.clone().json();
      return payload.data ?? [];
    },

    getTotalCount: async (response) => {
      if (!response.ok) return 0;
      // if (!response.ok) throw await buildHttpError(response);
      const payload: ListResponse = await response.clone().json();
      // If response has pagination metadata, use total (or 0 if missing)
      if (payload.pagination) {
        return payload.pagination.total ?? 0;
      }
      // If unpaginated (e.g. raw full list), total count is the list length
      return payload.data?.length ?? 0;
    },
  },
};

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };
