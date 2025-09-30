gtn-shop-app
This is a Next.js project bootstrapped with create-next-app.
Getting Started
First, run the development server:
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

Open http://localhost:3000 with your browser to see the result.
You can start editing the page by modifying app/page.js. The page auto-updates as you edit the file.
This project uses next/font to automatically optimize and load Geist, a new font family for Vercel.
Learn More
To learn more about Next.js, take a look at the following resources:

Next.js Documentation - learn about Next.js features and API.
Learn Next.js - an interactive Next.js tutorial.

You can check out the Next.js GitHub repository - your feedback and contributions are welcome!
Deploy on Vercel
The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.
Check out our Next.js deployment documentation for more details.
Build and Run with Docker
This project includes Docker configurations for both development and production environments. Follow the instructions below to build and run the application using Docker.
Prerequisites

Install Docker and Docker Compose on your machine.
Ensure ports 3000 (for development) and 3001 (for production) are not in use.

Directory Structure
The project includes the following Docker-related files:

.dockerignore: Excludes unnecessary files from the Docker build context.
Dockerfile: Defines the production build process.
Dockerfile.dev: Defines the development build process.
docker-compose.dev.yaml: Configures the development environment with hot-reloading.
docker-compose.prod.yaml: Configures the production environment.

Development Environment
The development environment uses hot-reloading to reflect code changes instantly.

Build the development image:
docker compose -f docker-compose.yaml build --no-cache


Run the development container:
docker-compose -f docker-compose.yaml -p gtnshop-app up --build -d


Access the application:

Open http://localhost:3000 in your browser.
Edit files in the project directory (e.g., app/page.js), and changes will automatically reload.


Stop the container:
docker compose -f docker-compose.dev.yaml down



Production Environment
The production environment builds an optimized image for deployment.

Build the production image:
docker-compose -f docker-compose.prod.yaml up --build -d


Run the production container:
docker-compose -f docker-compose.prod.yaml -p gtnshop_prod up --build -d


Access the application:

Open http://localhost:3001 in your browser.


Stop the container:
docker compose -f docker-compose.prod.yaml down

Running Both Environments Simultaneously
To run both development and production environments at the same time:

Start the development environment in one terminal:
docker compose -f docker-compose.dev.yaml up -d


Start the production environment in another terminal:
docker compose -f docker-compose.prod.yaml up -d


Access the applications:

Development: http://localhost:3000
Production: http://localhost:3001


Stop both environments:
docker compose -f docker-compose.dev.yaml down
docker compose -f docker-compose.prod.yaml down



Troubleshooting

Container exits immediately: Check logs with docker logs gtnshop-frontend (production) or docker logs gtnshop-frontend-dev (development) to diagnose issues.
Port conflicts: Ensure ports 3000 and 3001 are not in use. Check with:netstat -aon | findstr :3000
netstat -aon | findstr :3001


Build errors: Run npm run build locally to verify the Next.js build process:npm install
npm run build


For more details, refer to the Next.js Documentation or check the Docker configuration files in the project root.