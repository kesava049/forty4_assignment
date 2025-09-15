const express = require("express");
const { body, validationResult } = require('express-validator'); // 1. Import validation tools
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// 2. Define validation rules in a reusable array
const userValidationRules = [
  body('name').trim().notEmpty().withMessage('Name cannot be empty.'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address.'),
  body('phone').optional({ checkFalsy: true }).trim().isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits.'),
  body('address.zipcode').optional({ checkFalsy: true }).trim().isLength({ min: 6, max: 6 }).isNumeric().withMessage('Zipcode must be 6 digits.')
];

// 3. Create a middleware to handle the result of the validation
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  // To make the error more readable on the frontend, we'll format it
  const errorMessages = errors.array().map(err => err.msg);
  return res.status(422).json({ error: errorMessages.join(', ') });
};

// --- ROUTES ---

// GET /api/users - Get all users
router.get("/", async (req, res) => {
  const users = await prisma.user.findMany({ include: { address: true } });
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

// POST /api/users - Create a new user with validation
router.post("/", userValidationRules, validate, async (req, res) => {
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

// PUT /api/users/:id - Update a user with validation
router.put("/:id", userValidationRules, validate, async (req, res) => {
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
  await prisma.user.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

module.exports = router;