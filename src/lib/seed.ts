import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Delete existing data first
    await prisma.streak.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({});

    // Create users first
    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'tinhphong@gmail.com',
          password: await bcrypt.hash("Randompass12*", 10),
          name: 'Tinh Nguyen',
          userName: 'tphong',
          bio: 'I love coding!'
        }
      }),

      prisma.user.create({
        data: {
          email: 'etrantalis@gmail.com',
          password: await bcrypt.hash("Randompass563*", 10),
          name: 'Ethan Trantalis',
          userName: 'etrantal',
          bio: 'I like to run!'
        }
      }),

      prisma.user.create({
        data: {
          email: 'javalos@gmail.com',
          password: await bcrypt.hash("Randompass342*", 10),
          name: 'Jesus Avalos',
          userName: 'javalos',
          bio: 'Hack4Impact woo!'
        }
      }),

      prisma.user.create({
        data: {
          email: 'rgertz@gmail.com',
          password: await bcrypt.hash("Randompass456*", 10),
          name: 'Ryan Gertz',
          userName: 'rgertz',
          bio: 'Dual booting Windows and linux!'
        }
      }),

      prisma.user.create({
        data: {
          email: 'jarredondo@gmail.com',
          password: await bcrypt.hash("Randompass382*", 10),
          name: 'Joaquin Arredondo',
          userName: 'jarredondo',
          bio: 'I like art!'
        }
      }),

      prisma.user.create({
        data: {
          email: 'random1@gmail.com',
          password: await bcrypt.hash("Randompass334*", 10),
          name: 'Random User1',
          userName: 'ruser1',
          bio: 'I like to bake!'
        }
      }),

      prisma.user.create({
        data: {
          email: 'random2@gmail.com',
          password: await bcrypt.hash("Randompass286*", 10),
          name: 'Random User2',
          userName: 'ruser2',
          bio: 'I like to swim!'
        }
      }),

      prisma.user.create({
        data: {
          email: 'random3@gmail.com',
          password: await bcrypt.hash("Randompass917*", 10),
          name: 'Random User3',
          userName: 'ruser3',
          bio: 'I like to bike!'
        }
      }),

      prisma.user.create({
        data: {
          email: 'random4@gmail.com',
          password: await bcrypt.hash("Randompass816*", 10),
          name: 'Random User4',
          userName: 'ruser4',
          bio: 'I like to write!'
        }
      }),

      prisma.user.create({
        data: {
          email: 'random5@gmail.com',
          password: await bcrypt.hash("Randompass209*", 10),
          name: 'Random User5',
          userName: 'ruser5',
          bio: 'I like to think!'
        }
      })
    ]);

    // Create categories
    const categories = await Promise.all([
      prisma.category.create({
        data: { id: 1, name: "fitness" }
      }),
      prisma.category.create({
        data: { id: 2, name: "school" }
      }),
      prisma.category.create({
        data: { id: 3, name: "water" }
      }),
      prisma.category.create({
        data: { id: 4, name: "studying" }
      }),
      prisma.category.create({
        data: { id: 5, name: "shower" }
      })
    ]);

    // Create posts and handle streaks in smaller batches
    const postData = [
      {
        title: "First day at the gym!",
        content: "Started my fitness journey today. Feeling motivated! 💪",
        published: true,
        authorId: users[0].id,
        categoryId: 1,
        image: "https://images.unsplash.com/photo-1500468756762-a401b6f17b46?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cnVufGVufDB8fDB8fHwy"
      },

      {
        title: "Study session productive",
        content: "Just finished a great study session for my finals!",
        published: true,
        authorId: users[0].id,
        categoryId: 4,
        image: "https://images.unsplash.com/photo-1471107191679-f26174d2d41e?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },

      {
        title: "Morning run completed",
        content: "5 miles done before breakfast! Starting the day right",
        published: true,
        authorId: users[1].id,
        categoryId: 1,
        image: "https://images.unsplash.com/photo-1662961154170-d2421e29f94b?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },

      {
        title: "Staying hydrated",
        content: "Remember to drink your water everyone! 💧",
        published: true,
        authorId: users[1].id,
        categoryId: 3,
        image: "https://images.unsplash.com/photo-1664714628878-9d2aa898b9e3?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },

      {
        title: "School project complete",
        content: "Finally finished my semester project!",
        published: true,
        authorId: users[2].id,
        categoryId: 2,
        image: "https://images.unsplash.com/photo-1630983358494-96012d838b84?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },

      {
        title: "Post-workout shower",
        content: "Nothing better than a shower after intense training",
        published: true,
        authorId: users[2].id,
        categoryId: 5,
        image: "https://images.unsplash.com/photo-1558211583-ecfebb03748b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },

      {
        title: "Study group session",
        content: "Great study session with friends! 📚",
        published: true,
        authorId: users[3].id,
        categoryId: 4,
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },

      {
        title: "Another water challenge day",
        content: "Keeping up with my daily water intake goals",
        published: true,
        authorId: users[3].id,
        categoryId: 3,
        image: "https://images.unsplash.com/photo-1544003484-3cd181d17917?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2F0ZXJib3R0bGV8ZW58MHx8MHx8fDI%3D"
      },

      {
        title: "Morning routine",
        content: "Starting my day with a cold shower! 🚿",
        published: true,
        authorId: users[4].id,
        categoryId: 5,
        image: "https://images.unsplash.com/photo-1585412727254-46e14627b8df?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },

      {
        title: "Back to school",
        content: "First day of the new semester!",
        published: true,
        authorId: users[4].id,
        categoryId: 2,
        image: "https://images.unsplash.com/photo-1527187162622-535b785f65f5?q=80&w=2009&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },

      {
        title: "Exam prep time",
        content: "Getting ready for finals week",
        published: true,
        authorId: users[5].id,
        categoryId: 4,
        image: "https://images.unsplash.com/photo-1616089804112-f0a475d1b193?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },

      {
        title: "Yoga session",
        content: "Morning yoga to start the day! 🧘‍♀️",
        published: true,
        authorId: users[5].id,
        categoryId: 1,
        image: "https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },

      {
        title: "Swimming laps",
        content: "Did 20 laps today! 🏊‍♂️",
        published: true,
        authorId: users[6].id,
        categoryId: 1,
        image: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },

      {
        title: "Hydration check",
        content: "Already at my daily water goal! 💦",
        published: true,
        authorId: users[6].id,
        categoryId: 3,
        image: "https://images.unsplash.com/photo-1495774539583-885e02cca8c2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },

      {
        title: "School presentation done",
        content: "Nailed my presentation today!",
        published: true,
        authorId: users[7].id,
        categoryId: 2,
        image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },

      {
        title: "Evening workout",
        content: "Late night gym session completed",
        published: true,
        authorId: users[7].id,
        categoryId: 1,
        image: "https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },

      {
        title: "Study break shower",
        content: "Quick refresh between study sessions",
        published: true,
        authorId: users[8].id,
        categoryId: 5,
        image: "https://images.unsplash.com/photo-1554861147-9428266de650?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },

      {
        title: "Finals week begins",
        content: "Time to hit the books! 📚",
        published: true,
        authorId: users[8].id,
        categoryId: 4,
        image: "https://images.unsplash.com/photo-1515615200917-f9623be1d8b0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },

      {
        title: "Water tracking app",
        content: "Found a great app to track water intake",
        published: true,
        authorId: users[9].id,
        categoryId: 3,
        image: "https://images.unsplash.com/photo-1514907707149-eca420f5de51?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },

      {
        title: "Group project meeting",
        content: "Productive meeting with the team",
        published: true,
        authorId: users[9].id,
        categoryId: 2,
        image: "https://images.unsplash.com/photo-1598981457915-aea220950616?q=80&w=2093&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      }

    ];

    // Process posts in batches of 5
    const batchSize = 5;
    for (let i = 0; i < postData.length; i += batchSize) {
      const batch = postData.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (post) => {
          const createdPost = await prisma.post.create({
            data: {
              ...post,
              published: true
            }
          });

          // Handle streak
          await prisma.streak.upsert({
            where: {
              userId_categoryId: {
                userId: post.authorId,
                categoryId: post.categoryId
              }
            },
            update: {
              currentStreak: {
                increment: 1
              }
            },
            create: {
              userId: post.authorId,
              categoryId: post.categoryId,
              currentStreak: 1
            }
          });

          // Update category-user connection
          await prisma.category.update({
            where: { id: post.categoryId },
            data: {
              users: {
                connect: { id: post.authorId }
              }
            }
          });

          return createdPost;
        })
      );
    }

    console.log('Database has been seeded. 🌱');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });