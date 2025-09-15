const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/users - Get all users
router.get("/", async (req, res) => {
  const users = await prisma.user.findMany({
    include: { address: true },
  });
  res.json(users);
});

// GET /api/users/:id - Get a single user by ID
router.get("/:id", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    include: { address: true },
  });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

// POST /api/users - Create a new user
router.post("/", async (req, res) => {
  const { name, email, phone, company, address } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required fields." });
  }

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      company,
      address: address
        ? {
            create: {
              street: address.street,
              city: address.city,
              zipcode: address.zipcode,
              lat: parseFloat(address.lat) || 0,
              lng: parseFloat(address.lng) || 0,
            },
          }
        : undefined,
    },
    include: { address: true },
  });

  res.status(201).json(newUser);
});

// PUT /api/users/:id - Update a user
router.put("/:id", async (req, res) => {
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
                street: address.street,
                city: address.city,
                zipcode: address.zipcode,
                lat: parseFloat(address.lat) || 0,
                lng: parseFloat(address.lng) || 0,
              },
              update: {
                street: address.street,
                city: address.city,
                zipcode: address.zipcode,
                lat: parseFloat(address.lat) || 0,
                lng: parseFloat(address.lng) || 0,
              },
            },
          }
        : undefined,
    },
    include: { address: true },
  });

  res.json(updatedUser);
});

// DELETE /api/users/:id - Delete a user
router.delete("/:id", async (req, res) => {
  await prisma.user.delete({
    where: { id: req.params.id },
  });
  res.status(204).send();
});

module.exports = router;