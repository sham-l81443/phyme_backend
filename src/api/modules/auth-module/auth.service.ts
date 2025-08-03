import { UserRole, } from "../../../core/constants/ENUMS/user"
import { AppError } from "../../../core/utils/errors/AppError"
import { rethrowAppError } from "../../../core/utils/errors/rethrowError";
import bcrypt from "bcrypt";
import { AuthRepository } from "./auth.repository";
import OTPService from "../../../core/services/OTPService";
import { generateAdminAccessToken, generateRefreshToken, generateStudentAccessToken } from "../../../core/utils/jwt";
import { AuthValidation } from "./auth.validation";
import { setAccessTokenCookie, setRefreshTokenCookie } from "../../../core/utils/cookies";


export class AuthService {

    static async studentLoginService({ email, password }: { email: string, password: string }) {

        try {

            const student = await AuthRepository.findUserByEmailAndRole({ email, role: UserRole.STUDENT, isVerified: true })

            if (!student) {
                throw new AppError({ errorType: "Not Found", message: 'Invalid credentials or not verified' })

            }

            if (student?.password) {
                const isPasswordValid = await bcrypt.compare(password, student.password);

                if (!isPasswordValid) {
                    throw new AppError({ errorType: "Unauthorized", message: 'Invalid credentials' })
                }
            }



            const { password: _, ...safeStudent } = student;

            return safeStudent;

        } catch (error) {
            rethrowAppError(error, 'Failed to login student')
        }
    }


    static async studentRegisterService({ name, email, classId, syllabusId }: { name: string, email: string, classId: string, syllabusId: string }) {

        try {

            const user = await AuthRepository.findUserByEmailAndRole({ email, role: UserRole.STUDENT})

            if (user && user.isVerified) {

                throw new AppError({ errorType: 'Bad Request', message: 'User with this email already exist' })
            }


            // send otp

            const otpResponse = await OTPService.sendOTPEmail(email)


           
            // handle if sending otp failed
            if (!otpResponse.success) {

                throw new AppError({ errorType: 'Internal Server Error', message: 'Failed to send OTP' })

            }

            if(user && !user?.isVerified){

                await AuthRepository.createNewOtp({ email, otpCode: otpResponse.otp })

                return { otpResponse, user }
            }


            const transaction = await AuthRepository.createNewStudentWithOtp({ name, email, classId, syllabusId, otpCode: otpResponse.otp })

            if (!transaction) {
                throw new AppError({ errorType: 'Internal Server Error', message: 'Failed to create user' })
            }


            return transaction;




        } catch (error) {

            rethrowAppError(error, 'Failed to register student')
        }

    }


    static async verifyStudentService({ validatedData }: { validatedData: { email: string, otp: string, password: string } }) {


        try {

            const otpData = await AuthRepository.findValidOtpByEmail({ email: validatedData.email })

            if (!otpData || otpData.otp !== validatedData.otp) {
                throw new AppError({ errorType: "Unauthorized", message: "Please provide a valid OTP" });
            }


            await AuthRepository.markOtpAsUsed({ otpId: otpData.id })

            const hashedPassword = await bcrypt.hash(validatedData.password, 10);

            const updatedUser = await AuthRepository.updateStudentPasswordAndVerify({ email: validatedData.email, hashedPassword: hashedPassword })

            if (!updatedUser) {
                throw new AppError({ errorType: "Bad Request", message: "Failed to verify user" });
            }

            const accessToken = generateStudentAccessToken({
                classId: updatedUser.classId || '',
                email: updatedUser.email,
                id: updatedUser.id,
                role: UserRole.STUDENT,
                syllabusId: updatedUser.syllabusId || '',
            });

            const refreshToken = await generateRefreshToken(updatedUser.id, UserRole.STUDENT);

            return {
                updatedUser,
                accessToken,
                refreshToken: refreshToken.plainToken,
            };

        } catch (error) {

            rethrowAppError(error, 'Failed to verify student')
        }

    }


    static async resetStudentPassword({ body }: { body: { email: string, otp: string, password: string } }) {

        try {

            const validatedData = AuthValidation.verifyEmailOtpPasswordSchema.safeParse(body)


            if (!validatedData.success) {
                throw new AppError({ errorType: "Bad Request", message: "Invalid request body", data: validatedData.error })
            }

            const { email, password, otp } = validatedData?.data

            const user = await AuthRepository.findUserByEmailAndRole({ email, role: UserRole.STUDENT, isVerified: true })

            if (!user) {
                throw new AppError({ errorType: "Not Found", message: 'Invalid credentials or not verified' })
            }

            const otpData = await AuthRepository.findValidOtpByEmail({ email })


            if (!otpData || otpData.otp !== otp) {
                throw new AppError({ errorType: "Unauthorized", message: "Please provide a valid OTP" });
            }


            const hashedPassword = await bcrypt.hash(password, 10);

            const updatedUser = AuthRepository.updateStudentPassword({ email, hashedPassword })

            return updatedUser

        } catch (error) {
            rethrowAppError(error, 'failed to reset passWord')
        }

    }


    static async getOtp({ body }: { body: { email: string } }) {

        const { email } = body

        try {

            const validatedData = AuthValidation.verifyEmailSchema.safeParse({ email })


            if (!validatedData.success) {
                throw new AppError({ errorType: "Bad Request", message: "Invalid request body", data: validatedData.error })
            }


            const user = await AuthRepository.findUserByEmailAndRole({ email, role: UserRole.STUDENT, isVerified: true })

            if (!user) {
                throw new AppError({ errorType: 'Not Found', message: 'No user found with this email' })
            }

            const otpResponse = await OTPService.sendOTPEmail(email)

            await AuthRepository.createNewOtp({ email, otpCode: otpResponse.otp })

            // handle if sending otp failed
            if (!otpResponse.success) {

                throw new AppError({ errorType: 'Internal Server Error', message: 'Failed to send OTP' })

            }

            return { otpResponse, user }


        } catch (error) {
            rethrowAppError(error, 'failed to get otp')
        }
    }


    static async adminLoginService({ body }: { body: { email: string, password: string } }) {
        try {

            const validatedData = AuthValidation.loginSchema.safeParse(body)

            if (!validatedData.success) {
                throw new AppError({ errorType: "Bad Request", message: "Invalid request body", data: validatedData.error })
            }

            const { email, password } = validatedData?.data

            const admin = await AuthRepository.findUserByEmailAndRole({ email, role: UserRole.ADMIN, isVerified: true })

            if (!admin) {
                throw new AppError({ errorType: "Not Found", message: 'Invalid credentials or not verified' })

            }

            if (admin?.password) {
                const isPasswordValid = await bcrypt.compare(password, admin.password);

                if (!isPasswordValid) {
                    throw new AppError({ errorType: "Unauthorized", message: 'Invalid credentials' })
                }
            }


            const token = generateAdminAccessToken({ id: admin.id, role: UserRole.ADMIN, email: admin.email });
            const refreshToken = await generateRefreshToken(admin.id, UserRole.ADMIN);


            if (!refreshToken) {
                throw new AppError({ errorType: 'Internal Server Error', message: 'Failed to generate refresh token' });
            }


            const { password: _, ...safeAdmin } = admin;

            return { admin: safeAdmin, token, refreshToken };

        } catch (error) {

            rethrowAppError(error, 'failed to login admin')
        }
    }

}