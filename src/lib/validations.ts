import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["USER", "AGENT"]).default("USER")
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required")
});

export const profileSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal(""))
});

export const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  city: z.string().min(2),
  type: z.string().min(2),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().int().min(0),
  area: z.coerce.number().int().min(0),
  images: z.string().min(1, "At least one image URL is required"),
  status: z.enum(["FOR_SALE", "FOR_RENT", "SOLD", "RENTED"])
});

export const searchSchema = z.object({
  city: z.string().optional(),
  status: z.enum(["FOR_SALE", "FOR_RENT"]).optional(),
  type: z.string().optional(),
  bedrooms: z.coerce.number().int().optional(),
  bathrooms: z.coerce.number().int().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional()
});

export const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
  receiverId: z.string()
});

export const appointmentSchema = z.object({
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
  propertyId: z.string()
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;