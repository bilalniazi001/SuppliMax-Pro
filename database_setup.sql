-- ================================================================
-- SuppliMax Pro - PostgreSQL Database Setup Script
-- Run this in your PostgreSQL database (e.g., on Supabase / Neon / Aiven)
-- ================================================================

-- ----------------------------------------------------------------
-- 1. USERS TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "users" (
  "id"           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name"         TEXT NOT NULL,
  "email"        TEXT NOT NULL UNIQUE,
  "password"     TEXT NOT NULL,
  "role"         TEXT NOT NULL DEFAULT 'user',
  "age"          INTEGER,
  "phone"        TEXT,
  "address"      TEXT,
  "city"         TEXT,
  "country"      TEXT,
  "postal_code"  TEXT,
  "nationality"  TEXT,
  "cnic"         TEXT,
  "created_at"   TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at"   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- 2. PRODUCTS TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "products" (
  "id"                   TEXT PRIMARY KEY,
  "name"                 TEXT NOT NULL,
  "category"             TEXT NOT NULL,
  "price"                DOUBLE PRECISION NOT NULL,
  "rating"               DOUBLE PRECISION NOT NULL,
  "image_url"            TEXT NOT NULL,
  "description"          TEXT NOT NULL,
  "cost"                 DOUBLE PRECISION NOT NULL,
  "quantity_in_stock"    INTEGER NOT NULL,
  "size"                 TEXT DEFAULT 'One Size',
  "color"                TEXT DEFAULT '',
  "on_sale"              BOOLEAN DEFAULT FALSE,
  "discount_percentage"  INTEGER DEFAULT 0,
  "is_new_arrival"       BOOLEAN DEFAULT FALSE,
  "is_in_stock"          BOOLEAN DEFAULT TRUE,
  "is_featured"          BOOLEAN DEFAULT FALSE,
  "is_exclusive"         BOOLEAN DEFAULT FALSE,
  "created_at"           TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at"           TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- 3. SEED: Default Admin User
-- (password is stored as plain text for now - change it after login)
-- ----------------------------------------------------------------
INSERT INTO "users" ("name", "email", "password", "role", "age", "phone", "address", "city", "country", "postal_code", "nationality", "cnic")
VALUES (
  'Admin User',
  'admin@supplimax.com',
  'admin123',
  'admin',
  30,
  '+923001234567',
  '123 Admin Street, Lahore',
  'Lahore',
  'Pakistan',
  '54000',
  'Pakistani',
  '12345-6789012-3'
)
ON CONFLICT (email) DO NOTHING;

-- ----------------------------------------------------------------
-- 4. SEED: Sample Products
-- ----------------------------------------------------------------
INSERT INTO "products" ("id", "name", "category", "price", "rating", "image_url", "description", "cost", "quantity_in_stock", "size", "color", "on_sale", "discount_percentage", "is_new_arrival", "is_in_stock", "is_featured", "is_exclusive")
VALUES
  (
    'sample001',
    'Whey Protein Premium',
    'Protein',
    59.99, 4.8,
    'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500',
    'High-quality whey protein for muscle recovery and growth. Contains 25g protein per serving.',
    35.00, 50, '2 lbs', 'Chocolate',
    TRUE, 15, FALSE, TRUE, TRUE, FALSE
  ),
  (
    'sample002',
    'Pre-Workout Energizer',
    'Pre Workout',
    39.99, 4.5,
    'https://images.unsplash.com/photo-1594736797933-d0ea3ff8db41?w=500',
    'Advanced pre-workout formula for enhanced energy and focus during training sessions.',
    22.00, 75, '30 servings', 'Fruit Punch',
    FALSE, 0, TRUE, TRUE, FALSE, TRUE
  ),
  (
    'sample003',
    'Creatine Monohydrate',
    'Creatine',
    29.99, 4.7,
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500',
    'Pure creatine monohydrate for maximum strength and power output during training.',
    15.00, 100, '500g', 'Unflavored',
    FALSE, 0, FALSE, TRUE, TRUE, FALSE
  ),
  (
    'sample004',
    'BCAA Recovery Blend',
    'BCAA',
    34.99, 4.3,
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
    'Essential amino acids blend for faster muscle recovery and reduced soreness.',
    20.00, 60, '300g', 'Watermelon',
    TRUE, 10, TRUE, TRUE, FALSE, TRUE
  )
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------
-- DONE! Verify the tables:
-- SELECT * FROM users;
-- SELECT * FROM products;
-- ----------------------------------------------------------------
