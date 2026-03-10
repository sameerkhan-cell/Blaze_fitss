# BLAZE FITSS — Next.js + MySQL Project

## Folder Structure

```
blaze-fitss/
├── app/                          # Next.js App Router
│   ├── layout.jsx                # Root layout (Navbar + Footer)
│   ├── page.jsx                  # Home / All Products
│   ├── globals.css               # Global styles
│   ├── jerseys/page.jsx
│   ├── footballshoes/page.jsx
│   ├── footballs/page.jsx
│   ├── shopforkids/page.jsx
│   ├── cart/page.jsx
│   ├── checkout/page.jsx
│   ├── orders/page.jsx
│   │
│   └── api/                      # API Routes (Backend)
│       ├── products/
│       │   ├── route.js          # GET all, POST create
│       │   └── [id]/route.js     # GET one, PUT update, DELETE
│       ├── categories/route.js
│       ├── cart/
│       │   ├── route.js          # GET cart
│       │   └── [id]/route.js     # PUT qty, DELETE item
│       ├── orders/
│       │   ├── route.js          # GET all orders, POST new order
│       │   └── [id]/route.js     # GET single order
│       └── search/route.js       # Search products
│
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ProductGrid.jsx
│   ├── ProductCard.jsx
│   ├── CartPanel.jsx
│   └── CheckoutModal.jsx
│
├── lib/
│   ├── db.js                     # MySQL connection pool
│   └── queries.js                # Reusable DB queries
│
├── context/
│   └── CartContext.jsx           # Client-side cart state
│
├── styles/
│   ├── Navbar.css
│   ├── Footer.css
│   ├── onlinestore.css
│   └── Pages.css
│
├── database/
│   └── schema.sql                # Full MySQL schema + seed data
│
├── .env.local                    # Environment variables (template)
├── package.json
└── next.config.js
```
