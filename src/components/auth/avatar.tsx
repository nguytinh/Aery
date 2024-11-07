import { auth } from "@/auth"

export default async function UserAvatar() {
    const session = await auth()

    if (!session?.user) return null

    return (
        <div>
            <h1>Signed in as {session.user.email} | {session.user.name}</h1>
        </div>
    )
}