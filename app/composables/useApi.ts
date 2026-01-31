// ~/composables/useApi.ts
import type { UseApiOptions } from "~/api/useApi";
import { api } from "~/api/useApi";

export const useApi = () => {
  // Generic wrapper
  const request = async <T>(
    endpoint: string,
    options: UseApiOptions = {}
  ): Promise<T> => {
    try {
      const { data, error } = await api<T>(endpoint, options);

      if (error) throw error;

      // Allow endpoints that legitimately return no body; treat as null instead of throwing.
      if (data === undefined) {
        return null as T;
      }

      return data as T;

    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.message ||
        "An unexpected error occurred";
      throw new Error(message);
    }
  };

  const get = <T>(url: string, params?: any, keySuffix?: string) =>
    request<T>(url, { method: "GET", params, keySuffix });

  const post = <T>(url: string, body?: any, keySuffix?: string) =>
    request<T>(url, { method: "POST", body, keySuffix });

  const put = <T>(url: string, body?: any, keySuffix?: string) =>
    request<T>(url, { method: "PUT", body, keySuffix });

  const patch = <T>(url: string, body?: any, keySuffix?: string) =>
    request<T>(url, { method: "PATCH", body, keySuffix });

  const del = <T>(url: string, params?: any, keySuffix?: string) =>
    request<T>(url, { method: "DELETE", params, keySuffix });

  return { request, get, post, put, patch, delete: del };
};
