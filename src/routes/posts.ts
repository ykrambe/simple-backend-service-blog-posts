import { Router, Response, Request } from "express";
import { Post } from "../models/Post";
import { authenticateJWT, AuthRequest } from "../middleware/auth";
import { body, validationResult } from "express-validator";
import { apiResponses } from "../helper/utils";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Blog post management
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 message:
 *                   type: string
 */
router.get("/posts", async (req: Request, res: Response) => {
  const posts = await Post.findAll();
  res.json(apiResponses(true, posts, "Posts fetched successfully"));
});

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *                 message:
 *                   type: string
 *       404:
 *         description: Post not found
 */
router.get("/posts/:id", async (req: Request, res: Response) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) return res.status(404).json(apiResponses(false, null, "Post not found"));
  res.json(apiResponses(true, post, "Post fetched successfully"));
});

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a post (authenticated)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: 'null'
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: 'null'
 *                 message:
 *                   type: string
 */
router.post("/posts",
  [
    body("content").notEmpty().withMessage("Content is required"),
  ],
  authenticateJWT,
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(apiResponses(false, null, "Invalid input", errors.array()));
    }

    if (!req.user && !req.user!.id) {
      return res.status(401).json(apiResponses(false, null, "Unauthorized"));
    }

    const { content } = req.body;
    const authorId = req.user!.id;
    const post = await Post.create({ content, authorId });
    console.log("🚀 ~ post:", post.toJSON())
    
    res.status(201).json(apiResponses(true, post, "Post created successfully"));
});

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post (authenticated, author only)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: 'null'
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: 'null'
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: 'null'
 *                 message:
 *                   type: string
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: 'null'
 *                 message:
 *                   type: string
 *       404:
 *         description: Post not found
 */
router.put("/posts/:id", 
  [
    body("content").notEmpty().withMessage("Content is required"),
  ],
  authenticateJWT,
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(apiResponses(false, null, "Invalid input", errors.array()));
    }
    let post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json(apiResponses(false, null, "Post not found"));
    if (post.toJSON().authorId !== req.user!.id) return res.status(403).json(apiResponses(false, null, "Forbidden"));


    try {
      const [updatePost] = await Post.update({ content: req.body.content }, {
        where: {
          id: req.params.id
        }
      });
      if (updatePost === 0) return res.status(404).json(apiResponses(false, null, "Post not found"));
      post = await Post.findByPk(req.params.id);
      if (!post) return res.status(404).json(apiResponses(false, null, "Post not found"));
    } catch (error) {
      console.error(error);
      return res.status(500).json(apiResponses(false, null, "Internal server error"));
    }
    
    res.json(apiResponses(true, post.toJSON(), "Post updated successfully"));
});

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post (authenticated, author only)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Post deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: 'null'
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: 'null'
 *                 message:
 *                   type: string
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: 'null'
 *                 message:
 *                   type: string
 *       404:
 *         description: Post not found
 */
router.delete("/posts/:id", authenticateJWT, async (req: AuthRequest, res: Response) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) return res.status(404).json(apiResponses(false, null, "Post not found"));
  console.log(post.toJSON().authorId, req.user!.id);
  if (post.toJSON().authorId !== req.user!.id) return res.status(403).json(apiResponses(false, null, "Forbidden"));
  await post.destroy();
  res.status(204).json(apiResponses(true, null, "Post deleted successfully"));
});

export default router;