# Aery

A social media app that helps you build better habits by tracking activities with friends. Stay motivated and consistent with your good habits through community support. With a special focus on tracking daily showers, Aery makes personal hygiene tracking social and engaging.

## About

Aery helps users maintain consistent habits by:
- Connecting with friends to share progress and encourage each other
- Tracking daily shower habits and personal care routines
- Building streaks and celebrating achievements together
- Creating a supportive community around personal wellness

## Development

Follow these steps to set up your development environment:

### Running the Server

Start the development server using Docker:

```bash
cd .devcontainer
docker-compose up
```

### Setting Up the App

1. Install dependencies:
```bash
npm i
```

2. Set up the database:
```bash
npx prisma migrate reset
npx prisma migrate dev
```

3. Create test data:
```bash
npm run seed
```

4. Start the development server:
```bash
npm run dev
```

Your app should now be running at `http://localhost:3000`
