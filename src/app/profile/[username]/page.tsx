import Image from "next/image";
import { PrismaClient, Prisma } from "@prisma/client";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  type UserWithPosts = Prisma.UserGetPayload<{
    include: { posts: true };
  }>;

  const prisma = new PrismaClient();
  const username = (await params).username;
  console.log(username);

  const user: UserWithPosts | null = await prisma.user.findUnique({
    where: {
      userName: username,
    },
    include: { posts: true },
  });
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {!user && (
        <div className="flex justify-center items-center h-64 text-gray-700">
          Sorry, could not find this user!
        </div>
      )}
      {user && (
        <>
          <div className="flex flex-col items-center space-y-6">
            <Image
              className="w-32 h-32 rounded-full object-cover"
              src="https://xsgames.co/randomusers/avatar.php?g=pixel"
              alt="Profile"
              width={128}
              height={128}
            />
            <div className="w-full flex items-center justify-center space-x-4">
              <h1 className="text-3xl font-semibold">{user.userName}</h1>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
                Follow
              </button>
            </div>
            <div className="flex space-x-12">
              <div className="text-center">
                <span className="block text-xl font-bold">
                  {user.posts.length}
                </span>
                <span className="text-gray-600">Posts</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold">
                  {user.followers}
                </span>
                <span className="text-gray-600">Followers</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold">
                  {user.following}
                </span>
                <span className="text-gray-600">Following</span>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-medium">{user.name}</h2>
              <p className="border px-4 py-1 text-gray-700 rounded-md">
                {user.bio}
              </p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-6 text-center">Posts</h2>
            {user.posts.length === 0 && (
              <div className="flex justify-center text-gray-500">
                None so far!
              </div>
            )}
            <div className="grid grid-cols-3 gap-6">
              {user.posts.map((post) => (
                <div
                  key={post.id}
                  className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-700"
                >
                  {post.title}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
