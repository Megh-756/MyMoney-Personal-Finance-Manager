# MyMoney - AngularJS + Node.js + MongoDB

A complete rebuild of the original PHP/MySQL MyMoney personal finance manager using:

- **Frontend**: AngularJS 1.x (not TypeScript), HTML5, CSS3, vanilla JS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose ODM
- **Auth**: JWT (JSON Web Tokens)

---

## 📁 Project Structure

```
mymoney-angular/
├── backend/
│   ├── server.js                  # Express entry point
│   ├── package.json
│   ├── middleware/
│   │   └── auth.js                # JWT middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Account.js
│   │   ├── Category.js
│   │   └── Transaction.js
│   └── routes/
│       ├── auth.js                # POST /api/auth/signup|login, GET/PUT /api/auth/profile
│       ├── accounts.js            # CRUD /api/accounts
│       ├── categories.js          # CRUD /api/categories
│       ├── transactions.js        # CRUD /api/transactions (with auto balance update)
│       └── analysis.js            # GET /api/analysis/monthly
│
└── frontend/
    ├── index.html                 # SPA shell (AngularJS bootstrapped here)
    ├── assets/
    │   └── css/style.css          # Dark green theme
    └── app/
        ├── app.js                 # Module + UI-Router config + JWT interceptor
        ├── services/
        │   └── auth.service.js    # All API services (auth, account, category, tx, analysis)
        ├── controllers/
        │   ├── auth.controller.js
        │   ├── dashboard.controller.js
        │   ├── accounts.controller.js
        │   ├── categories.controller.js
        │   ├── transactions.controller.js
        │   ├── analysis.controller.js
        │   └── profile.controller.js
        └── views/
            ├── layout.html        # Shared app shell (header + footer nav)
            ├── login.html
            ├── signup.html
            ├── dashboard.html
            ├── transactions.html
            ├── add-transaction.html
            ├── accounts.html
            ├── add-account.html
            ├── categories.html
            ├── add-category.html
            ├── analysis.html
            └── profile.html
```

---

## 🚀 Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally, OR a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

---

### Step 1 — Install dependencies

```bash
cd backend
npm install
```

---

### Step 2 — Configure MongoDB

By default the app connects to `mongodb://localhost:27017/mymoney`.

To use a different URI (e.g. MongoDB Atlas), set the environment variable:

```bash
# Linux / macOS
export MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/mymoney"

# Windows CMD
set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mymoney
```

Or edit the default in `backend/server.js`:
```js
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mymoney';
```

---

### Step 3 — Start the server

```bash
cd backend
node server.js
# or for auto-reload during development:
npx nodemon server.js
```

You should see:
```
✅ MongoDB connected successfully
🚀 MyMoney server running on http://localhost:3000
```

---

### Step 4 — Open the app

Open your browser and go to:

```
http://localhost:3000
```

The Node server serves the entire frontend from the `frontend/` folder.

---

## 🌟 Features

| Feature | Details |
|---------|---------|
| User Auth | Signup, Login, JWT sessions, Profile update |
| Dashboard | Total balance, accounts overview, recent 5 transactions |
| Accounts | Add/Edit/Delete Bank, Cash, Credit Card, Investment |
| Transactions | Income / Expense / Transfer with auto balance update |
| Categories | Custom income & expense categories with Material Icons |
| Analysis | Monthly income/expense breakdown with doughnut charts |
| Profile | Update name, currency, country, password |

---

## 🔌 REST API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Create account |
| POST | /api/auth/login | Login, receive JWT |
| GET | /api/auth/profile | Get profile (auth required) |
| PUT | /api/auth/profile | Update profile (auth required) |

### Accounts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/accounts | List all accounts |
| POST | /api/accounts | Create account |
| PUT | /api/accounts/:id | Update account |
| DELETE | /api/accounts/:id | Delete account |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/categories | List all categories |
| POST | /api/categories | Create category |
| PUT | /api/categories/:id | Update category |
| DELETE | /api/categories/:id | Delete category |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/transactions?limit=50 | List transactions |
| POST | /api/transactions | Create + update balances |
| PUT | /api/transactions/:id | Update + rebalance |
| DELETE | /api/transactions/:id | Delete + reverse balance |

### Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/analysis/monthly?month=2024-10 | Monthly summary + breakdown |

---

## 🛡️ Security Notes

- Passwords are hashed with **bcryptjs** (10 salt rounds)
- JWT tokens expire in **7 days**
- All API routes (except signup/login) require `Authorization: Bearer <token>` header
- Token is sent automatically by the AngularJS HTTP interceptor

---

## 📄 License

MIT License
