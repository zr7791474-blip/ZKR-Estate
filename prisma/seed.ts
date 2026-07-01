import { PrismaClient, Role, PropertyStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  // =====================
  // ADMIN
  // =====================
  const admin = await prisma.user.upsert({
    where: {
      email: "admin@zkrestate.com",
    },
    update: {},
    create: {
      email: "admin@zkrestate.com",
      name: "ZKR Admin",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log(`✅ Admin: ${admin.email}`);


  // =====================
  // AGENT
  // =====================
  const agent = await prisma.user.upsert({
    where: {
      email: "agent@zkrestate.com",
    },
    update: {},
    create: {
      email: "agent@zkrestate.com",
      name: "Zakaria Estate Agent",
      password: hashedPassword,
      role: Role.AGENT,
    },
  });

  console.log(`✅ Agent: ${agent.email}`);


  // =====================
  // NORMAL USER
  // =====================
  const user = await prisma.user.upsert({
    where: {
      email: "user@zkrestate.com",
    },
    update: {},
    create: {
      email: "user@zkrestate.com",
      name: "Normal User",
      password: hashedPassword,
      role: Role.USER,
    },
  });

  console.log(`✅ User: ${user.email}`);


  // =====================
  // PROPERTIES
  // =====================

  const propertiesData = [
  {
    title: "Skyline Luxury Penthouse",
    description:
      "Ultra-modern penthouse with panoramic city skyline views, floor-to-ceiling windows, and premium smart home features.",
    price: 3200000,
    city: "Casablanca",
    type: "Penthouse",
    bedrooms: 4,
    bathrooms: 3,
    area: 300,
    images: ["/properties/property1.jpg"],
    status: PropertyStatus.FOR_SALE,
    featured: true,
  },
  {
    title: "Ocean Breeze Modern Villa",
    description:
      "Elegant contemporary villa located near the coast with open spaces, private garden, and luxury finishes.",
    price: 2800000,
    city: "Tangier",
    type: "Villa",
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    images: ["/properties/property2.jpg"],
    status: PropertyStatus.FOR_SALE,
    featured: true,
  },
  {
    title: "Downtown Elite Apartment",
    description:
      "Premium apartment in the heart of the city featuring modern design, balcony views, and high-end amenities.",
    price: 1900000,
    city: "Rabat",
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 170,
    images: ["/properties/property3.jpg"],
    status: PropertyStatus.FOR_SALE,
    featured: true,
  },
  {
    title: "Urban Signature Loft",
    description:
      "Industrial-style loft with open layout, high ceilings, and modern urban lifestyle design.",
    price: 1650000,
    city: "Casablanca",
    type: "Loft",
    bedrooms: 2,
    bathrooms: 2,
    area: 150,
    images: ["/properties/property4.jpg"],
    status: PropertyStatus.FOR_SALE,
    featured: true,
  },
  {
    title: "Green Valley Family Home",
    description:
      "Spacious family home in a calm residential area with green surroundings and modern comfort.",
    price: 2100000,
    city: "Marrakech",
    type: "House",
    bedrooms: 4,
    bathrooms: 3,
    area: 380,
    images: ["/properties/property5.jpg"],
    status: PropertyStatus.FOR_SALE,
    featured: true,
  },
  {
    title: "Crystal Bay Waterfront Condo",
    description:
      "Luxury waterfront condo with sea views, resort-style amenities, and premium living experience.",
    price: 2600000,
    city: "Agadir",
    type: "Condo",
    bedrooms: 3,
    bathrooms: 2,
    area: 200,
    images: ["/properties/property6.jpg"],
    status: PropertyStatus.FOR_SALE,
    featured: true,
  },
  {
    title: "Prestige Business Apartment",
    description:
      "High-end apartment ideal for professionals, located near business districts with modern facilities.",
    price: 1750000,
    city: "Rabat",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 140,
    images: ["/properties/property7.jpg"],
    status: PropertyStatus.FOR_SALE,
    featured: true,
  },
  {
    title: "Sunset Hill Luxury Residence",
    description:
      "Exclusive residence with breathtaking sunset views, spacious interiors, and luxury finishes.",
    price: 2950000,
    city: "Casablanca",
    type: "Villa",
    bedrooms: 5,
    bathrooms: 4,
    area: 420,
    images: ["/properties/property8.jpg"],
    status: PropertyStatus.FOR_SALE,
    featured: true,
  },
  {
    title: "Modern Urban Studio Plus",
    description:
      "Compact yet stylish studio designed for modern urban living with smart space optimization.",
    price: 850000,
    city: "Tangier",
    type: "Studio",
    bedrooms: 1,
    bathrooms: 1,
    area: 60,
    images: ["/properties/property9.jpg"],
    status: PropertyStatus.FOR_RENT,
    featured: true,
  },
];


  for (const property of propertiesData) {
    await prisma.property.create({
      data: {
        ...property,
        agentId: agent.id,
      },
    });

    console.log(`✅ Property created: ${property.title}`);
  }


  console.log("🎉 Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });