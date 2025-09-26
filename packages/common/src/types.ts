import z from "zod";

export const createUserSchema = z.object({
username: z.string().min(3).max(20),
password: z.string(),
name:z.string()
})

export const signinSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(1),
});

export const createRoomSchema = z.object({
  roomName: z.string().min(3).max(20),
});