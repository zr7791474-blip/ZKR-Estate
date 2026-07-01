export type Role = "VISITOR" | "USER" | "AGENT" | "ADMIN";

export type PropertyStatus = "FOR_SALE" | "FOR_RENT" | "SOLD" | "RENTED";

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: Role;
}

export interface PropertyWithAgent {
  id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  status: PropertyStatus;
  featured: boolean;
  agentId: string;
  createdAt: Date;
  agent: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    phone: string | null;
  };
}