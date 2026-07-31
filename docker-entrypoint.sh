#!/bin/sh
set -e

echo "Waiting for MongoDB..."
while ! node -e "
  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 1500 })
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
" 2>/dev/null; do
  sleep 2
done

echo "MongoDB ready. Running seed..."
node lib/seed.mjs

echo "Starting dev server..."
exec npm run dev
