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

  console.log("user", user);
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {!user && (
        <div className="place-self-center">
          Sorry, could not find this user!
        </div>
      )}
      {user && (
        <>
          <div className="flex flex-col items-center space-y-4">
            <Image
              className="w-32 h-32 rounded-full object-cover"
              src="https://xsgames.co/randomusers/avatar.php?g=pixel"
              alt="Profile"
              width={128}
              height={128}
            />
            <h1 className="text-3xl font-semibold">{user.userName}</h1>
            <div className="flex space-x-8">
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
              <p className="text-gray-700">{user.bio}</p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-6 text-center">Posts</h2>
            <div className="grid grid-cols-3 gap-4">
              {user.posts.map((post) => {
                return(
                <div className="w-full h-48 rounded-lg" key={post.content}>{post.title}</div>
                )
              })}
              {/* <div className="w-full h-48 bg-gray-200 rounded-lg"></div> */}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
