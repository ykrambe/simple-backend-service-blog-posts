import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { sequelize } from "./models";
import { User } from "./models/User";
import { Post } from "./models/Post";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts";
import dotenv from "dotenv";
import chalk from 'chalk';
import { errorHandler } from "./middleware/error";
dotenv.config();

// handle environment variables
const requiredEnv = ["JWT_SECRET", "DB_NAME", "DB_USER", "DB_HOST", "PORT"];
requiredEnv.forEach((env:string) => {
  if (!process.env[env]) {
    throw new Error(`Environment variable ${env} is not set`);
  }
});

// start server
const app = express();
app.use(express.json());

app.use((req: Request, res: Response, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const method = chalk.blue(req.method);
    const url = chalk.white(req.originalUrl);
    const statusColor =
      res.statusCode >= 500 ? chalk.red :
      res.statusCode >= 400 ? chalk.yellow :
      res.statusCode >= 300 ? chalk.cyan :
      chalk.green;

    const status = statusColor(res.statusCode.toString());
    console.log(`${method} ${url} ${status} - ${duration} ms : ${new Date().toUTCString()}`);
  });

  next();
});

// setup api documentation
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API",
      version: "1.0.0",
      description: "Simple REST API for blog posts with JWT authentication"
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./src/routes/*.ts"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// setup init routes
app.get("/", (req:any, res:any) => {
  res.send("Welcome to Blog API. Please check /api-docs for more information.");
});

// sync database
User.hasMany(Post, { foreignKey: "authorId" });
Post.belongsTo(User, { foreignKey: "authorId" });
sequelize.sync().then(() => {
  console.log("Database synchronized");
}).catch((err) => {
  console.error("Error synchronizing database:", err);
  process.exit(1);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// setup routes
app.use(authRoutes);
app.use(postRoutes);
app.use(errorHandler);

export default app;