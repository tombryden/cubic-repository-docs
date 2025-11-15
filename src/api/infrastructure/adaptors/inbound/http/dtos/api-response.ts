import { NextResponse } from "next/server";

/**
 * Standard API response wrapper for successful responses
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

/**
 * Standard API response wrapper for error responses
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
}

/**
 * Combined API response type
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Helper function to create a successful API response
 */
export function createSuccessResponse<T>(
  data: T
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json<ApiSuccessResponse<T>>({
    success: true,
    data,
  });
}

/**
 * Helper function to create an error API response
 */
export function createErrorResponse(
  error: string,
  status = 500
): NextResponse<ApiErrorResponse> {
  return NextResponse.json<ApiErrorResponse>(
    {
      success: false,
      error,
    },
    { status }
  );
}
