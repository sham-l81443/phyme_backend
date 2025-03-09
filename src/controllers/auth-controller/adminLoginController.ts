import { AppError } from "@/errors/AppError";
import prisma from "@/lib/prisma";
import { IController } from "@/types";
import { generateJwt } from "@/utils/generateJwt";
import { generateRefreshToken } from "@/utils/generateRefreshToken";
import createSuccessResponse from "@/utils/responseCreator";
import { loginSchema } from "@/validators/authSchema";


const adminLoginController: IController = async (req, res, next) => {

    try {

        const validatedData = loginSchema.parse(req.body)

        console.log({validatedData})

        const admin = await prisma.admin.findFirst({
            where: {
                email: validatedData.email,
                isVerified: true,
            },
        })



        if (!admin) {
            throw new AppError({ errorType: "Not Found", message: "Admin does not exist" })
        }

        console.log({admin})


        const isPasswordValid = validatedData.password === admin.password

        if (!isPasswordValid) {
            throw new AppError({ errorType: "Unauthorized", message: "Invalid credentials" })
        }



        const token = generateJwt({ userId: admin.id, role: 'admin', email: admin?.email })


        console.log({token})


        const refreshToken = await generateRefreshToken(admin.id,'ADMIN')

        console.log({refreshToken})



        res.cookie('adminRefreshToken', refreshToken, {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        })

        res.cookie('adminToken', token, {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 120 * 60 * 1000,
            path: '/'
        })

        res.cookie('adminId', admin.id, {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        })


        const resObj = createSuccessResponse({
            message: 'Logged in successfully', data: {
                isAdmin: true,
               email:admin?.email
            }
        })

        return res.status(200).json(resObj)

    } catch (e) {

        next(e)
    }


}

export default adminLoginController;