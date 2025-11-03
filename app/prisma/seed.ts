// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Hash admin password
  const adminPassword = await bcrypt.hash("admin123", 10);

  // Create or update admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@clinic.com" },
    update: {}, // do nothing if exists
    create: {
      name: "Admin User",
      email: "admin@clinic.com",
      password: adminPassword,
      role: "ADMIN", // make sure it matches your Role enum in Prisma
    },
  });

  console.log("✅ Admin user created:", admin.email);
  console.log("\n📝 Login Credentials:");
  console.log("Admin: admin@clinic.com / admin123");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
