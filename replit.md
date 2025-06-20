# E-Commerce Platform Documentation

## Project Overview
A full-stack e-commerce platform that combines custom product creation with an artist community marketplace. The platform serves customers looking for personalized products (t-shirts, wooden plaques, stickers, keychains) and artists wanting to monetize their designs through DTF, laser, and vinyl customization options.

## Project Architecture

### Authentication System
- Session-based authentication with bcrypt password hashing
- PostgreSQL session store for production reliability
- Protected routes for authenticated users
- Landing page for non-authenticated visitors

### Database Schema
- Users: Authentication and profile data
- Artists: Artist profiles linked to users
- Categories: Product categories (t-shirts, laser-engraved, etc.)
- Products: Base products available for customization
- Designs: Artist-created designs that can be applied to products
- Cart: Shopping cart functionality
- Orders: Order management system

### User Roles & Product Management

#### Admin/Platform Owner
- Seeds initial product catalog (t-shirts, wooden plaques, keychains, etc.)
- Manages base product categories and pricing
- Oversees platform operations

#### Artists
- Sign up as regular users, then create artist profiles
- Upload and sell their designs through the Create page
- Earn commissions when their designs are purchased
- Can view their earnings and design performance

#### Customers
- Browse products and artist designs
- Customize products with artist designs or upload their own files
- Add items to cart and place orders
- View order history and track shipments

### How The Site Works

1. **Product Discovery**: Customers browse base products (t-shirts, plaques, stickers)
2. **Design Selection**: Choose from artist marketplace designs or upload custom files
3. **Customization**: Select colors, sizes, materials, and text additions
4. **Purchase Flow**: Add to cart, checkout, and order fulfillment
5. **Artist Revenue**: Artists earn commissions on design sales

### Technology Stack
- Frontend: React, TypeScript, Tailwind CSS, Wouter routing
- Backend: Node.js, Express, session-based auth
- Database: PostgreSQL with Drizzle ORM
- File Storage: Local uploads with multer
- UI: shadcn/ui components

## Recent Changes
- 2024-12-19: Complete authentication system implemented with role-based access
- 2024-12-19: Database schema redesigned for proper user management
- 2024-12-19: Landing page created for non-authenticated users
- 2024-12-19: Artist marketplace functionality added
- 2024-12-19: Professional admin dashboard with responsive sidebar navigation
- 2024-12-19: Admin panel with working CRUD operations for users, products, and orders

## User Preferences
- User prefers comprehensive functionality over simplified versions
- Requires proper authentication system with login/signup
- Wants deployment capability to Render platform

## Deployment Configuration
- Render deployment files created (render.yaml, Dockerfile, README.md)
- Environment variables: DATABASE_URL, NODE_ENV, SESSION_SECRET
- Production build configured with esbuild