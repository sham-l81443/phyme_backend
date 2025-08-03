import { AppError } from "@/core/utils/errors/AppError";
import { IAdminAccessToken, AdminAccessTokenSchema, StudentAccessTokenSchema, IStudentAccessToken } from "@/core/schema";
import { signJwt } from ".";
import { rethrowAppError } from "../errors/rethrowError";
import { ADMIN_CONFIG, STUDENT_CONFIG } from "@/core/config/auth";

export const generateStudentAccessToken = (params: IStudentAccessToken): string => {


    try {

        const parsed = StudentAccessTokenSchema.safeParse(params);
        if (!parsed.success) {
            throw new AppError({
                errorType: "Bad Request",
                message: parsed.error.errors.map((err) => err.message).join(", "),
            });
        }

        const { id, email, role, classId, syllabusId } = parsed.data;

        const payload = { id, email, role, classId, syllabusId }


        return signJwt(payload, STUDENT_CONFIG.jwtAccessTokenExpiry);

    } catch (error) {


        rethrowAppError(error, 'Failed to generate student JWT')

    }

};




// ADMIN Access Token
export const generateAdminAccessToken = (params: IAdminAccessToken): string => {
    try {
        const parsed = AdminAccessTokenSchema.safeParse(params);
        if (!parsed.success) {
            throw new AppError({
                errorType: "Bad Request",
                message: parsed.error.errors.map((err) => err.message).join(", "),
            });
        }

        const { id, email, role } = parsed.data;

        const payload = { id, email, role };

        return signJwt(payload, ADMIN_CONFIG.jwtAccessTokenExpiry);

    } catch (error) {

        rethrowAppError(error, 'Failed to generate student JWT')

    }
};