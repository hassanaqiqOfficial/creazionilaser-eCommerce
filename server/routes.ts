import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema, insertDesignSchema, categories, products } from "@shared/schema";
import { db } from "./db";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import session from "express-session";
import connectPg from "connect-pg-simple";
import bcrypt from "bcrypt";
import session from "express-session";
import connectPg from "connect-pg-simple";

// Configure multer for file uploads
const upload = multer({
  dest: './uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Authentication middleware
const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.session?.userId) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  const pgStore = connectPg(session);
  app.use(session({
    store: new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Seed data on startup
  await seedData();

  // Authentication routes
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        email,
        firstName,
        lastName,
        password: hashedPassword,
      });

      res.status(201).json({ message: "User created successfully", userId: user.id });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set session
      (req.session as any).userId = user.id;
      
      // Return user data (without password)
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get('/api/auth/user', async (req: any, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Return user data (without password)
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Category routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Product routes
  app.get('/api/products', async (req, res) => {
    try {
      const { category } = req.query;
      let products;
      
      if (category) {
        const categoryData = await storage.getCategoryBySlug(category as string);
        if (!categoryData) {
          return res.status(404).json({ message: "Category not found" });
        }
        products = await storage.getProductsByCategory(categoryData.id);
      } else {
        products = await storage.getAllProducts();
      }
      
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Artist routes
  app.get('/api/artists', async (req, res) => {
    try {
      const artists = await storage.getAllArtists();
      res.json(artists);
    } catch (error) {
      console.error("Error fetching artists:", error);
      res.status(500).json({ message: "Failed to fetch artists" });
    }
  });

  // Design routes
  app.get('/api/designs', async (req, res) => {
    try {
      const { artist } = req.query;
      let designs;
      
      if (artist) {
        designs = await storage.getDesignsByArtist(parseInt(artist as string));
      } else {
        designs = await storage.getAllDesigns();
      }
      
      res.json(designs);
    } catch (error) {
      console.error("Error fetching designs:", error);
      res.status(500).json({ message: "Failed to fetch designs" });
    }
  });

  app.get('/api/designs/:id', async (req, res) => {
    try {
      const designId = parseInt(req.params.id);
      const design = await storage.getDesign(designId);
      
      if (!design) {
        return res.status(404).json({ message: "Design not found" });
      }
      
      res.json(design);
    } catch (error) {
      console.error("Error fetching design:", error);
      res.status(500).json({ message: "Failed to fetch design" });
    }
  });

  // Static file serving for uploads
  app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join('./uploads', filename);
    res.sendFile(path.resolve(filepath));
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function seedData() {
  try {
    // Check if data already exists
    const existingCategories = await db.select().from(categories).limit(1);
    if (existingCategories.length > 0) {
      console.log("Database already seeded");
      return;
    }

    console.log("Seeding database...");

    // Seed categories
    const categoriesData = [
      { name: "Custom T-Shirts", slug: "t-shirts", description: "Personalized t-shirts with DTF printing", imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300", sortOrder: 1 },
      { name: "Laser Engraved", slug: "laser-engraved", description: "Precision laser engraving on wood and acrylic", imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300", sortOrder: 2 },
      { name: "Vinyl Stickers", slug: "vinyl-stickers", description: "Custom vinyl decals and stickers", imageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300", sortOrder: 3 },
      { name: "Keychains", slug: "keychains", description: "Custom keychains in various materials", imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300", sortOrder: 4 },
      { name: "Phone Cases", slug: "phone-cases", description: "Custom printed smartphone cases", imageUrl: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300", sortOrder: 5 },
    ];

    // Insert categories using the database instance
    for (const categoryData of categoriesData) {
      await db.insert(categories).values(categoryData);
    }

    // Seed products
    const productsData = [
      { name: "Classic Cotton T-Shirt", description: "100% cotton, available in multiple colors", categoryId: 1, basePrice: "24.99", imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", customizationOptions: { colors: ["white", "black", "blue", "red"], sizes: ["S", "M", "L", "XL"] } },
      { name: "Premium Wooden Plaque", description: "High-quality wood with precision laser engraving", categoryId: 2, basePrice: "39.99", imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", customizationOptions: { sizes: ["Small", "Medium", "Large"], materials: ["Oak", "Pine", "Walnut"] } },
      { name: "Vinyl Sticker Pack", description: "Durable vinyl stickers, weatherproof", categoryId: 3, basePrice: "12.99", imageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400", customizationOptions: { quantities: ["5-pack", "10-pack", "25-pack"] } },
      { name: "Custom Keychain", description: "Personalized keychains in various materials", categoryId: 4, basePrice: "8.99", imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", customizationOptions: { materials: ["Acrylic", "Wood", "Metal"] } },
    ];

    for (const productData of productsData) {
      await db.insert(products).values(productData);
    }

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}