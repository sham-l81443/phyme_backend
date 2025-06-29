import { UserRole } from "@/core/constants/ENUMS/user";
import prisma from "@/core/lib/prisma";
import { Prisma } from "@prisma/client";

export class AuthRepository {

    static async findUserByEmailAndRole({ email, role, isVerified }: { email: string, role: UserRole, isVerified?: boolean }) {

        const user = await prisma.user.findFirst({
            where: {
                email,
                role,
                ...(isVerified !== undefined && { isVerified: isVerified }),
            },
            include: {
                class: true
            }
        })

        return user;

    }


    static async createNewStudentWithOtp({ name, email, classId, syllabusId, otpCode }: { name: string, email: string, classId: string, syllabusId: string, otpCode: string }) {

        const tx = prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    registrationType: 'DEFAULT',
                    name,
                    role: UserRole.STUDENT,
                    syllabusId,
                    classId,
                    isTermsAccepted: true
                }
            })

            const otp = await AuthRepository.createNewOtp({ email: user.email, otpCode }, tx)

            return { user, otp }


        })
        return tx

    }


    static async findValidOtpByEmail({ email }: { email: string }) {
        return await prisma.oTP.findFirst({
            where: {
                email,
                isUsed: false,
                expiry: { gte: new Date() }
            }
        });
    }


    static async markOtpAsUsed({ otpId }: { otpId: string }) {

        return await prisma.oTP.update({
            where: { id: otpId },
            data: { isUsed: true },
        });


    }

    static updateStudentPasswordAndVerify({ email, hashedPassword }: { email: string, hashedPassword: string }) {
        return prisma.user.update({
            where: { email: email },
            data: {
                password: hashedPassword,
                isVerified: true,
            },
            select: {
                name: true,
                email: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
                phone: true,
                registrationType: true,
                classId:true,
                id: true,
                syllabusId:true
            },
        });
    };


    static updateStudentPassword({ email, hashedPassword }: { email: string, hashedPassword: string }) {
        return prisma.user.update({
            where: {
                email
            },
            data: {
                password: hashedPassword
            },
            select: {
                name: true,
                email: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
                phone: true,
                registrationType: true,
                class: true,
                id: true,
            },
        })
    }


    static createNewOtp({ email, otpCode }: { email: string, otpCode: string }, tx?: Prisma.TransactionClient) {

        const client = tx ?? prisma;

        return client.oTP.create({
            data: {
                otp: otpCode,
                expiry: new Date(new Date().getTime() + 10 * 60 * 1000),
                email
            }
        })
    }

}