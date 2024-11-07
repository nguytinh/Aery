import { PrismaClient, Prisma } from "@prisma/client";
import UserProfile from "./UserProfile";

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: {
      userName: params.username,
    },
    include: { posts: true },
  });

  return <UserProfile user={user} />;
}
