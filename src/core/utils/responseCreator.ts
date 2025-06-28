export default function createSuccessResponse<T>({
    data,
    message = "successful",
    success = true,
    timestamp = new Date().toISOString(),
    meta = null
}: {
    data: T;
    message?: string;
    success?: boolean;
    timestamp?: string;
    meta?: Record<string, any> | null;
}) {
    return { data, message, success, timestamp, meta };
}
