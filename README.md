# 🔥 BLAZE FITSS — Next.js + MySQL Setup Guide

## Prerequisites

Make sure these are installed on your machine:
- **Node.js** v18 or higher → https://nodejs.org
- **MySQL** 8.0 or higher → https://dev.mysql.com/downloads/

---

## Step 1 — Clone / Copy Project Files

Put all the project files in a folder called `blaze-fitss`.

---

## Step 2 — Install Dependencies

Open your terminal inside the `blaze-fitss` folder and run:

```bash
npm install
```

This installs: Next.js 14, React 18, mysql2, uuid.

---

## Step 3 — Set Up MySQL Database

### 3a. Open MySQL and run the schema

```bash
mysql -u root -p < database/schema.sql
```

Or open **MySQL Workbench**, connect to your server, and run the contents of `database/schema.sql`.

This creates:
- Database: `blaze_fitss`
- Tables: `categories`, `products`, `carts`, `cart_items`, `orders`, `order_items`, `newsletter_subscribers`
- Sample products for all 4 categories

### 3b. Verify it worked

```sql
USE blaze_fitss;
SELECT COUNT(*) FROM products;   -- Should return 17
SELECT COUNT(*) FROM categories; -- Should return 4
```

---

## Step 4 — Configure Environment Variables

Copy the example file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=blaze_fitss

NEXTAUTH_SECRET=any-random-string-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> ⚠️ Never commit `.env.local` to git. It contains your database password.

---

## Step 5 — Add Product Images

Create the `public/images/` folder structure and add your images:

```
public/
└── images/
    ├── jersey.webp          (category hero)
    ├── Footballshoes.webp   (category hero)
    ├── Football.webp        (category hero)
    ├── Shopforkids.webp     (category hero)
    └── products/
        ├── rm-home.webp
        ├── barca-away.webp
        ├── mcity-third.webp
        ├── psg-home.webp
        ├── arg-kit.webp
        ├── mercurial.webp
        ├── predator.webp
        ├── puma-future.webp
        ├── nb-furon.webp
        ├── al-rihla.webp
        ├── nike-pl.webp
        ├── puma-orbita.webp
        ├── select.webp
        ├── kids-rm.webp
        ├── kids-boots.webp
        ├── kids-ball.webp
        └── kids-gk.webp
```

> You can update image paths in `database/schema.sql` → re-run it, or UPDATE products directly in MySQL.

---

## Step 6 — Run the Development Server

```bash
npm run dev
```

Open your browser at **http://localhost:3000** 🎉

---

## Full File Structure

```
blaze-fitss/
├── app/
│   ├── layout.jsx                 ← Root layout (Navbar + Footer)
│   ├── page.jsx                   ← Home page
│   ├── globals.css                ← All styles
│   ├── jerseys/page.jsx
│   ├── footballshoes/page.jsx
│   ├── footballs/page.jsx
│   ├── shopforkids/page.jsx
│   ├── about/page.jsx
│   ├── contact/page.jsx
│   ├── help/page.jsx
│   ├── track-order/page.jsx
│   ├── ordering/page.jsx
│   ├── returns/page.jsx
│   ├── careers/page.jsx
│   ├── sustainability/page.jsx
│   ├── press/page.jsx
│   ├── affiliates/page.jsx
│   ├── privacy/page.jsx
│   ├── terms/page.jsx
│   ├── cookies/page.jsx
│   ├── accessibility/page.jsx
│   └── api/
│       ├── products/route.js          ← GET all products, ?search= param
│       ├── products/[id]/route.js     ← GET single product
│       ├── categories/[slug]/products/route.js
│       ├── cart/route.js              ← GET cart, POST add item
│       ├── cart/[itemId]/route.js     ← PUT update qty, DELETE remove
│       ├── orders/route.js            ← GET all, POST create order
│       ├── orders/[orderNumber]/route.js  ← Track order
│       └── newsletter/route.js
│
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── CartPanel.jsx
│   ├── CheckoutModal.jsx
│   ├── ProductCard.jsx
│   ├── ProductGrid.jsx
│   ├── CategoryPageLayout.jsx
│   └── Notification.jsx
│
├── context/
│   └── CartContext.jsx            ← Global cart state
│
├── lib/
│   ├── db.js                      ← MySQL connection pool
│   └── queries.js                 ← All DB queries
│
├── database/
│   └── schema.sql                 ← DB setup + seed data
│
├── public/
│   └── images/                    ← Add your product images here
│
├── .env.local.example
├── .env.local                     ← Your local config (do not commit)
├── next.config.js
└── package.json
```

---

## API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | All products |
| GET | `/api/products?search=boots` | Search products |
| GET | `/api/products/[id]` | Single product |
| GET | `/api/categories/[slug]/products` | Products by category |
| GET | `/api/cart` | Get current cart |
| POST | `/api/cart` | Add item `{productId, quantity, size}` |
| PUT | `/api/cart/[itemId]` | Update quantity `{quantity}` |
| DELETE | `/api/cart/[itemId]` | Remove item |
| GET | `/api/orders` | All orders |
| POST | `/api/orders` | Place order |
| GET | `/api/orders/[orderNumber]` | Track order |
| POST | `/api/newsletter` | Subscribe `{email}` |

---

## Building for Production

```bash
npm run build
npm start
```

---

## Common Issues

**"Cannot connect to MySQL"**
- Check your `.env.local` credentials
- Make sure MySQL service is running: `sudo service mysql start`
- Test connection: `mysql -u root -p -e "SHOW DATABASES;"`

**"Table doesn't exist"**
- Run the schema again: `mysql -u root -p < database/schema.sql`

**Port 3000 in use**
- Use: `npm run dev -- -p 3001`
