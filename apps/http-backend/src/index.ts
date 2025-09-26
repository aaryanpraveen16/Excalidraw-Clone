import express from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {createUserSchema, signinSchema , createRoomSchema} from "@repo/common/types"
import { prismaClient } from "@repo/db/client";
const app = express();

app.use(express.json());


// validation middleware
function validate(schema: z.ZodTypeAny) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.format() });
      return;
    }
    // attach parsed data to req.body (narrowed)
    req.body = result.data;
    next();
  };
}

app.post("/signup", validate(createUserSchema), async (req, res) => {
  // In a real app you'd create the user and return an id.
  try {
    const user = await prismaClient.user.create({
      // cast as any to avoid strict generated Prisma types in this small example
      data: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        // include optional fields if present
        photoUrl: (req.body as any).photoUrl,
      } as any,
    });

    // return created id
    res.json({ userId: user.id });
  } catch (err) {
    // handle unique constraint errors etc.
    console.error(err);
    res.status(500).json({ error: "Could not create user" });
  }
});

app.post("/signin", validate(signinSchema), (req, res) => {
  const userId = 1;
  const token = jwt.sign({ userId }, JWT_SECRET);
  res.json({ token });
});

app.post("/room", middleware, validate(createRoomSchema), (req, res) => {
  res.json({ userId: req.userId });
});

app.listen(3001);