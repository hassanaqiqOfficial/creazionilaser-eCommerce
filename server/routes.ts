import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema, insertDesignSchema, categories, products, users } from "@shared/schema";
import { db } from "./db";
import { sql, eq } from "drizzle-orm";
import multer from "multer";
import path from "path";
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
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false, // Don't recreate table/index
    tableName: 'sessions',
  });
  
  // Suppress error logging for existing index
  const originalLog = console.error;
  console.error = (...args) => {
    if (args[0]?.message?.includes('IDX_session_expire') || 
        args[0]?.toString?.()?.includes('IDX_session_expire')) {
      return; // Ignore this specific error
    }
    originalLog.apply(console, args);
  };
  
  app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to false for development
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    name: 'connect.sid'
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

      // Create user (first user becomes admin)
      const userCount = await db.select({ count: sql`count(*)` }).from(users);
      const isFirstUser = (userCount[0]?.count || 0) === 0;
      
      const user = await storage.createUser({
        email,
        firstName,
        lastName,
        password: hashedPassword,
        userType: isFirstUser ? 'admin' : 'customer',
      });

      // Auto-login the user after successful signup
      (req.session as any).userId = user.id;
      console.log("Signup - Set session userId:", user.id);
      
      // Save session explicitly
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
        } else {
          console.log("Session saved successfully");
        }
      });
      
      // Return user data (without password) and success message
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ 
        message: isFirstUser ? "Admin account created successfully" : "User created successfully", 
        ...userWithoutPassword 
      });
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
      console.log("Login - Set session userId:", user.id);
      
      // Save session explicitly
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
        } else {
          console.log("Session saved successfully");
        }
      });
      
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

  app.post('/api/artists', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const artistData = { ...req.body, userId };
      const artist = await storage.createArtist(artistData);
      res.status(201).json(artist);
    } catch (error) {
      console.error("Error creating artist:", error);
      res.status(500).json({ message: "Failed to create artist profile" });
    }
  });

  app.get('/api/artists/me', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const artist = await storage.getArtistByUserId(userId);
      res.json(artist);
    } catch (error) {
      console.error("Error fetching artist profile:", error);
      res.status(500).json({ message: "Failed to fetch artist profile" });
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

  app.post('/api/designs', isAuthenticated, upload.single('image'), async (req: any, res) => {
    try {
      const userId = req.session.userId;
      
      // Get or create artist profile
      let artist = await storage.getArtistByUserId(userId);
      if (!artist) {
        artist = await storage.createArtist({
          userId,
          bio: "New artist",
          specialty: "General",
          isVerified: false,
          commissionRate: "0.30",
        });
      }

      const designData = {
        artistId: artist.id,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        tags: req.body.tags ? JSON.parse(req.body.tags) : [],
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      };

      const design = await storage.createDesign(designData);
      res.status(201).json(design);
    } catch (error) {
      console.error("Error creating design:", error);
      res.status(500).json({ message: "Failed to create design" });
    }
  });

  // Cart routes (authenticated)
  app.get('/api/cart', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const cartItems = await storage.getCartItems(userId);
      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post('/api/cart', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const cartData = { ...req.body, userId };
      const item = await storage.addToCart(cartData);
      res.status(201).json(item);
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.put('/api/cart/:id', isAuthenticated, async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const { quantity } = req.body;
      await storage.updateCartItem(itemId, quantity);
      res.json({ message: "Cart item updated" });
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete('/api/cart/:id', isAuthenticated, async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      await storage.removeFromCart(itemId);
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  // Admin routes (protected)
  const isAdmin = async (req: any, res: any, next: any) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || (user as any).userType !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      req.user = user; // Add user to request object
      next();
    } catch (error) {
      console.error("Admin auth error:", error);
      return res.status(500).json({ message: "Authentication error" });
    }
  };

  app.get('/api/admin/stats', isAdmin, async (req, res) => {
    try {
      const totalUsers = await db.select({ count: sql`count(*)` }).from(users);
      const totalProducts = await db.select({ count: sql`count(*)` }).from(products);
      const totalCategories = await db.select({ count: sql`count(*)` }).from(categories);
      
      res.json({
        totalUsers: totalUsers[0]?.count || 0,
        totalProducts: totalProducts[0]?.count || 0,
        totalCategories: totalCategories[0]?.count || 0,
        totalDesigns: 0, // Will implement when designs table exists
        totalArtists: 0,
        totalOrders: 0,
        totalRevenue: 0,
        newUsersThisWeek: 0,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get('/api/admin/users', isAdmin, async (req, res) => {
    try {
      const allUsers = await db.select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        userType: users.userType,
        createdAt: users.createdAt,
      }).from(users);
      
      res.json(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/admin/products', isAdmin, async (req, res) => {
    try {
      const allProducts = await db.select({
        id: products.id,
        name: products.name,
        description: products.description,
        basePrice: products.basePrice,
        categoryId: products.categoryId,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id));
      
      // Disable caching to ensure fresh data
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      res.json(allProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post('/api/admin/products', isAdmin, async (req, res) => {
    try {
      const { name, description, categoryId, basePrice, imageUrl, customizationOptions } = req.body;
      
      if (!name || !categoryId || !basePrice) {
        return res.status(400).json({ message: "Name, category, and price are required" });
      }
      
      const [product] = await db.insert(products).values({
        name,
        description: description || null,
        categoryId: parseInt(categoryId),
        basePrice,
        imageUrl: imageUrl || null,
        customizationOptions,
      }).returning();
      
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Update product
  app.put("/api/admin/products/:id", isAdmin, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const { name, description, categoryId, basePrice, imageUrl } = req.body;
      
      if (!name || !categoryId || !basePrice) {
        return res.status(400).json({ message: "Name, category, and price are required" });
      }

      const [product] = await db.update(products)
        .set({
          name,
          description: description || null,
          categoryId: parseInt(categoryId),
          basePrice,
          imageUrl: imageUrl || null,
        })
        .where(eq(products.id, productId))
        .returning();
      
      res.json(product);
    } catch (error) {
      console.error("Failed to update product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  // Delete product
  app.delete("/api/admin/products/:id", isAdmin, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      console.log("Attempting to delete product with ID:", productId);
      
      const result = await db.delete(products).where(eq(products.id, productId));
      console.log("Delete result:", result);
      
      res.json({ message: "Product deleted successfully", productId });
    } catch (error) {
      console.error("Failed to delete product:", error);
      res.status(500).json({ message: "Failed to delete product", error: error.message });
    }
  });

  // Category CRUD operations
  app.post("/api/admin/categories", isAdmin, async (req, res) => {
    try {
      const { name, description, slug } = req.body;
      console.log("Creating category with data:", { name, description, slug });
      
      if (!name) {
        return res.status(400).json({ message: "Category name is required" });
      }

      const [category] = await db.insert(categories).values({
        name,
        description: description || null,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      }).returning();
      
      console.log("Created category:", category);
      res.json(category);
    } catch (error) {
      console.error("Failed to create category:", error);
      res.status(500).json({ message: "Failed to create category", error: error.message });
    }
  });

  // Update category
  app.put("/api/admin/categories/:id", isAdmin, async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      const { name, description, slug } = req.body;
      console.log("Updating category:", categoryId, { name, description, slug });
      
      if (!name) {
        return res.status(400).json({ message: "Category name is required" });
      }

      const [category] = await db.update(categories)
        .set({
          name,
          description: description || null,
          slug: slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        })
        .where(eq(categories.id, categoryId))
        .returning();
      
      console.log("Updated category:", category);
      res.json(category);
    } catch (error) {
      console.error("Failed to update category:", error);
      res.status(500).json({ message: "Failed to update category", error: error.message });
    }
  });

  // Delete category (with cascade check)
  app.delete("/api/admin/categories/:id", isAdmin, async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      console.log("Attempting to delete category with ID:", categoryId);
      
      // Check if there are products using this category
      const productsInCategory = await db.select().from(products).where(eq(products.categoryId, categoryId));
      console.log("Products in category:", productsInCategory.length);
      
      if (productsInCategory.length > 0) {
        return res.status(400).json({ 
          message: `Cannot delete category. ${productsInCategory.length} product(s) are using this category. Please delete or reassign the products first.`,
          productsCount: productsInCategory.length
        });
      }
      
      const result = await db.delete(categories).where(eq(categories.id, categoryId));
      console.log("Delete category result:", result);
      
      res.json({ message: "Category deleted successfully", categoryId, result });
    } catch (error) {
      console.error("Failed to delete category:", error);
      res.status(500).json({ message: "Failed to delete category", error: error.message });
    }
  });

  app.get('/api/admin/categories', isAdmin, async (req, res) => {
    try {
      const allCategories = await db.select().from(categories).orderBy(categories.id);
      console.log("Fetched categories:", allCategories.length);
      // Disable caching to ensure fresh data
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      res.json(allCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get('/api/admin/orders', isAdmin, async (req, res) => {
    try {
      // For now return empty array since orders table might not have data
      res.json([]);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
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