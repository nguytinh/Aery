import { ClientUser } from "@/app/interfaces/primsa";
import UserProfile from "./UserProfile";
import { prisma } from "@/app/db";

export default async function Page({
    params,
}: {
    params: { username: string };
}) {
    const user = await prisma.user.findUnique({
        where: {
            userName: params.username,
        },
        select: {
            id: true,
            userName: true,
            bio: true,
            posts: true,
            friends: {
                select: {
                    id: true,
                },
            },
            email: true,
            name: true,
        }
    });

    return <UserProfile user={user as ClientUser} />;
}
