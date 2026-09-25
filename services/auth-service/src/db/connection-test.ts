import { prisma } from "./prisma.js";

async function main() {
    const users = await prisma.user.findMany();

    console.log("Database connection successful");
    console.log("Database users:", users);
}

main()
    .catch((error) =>{
        console.log("Database connection error:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })