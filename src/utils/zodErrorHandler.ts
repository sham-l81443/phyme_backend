import { ZodError } from "zod";


interface ZodErrorIssue {
    code: string;
    expected: string;
    received: string | undefined;
    path: string[];
    message: string;
}

interface ZodErrorResponse {
    issues: ZodErrorIssue[];
    name: string;
}

const handleZodError = (error: ZodError) => {

    const { issues } = error as ZodErrorResponse
    
        return issues[0].message
}
 
export default handleZodError