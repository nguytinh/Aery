// src/lib/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Delete existing data first
    await prisma.post.deleteMany({});
    await prisma.user.deleteMany({});

    // Create user
    const user = await prisma.user.create({
      data: {
        email: 'tinhphong04@gmail.com',
        name: 'Tinh Nguyen',
        userName: 'tinhnguy',
        followers: 100,
        following: 100,
        bio: 'I love coding!'
      }
    });

    // Create several posts
    // src/lib/seed.ts
const posts = await Promise.all([
  prisma.post.create({
    data: {
      title: "Hello everyone! 👋",
      content: "This is my first post! I just showered",
      published: true,
      likes: 5,
      authorId: user.id,
      image: "https://picsum.photos/600/400?random=1"  // Direct image URL
    }
  }),
  prisma.post.create({
    data: {
      title: "Hey guys I just went GYM!!! 🚀",
      content: "I hate TRUMP!!!!",
      published: true,
      likes: 10,
      authorId: user.id,
      image: "https://picsum.photos/600/400?random=2"
    }
  }),
  prisma.post.create({
    data: {
      title: "I just went on a run ⚡️",
      content: "Making progress every day!",
      published: true,
      likes: 15,
      authorId: user.id,
      image: "https://picsum.photos/600/400?random=3"
    }
  })
]);

    console.log('Database has been seeded. 🌱');
    console.log('User created:', user);
    console.log('Posts created:', posts);
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });