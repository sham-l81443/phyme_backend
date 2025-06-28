import { ZodError } from "zod";


interface ZodErrorIssue {
    code: string;
    expected: string;
    received: string | undefined;
    path: string[];
    message: string;
}

const handleZodError = (error: ZodError) => {


    const message: string[] = [];

    error.issues.filter((item) => {
        message.push(item.message)
    })

    return message
}

export default handleZodError