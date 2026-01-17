
👟 ShoeStore: Full-Stack Logic E-Commerce
A high-performance Shoe E-Commerce application designed to simulate complex real-world workflows. This project demonstrates advanced React patterns, Role-Based Access Control (RBAC), and persistence logic using a simulated backend environment.

📖 Table of Contents
🚀 Live Demo

🧩 Tech Stack

🏗️ Architecture

👤 User Features

🛠️ Admin Features

🔐 Security & Logic

📱 Responsive Design

⚙️ Setup & Installation

🚀 Live Demo
Concept Reference: [Recycled Shoe Store UI]

Admin Credentials: admin@example.com / admin123

User Credentials: user@example.com / user123

🧩 Tech Stack
Frontend: React.js (Hooks, Functional Components)

Routing: React Router DOM v6 (Protected & Nested Routes)

UI Framework: Material UI (MUI) & CSS Modules

Animations: Framer Motion

Icons: Lucide React

Data Persistence: LocalStorage API (Mock Backend Architecture)

🏗️ Architecture
The project follows a scalable, component-based folder structure

👤 User Features
1. Advanced Authentication
Session Persistence: Login states survive page refreshes.

Guest Access: Browse products without logging in; prompted only during checkout.

Account Privacy: Individual carts and order histories tied to specific user IDs.

2. Shopping Experience
Dynamic Search: Real-time filtering by name and category.

Smart Sorting: Price-based sorting (Low ↔ High) with duplicate prevention.

Product Discovery: Rich detail pages featuring quantity selectors and metadata.

3. Cart & Checkout
Persistent Cart: Items remain in the cart even after logging out.

Order Tracking: Users can monitor status: Processing → Shipped → Delivered.

Cancellations: Users can cancel orders while they are still in the Processing stage.

🛠️ Admin Features (Week 2 Development)
1. Management Dashboard
Protected Routes: Unauthorized users are automatically redirected to login.

Business Analytics: Dynamic calculation of total revenue based on Delivered orders.

2. Inventory & User Control
Product CRUD: Full capability to add, edit, and "soft delete" (toggle active/inactive) products.

User Moderation: Ability to view all registered users and Block/Unblock access.

Order Fulfillment: Admin controls the order lifecycle, updating statuses to notify users.

🔐 Security & Logic
RBAC (Role-Based Access Control): Specific views are restricted based on the user.role property.

Data Integrity: Prevents duplicate product entries and handles empty states gracefully.

Mock Backend: Custom logic ensures that data changes in the Admin panel reflect immediately across the entire User interface.

📱 Responsive Design
Built with a "Mobile-First" mindset using CSS Grid and Flexbox:

Desktop: Multi-column layouts with hover effects.

Tablet: Optimized grid spacing.

Mobile: Bottom navigation/drawer menus for a native app-like experience.

⚙️ Setup & Installation
Clone the repo

Bash

git clone https://github.com/AbhinavJeejo/STYX-ecom-website
Install dependencies

Bash

npm install
Run the app

Bash

npm start
Build for production

Bash

npm run build
🙌 Author
Shoe E-Commerce Web App Designed and Developed by [Your Name]

Focused on clean code, user experience, and robust frontend logic.
