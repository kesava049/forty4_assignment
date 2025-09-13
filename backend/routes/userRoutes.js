import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// 1. Get all users
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { address: true },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Get a single user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { address: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Create a new user
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, company, address } = req.body;

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        company,
        address: address
          ? {
              create: {
                city: address.city,
                zipcode: address.zipcode,
                lat: address.lat,
                lng: address.lng,
              },
            }
          : undefined,
      },
      include: { address: true },
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Update a user
router.put("/:id", async (req, res) => {
  try {
    const { name, email, phone, company, address } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        name,
        email,
        phone,
        company,
        address: address
          ? {
              upsert: {
                create: {
                  city: address.city,
                  zipcode: address.zipcode,
                  lat: address.lat,
                  lng: address.lng,
                },
                update: {
                  city: address.city,
                  zipcode: address.zipcode,
                  lat: address.lat,
                  lng: address.lng,
                },
              },
            }
          : undefined,
      },
      include: { address: true },
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Delete a user
router.delete("/:id", async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;