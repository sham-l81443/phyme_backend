export default function createSuccessResponse<T>({
    data,
    message = "successful",
    status = "success",
    error = null,
    code = 200,
    timestamp = new Date().toISOString(),
    meta = null
}: {
    data: T;
    message?: string;
    status?: string;
    error?: null;
    code?: number;
    timestamp?: string;
    meta?: Record<string, any> | null;
}) {
    return { data, message, status, error, code, timestamp, meta };
}
