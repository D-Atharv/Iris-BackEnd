import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma.$connect().then(() => {
    if (prisma){
    console.log("Connected to Prisma");
    }
    else {
        console.log("Error connecting to Prisma");
    }
});


export default prisma;