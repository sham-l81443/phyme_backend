import crypto from 'crypto';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { AppError } from '@/errors/AppError';

async function generateRefreshToken(userId: string,usageType:'ADMIN'|'USER') {

    try {
        const refreshToken = crypto.randomBytes(40).toString('hex');

        const tokenId = crypto.randomBytes(16).toString('hex');

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        const plainToken = `${tokenId}.${refreshToken}`

        if(usageType === 'ADMIN'){
            
            await prisma.refreshToken.create(
                {
                    data: {
                        tokenSecret: hashedRefreshToken,
                        tokenId: tokenId,
                        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                        Admin: { connect: { id: userId } }
                    }
                }
            )
        }else{
            await prisma.refreshToken.create(
                {
                    data: {
                        tokenSecret: hashedRefreshToken,
                        tokenId: tokenId,
                        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                        User: { connect: { id: userId } }
                    }
                }
            )
        }

        

        return { plainToken };


    } catch (error) {

        throw new AppError({ errorType: "Internal Server Error", message: 'Error generating refresh Token' })

    }

}

export { generateRefreshToken }