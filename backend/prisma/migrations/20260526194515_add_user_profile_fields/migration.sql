-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "tanggal_lahir" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "usage_reason" TEXT;
