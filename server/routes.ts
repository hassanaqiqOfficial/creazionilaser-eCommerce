import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertCartItemSchema, insertDesignSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import { nanoid } from "nanoid";

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Seed data on startup
  await seedData();

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
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
        if (categoryData) {
          products = await storage.getProductsByCategory(categoryData.id);
        } else {
          return res.status(404).json({ message: "Category not found" });
        }
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
      const product = await storage.getProduct(parseInt(req.params.id));
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
      const userId = req.user.claims.sub;
      const artistData = {
        userId,
        ...req.body,
      };
      
      const artist = await storage.createArtist(artistData);
      res.json(artist);
    } catch (error) {
      console.error("Error creating artist:", error);
      res.status(500).json({ message: "Failed to create artist profile" });
    }
  });

  app.get('/api/artists/me', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.post('/api/designs', isAuthenticated, upload.single('image'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const artist = await storage.getArtistByUserId(userId);
      
      if (!artist) {
        return res.status(403).json({ message: "Must be an artist to upload designs" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }

      const designData = {
        artistId: artist.id,
        title: req.body.title,
        description: req.body.description,
        imageUrl: `/uploads/${req.file.filename}`,
        price: req.body.price,
        tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      };

      const design = await storage.createDesign(designData);
      res.json(design);
    } catch (error) {
      console.error("Error creating design:", error);
      res.status(500).json({ message: "Failed to create design" });
    }
  });

  // Cart routes
  app.get('/api/cart', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const cartItems = await storage.getCartItems(userId);
      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post('/api/cart', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const cartData = {
        userId,
        ...req.body,
      };

      const validation = insertCartItemSchema.safeParse(cartData);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid cart data", errors: validation.error.errors });
      }

      const cartItem = await storage.addToCart(validation.data);
      res.json(cartItem);
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.put('/api/cart/:id', isAuthenticated, async (req, res) => {
    try {
      const { quantity } = req.body;
      await storage.updateCartItem(parseInt(req.params.id), quantity);
      res.json({ message: "Cart updated" });
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(500).json({ message: "Failed to update cart" });
    }
  });

  app.delete('/api/cart/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.removeFromCart(parseInt(req.params.id));
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  // Order routes
  app.post('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const cartItems = await storage.getCartItems(userId);
      
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      const totalAmount = cartItems.reduce((sum, item) => 
        sum + (parseFloat(item.price) * item.quantity), 0
      );

      const orderData = {
        userId,
        orderNumber: `ORD-${nanoid(8)}`,
        totalAmount: totalAmount.toString(),
        shippingAddress: req.body.shippingAddress,
        status: "pending",
      };

      const orderItemsData = cartItems.map(item => ({
        productId: item.productId,
        designId: item.designId,
        quantity: item.quantity,
        unitPrice: item.price,
        customization: item.customization,
      }));

      const order = await storage.createOrder(orderData, orderItemsData);
      await storage.clearCart(userId);
      
      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getOrdersByUser(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    // In production, you'd use a proper file storage service
    res.status(404).json({ message: "File not found" });
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function seedData() {
  try {
    // Check if categories already exist
    const existingCategories = await storage.getAllCategories();
    if (existingCategories.length > 0) {
      return; // Data already seeded
    }

    // Seed categories
    const categories = [
      { name: "Custom T-Shirts", slug: "t-shirts", description: "High-quality custom printed t-shirts", imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300", sortOrder: 1 },
      { name: "Wooden Plaques", slug: "wooden-plaques", description: "Laser engraved wooden plaques", imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300", sortOrder: 2 },
      { name: "Stickers & Decals", slug: "stickers", description: "Vinyl cut stickers and decals", imageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300", sortOrder: 3 },
      { name: "Keychains", slug: "keychains", description: "Custom keychains in various materials", imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300", sortOrder: 4 },
      { name: "Phone Cases", slug: "phone-cases", description: "Custom printed smartphone cases", imageUrl: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300", sortOrder: 5 },
    ];

    for (const category of categories) {
      await storage.db.insert(storage.categories).values(category);
    }

    // Seed products
    const products = [
      { name: "Classic Cotton T-Shirt", description: "100% cotton, available in multiple colors", categoryId: 1, basePrice: "24.99", imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", customizationOptions: { colors: ["white", "black", "blue", "red"], sizes: ["S", "M", "L", "XL"] } },
      { name: "Premium Wooden Plaque", description: "High-quality wood with precision laser engraving", categoryId: 2, basePrice: "39.99", imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", customizationOptions: { sizes: ["Small", "Medium", "Large"], materials: ["Oak", "Pine", "Walnut"] } },
      { name: "Vinyl Sticker Pack", description: "Durable vinyl stickers, weatherproof", categoryId: 3, basePrice: "12.99", imageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400", customizationOptions: { quantities: ["5-pack", "10-pack", "25-pack"] } },
      { name: "Custom Keychain", description: "Personalized keychains in various materials", categoryId: 4, basePrice: "8.99", imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", customizationOptions: { materials: ["Acrylic", "Wood", "Metal"] } },
    ];

    for (const product of products) {
      await storage.db.insert(storage.products).values(product);
    }

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
