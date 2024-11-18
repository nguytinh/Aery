interface ClientUser {
    id: number;
    email: string;
    name?: string | null;
    userName?: string | null;
    bio?: string | null;
    posts: Post[];
    friends: ClientUser[];
}

interface Session {
    sessionToken: string;
    userId: number;
    expires: Date;
    user: ClientUser;
    createdAt: Date;
    updatedAt: Date;
}

interface Post {
    id: number;
    title: string;
    content?: string | null;
    published: boolean;
    authorId: number;
    image?: string | null;
}

export type { ClientUser, Session, Post };
