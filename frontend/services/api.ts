import axios, { AxiosError } from "axios";
import { ImportResponse, ApiErrorResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 300_000,
});

function extractErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as ApiErrorResponse;
    return data.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export async function importCsvFile(file: File): Promise<ImportResponse> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await apiClient.post<ImportResponse>("/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Import failed"));
  }
}

export async function checkHealth(): Promise<boolean> {
  try {
    await apiClient.get("/health");
    return true;
  } catch {
    return false;
  }
}
