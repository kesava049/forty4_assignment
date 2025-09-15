const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the full error stack for debugging

  // Check for specific Prisma error codes for better client messages
  if (err.code === 'P2002') {
    const field = err.meta.target[0];
    return res.status(409).json({ error: `The ${field} you entered is already in use.` });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'The requested resource was not found.' });
  }

  // Handle generic validation errors or other known errors
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }
  
  // Default to a generic 500 server error
  res.status(500).json({ error: 'An unexpected error occurred on the server.' });
};

module.exports = errorHandler;