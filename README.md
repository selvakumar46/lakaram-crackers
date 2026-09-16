# 🎆 SparkleFest Crackers - Fireworks E-Commerce Website

A modern, high-performance, festive full-stack E-Commerce web application for Fireworks and Festival Crackers built with **ReactJS** and **Java Spring Boot**.

Tailored specifically for Sivakasi fireworks retail and bulk buyers, featuring dual browsing modes, live pricing estimation, festival discounts, and one-click WhatsApp order generation.

---

## 🌟 Key Features

### 1. Dual Shopping Modes
- **Visual Product Catalog**: Browse 30+ cracker varieties across 9 festive categories (Sparklers, Ground Chakkars, Flower Pots, Rockets, Multi Sky Shots, Sound Crackers, Atom Bombs, Gift Boxes, Kids Safe specials) with high-res imagery, sound dB indicators, and safety tags.
- **Sivakasi Quick Order Sheet / Bulk Price List**: The signature tabular view with live quantity entry, instant calculations, category grouping, and real-time total updates.

### 2. Festive Experience & Smart Cart
- **Flat 75% Festive Discount**: Authentic Sivakasi direct factory pricing.
- **Milestone Rewards Progress**:
  - Minimum order tracking (₹1,000 threshold for transport dispatch).
  - Free packing & surprise gift unlock (at ₹3,000 threshold).
- **Interactive Fireworks Celebrations**: Interactive festive fireworks cannon using canvas particle effects.

### 3. Smart Checkout & Invoicing
- **One-Click WhatsApp Order Submission**: Formats an itemized order receipt with customer details, quantities, and net total, opening WhatsApp directly to the vendor desk.
- **Printable / Downloadable Bill**: Clean receipt with Order ID and delivery estimates for record-keeping.
- **Multiple Payment Options**: WhatsApp UPI confirmation or Transport Depot Pay-on-Delivery.

### 4. Safety & Green Cracker Compliance
- **CSIR-NEERI Green Cracker Badges**: Highlighting eco-friendly, reduced-emission formulations.
- **Safety Guidelines Modal**: Comprehensive Dos & Don'ts for safe Diwali celebrations.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti
  - Located in `./frontend`
- **Backend**: Java 17+ (Java 25 compatible), Spring Boot 3, Maven
  - Located in `./backend`
- **Architecture**:
  - RESTful APIs for Products (`/api/products`), Categories (`/api/categories`), and Orders (`/api/orders`).
  - Seamless offline fallback mode so the application operates seamlessly even before the backend is booted.

---

## 🚀 How to Run

### Quick Start (Windows)
1. **Start Java Backend**:
   - Double-click `run-backend.bat` or run:
     ```cmd
     run-backend.bat
     ```
   - Runs on `http://localhost:8080`.

2. **Start React Frontend**:
   - Double-click `run-frontend.bat` or run:
     ```cmd
     run-frontend.bat
     ```
   - Opens at `http://localhost:3000`.

---

## 📡 Java REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & system status |
| `GET` | `/api/products` | Get all products (with `?category=` and `?search=` filters) |
| `GET` | `/api/products/{id}` | Get product details by ID |
| `GET` | `/api/categories` | Get category list with counts |
| `POST` | `/api/orders` | Submit new order & generate invoice / WhatsApp link |
| `GET` | `/api/orders/{id}` | Get order details by ID |
