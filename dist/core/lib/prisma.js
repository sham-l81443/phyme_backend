"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class PrismaService {
    constructor() { }
    static getInstance() {
        if (!PrismaService.instance) {
            PrismaService.instance = new client_1.PrismaClient({
                datasources: {
                    db: {
                        url: process.env.DATABASE_URL,
                    },
                },
            });
            process.on('SIGINT', async () => {
                await PrismaService.instance.$disconnect();
                process.exit(0);
            });
            process.on("SIGTERM", async () => {
                console.log("Received SIGTERM, disconnecting Prisma...");
                await PrismaService.instance.$disconnect();
            });
        }
        return PrismaService.instance;
    }
}
const prisma = PrismaService.getInstance();
exports.default = prisma;
