# MyMoney — Personal Finance Manager

**A full-stack personal finance management application for organizing financial accounts, tracking transactions, and understanding monthly income and expenses.**

## Overview

MyMoney is a web-based personal finance management system built to help users maintain an organized view of their finances.

The application allows users to manage multiple financial accounts, record income and expenses, transfer money between accounts, and analyze their monthly financial activity.

Originally based on a PHP/MySQL finance manager, this implementation rebuilds the application using AngularJS, Node.js, Express, and MongoDB.

The application follows a client-server architecture:

- **Frontend:** AngularJS single-page application responsible for the user interface and API communication.
- **Backend:** Node.js and Express REST API responsible for authentication, business logic, and financial operations.
- **Database:** MongoDB with Mongoose models for storing users, accounts, categories, and transactions.

## Key Features

### 1. User Authentication and Profile Management

- User registration and login.
- JWT-based authentication.
- Protected API endpoints.
- User profile management.
- Password updates.
- Currency and country preferences.

### 2. Financial Dashboard

- Displays the user's overall financial balance.
- Provides an overview of available accounts.
- Shows the most recent transactions.
- Provides a central view of financial activity.

### 3. Account Management

Users can create and manage different types of financial accounts:

- Bank accounts
- Cash accounts
- Credit card accounts
- Investment accounts

Each account maintains its own balance and transaction history.

### 4. Transaction Management

The application supports three transaction types:

| Transaction Type | Behaviour |
|---|---|
| Income | Adds the transaction amount to the selected account |
| Expense | Deducts the transaction amount from the selected account |
| Transfer | Moves money from one account to another |

Additional transaction information includes the amount, date, category, and remarks.

The backend also updates account balances when transactions are created, edited, or deleted.

### 5. Category Management

- Create custom income categories.
- Create custom expense categories.
- Edit and delete categories.
- Associate categories with transactions.

### 6. Financial Analysis

- Monthly income summaries.
- Monthly expense summaries.
- Category-based breakdowns.
- Doughnut-chart visualizations.

## Application Architecture

```text
                 USER
                   |
                   v
          AngularJS Frontend
                   |
                   v
             HTTP Requests
                   |
                   v
           Express REST API
                   |
          +--------+--------+
          |        |        |
          v        v        v
       Auth     Accounts  Transactions
       Routes    Routes     Routes
          |        |        |
          +--------+--------+
                   |
                   v
             Mongoose ODM
                   |
                   v
               MongoDB
                   |
                   v
          Financial Data Storage
```

## Technology Stack

| Category | Technology |
|---|---|
| Frontend Framework | AngularJS 1.x |
| Frontend Languages | HTML5, CSS3, JavaScript |
| Backend Runtime | Node.js |
| Backend Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JSON Web Tokens |
| Password Security | bcryptjs |
| API Communication | REST API |
| UI Routing | AngularJS UI-Router |
| Visualizations | Doughnut Charts |

## Project Structure

```text
MyMoney-Finance-Manager/
│
├── backend/
│   ├── server.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Account.js
│   │   ├── Category.js
│   │   └── Transaction.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── accounts.js
│   │   ├── categories.js
│   │   ├── transactions.js
│   │   └── analysis.js
│   │
│   └── package.json
│
├── frontend/
│   ├── index.html
│   │
│   ├── assets/
│   │   └── css/
│   │       └── style.css
│   │
│   └── app/
│       ├── app.js
│       │
│       ├── services/
│       │   └── auth.service.js
│       │
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── dashboard.controller.js
│       │   ├── accounts.controller.js
│       │   ├── categories.controller.js
│       │   ├── transactions.controller.js
│       │   ├── analysis.controller.js
│       │   └── profile.controller.js
│       │
│       └── views/
│           ├── layout.html
│           ├── login.html
│           ├── signup.html
│           ├── dashboard.html
│           ├── transactions.html
│           ├── add-transaction.html
│           ├── accounts.html
│           ├── add-account.html
│           ├── categories.html
│           ├── add-category.html
│           ├── analysis.html
│           └── profile.html
│
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 16 or later
- npm
- MongoDB Community Server or MongoDB Atlas
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Megh-756/MyMoney-Finance-Manager.git
cd MyMoney-Finance-Manager
```

### 2. Install Backend Dependencies

Navigate to the backend directory:

```bash
cd backend
npm install
```

### 3. Configure MongoDB

MyMoney uses MongoDB to store user and financial information.

The default connection string is:

```text
mongodb://localhost:27017/mymoney
```

You can use a local MongoDB instance or configure a MongoDB Atlas connection.

Set the `MONGODB_URI` environment variable before starting the backend.

**Windows PowerShell:**

```powershell
$env:MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-url>/mymoney"
```

**Windows Command Prompt:**

```cmd
set MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/mymoney
```

**Linux / macOS:**

```bash
export MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-url>/mymoney"
```

Never commit real database credentials or passwords to the repository.

### 4. Start the Backend Server

From the `backend/` directory:

```bash
node server.js
```

For development with automatic restarting:

```bash
npx nodemon server.js
```

Once connected successfully, the backend runs at:

`http://localhost:3000`

### 5. Open the Application

Navigate to the following address in your browser:

`http://localhost:3000`

The Express server serves the AngularJS frontend directly from the `frontend/` directory.

No separate frontend development server is required for the current application setup.

## Application Modules

| Module | Responsibility |
|---|---|
| Authentication | Registration, login, JWT authentication, profile updates |
| Dashboard | Overall balance, account overview, recent transactions |
| Accounts | Create, edit, delete, and view financial accounts |
| Transactions | Record income, expenses, and transfers |
| Categories | Manage custom income and expense categories |
| Analysis | Generate monthly income and expense breakdowns |
| Profile | Update personal information and preferences |

## REST API Reference

All API endpoints are served through:

`http://localhost:3000`

Authenticated endpoints require a JWT in the request header:

```text
Authorization: Bearer <token>
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Authenticate and receive a JWT |
| GET | `/api/auth/profile` | Retrieve the authenticated user's profile |
| PUT | `/api/auth/profile` | Update profile information |

### Accounts

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/accounts` | Retrieve user accounts |
| POST | `/api/accounts` | Create an account |
| PUT | `/api/accounts/:id` | Update an account |
| DELETE | `/api/accounts/:id` | Delete an account |

### Categories

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/categories` | Retrieve categories |
| POST | `/api/categories` | Create a category |
| PUT | `/api/categories/:id` | Update a category |
| DELETE | `/api/categories/:id` | Delete a category |

### Transactions

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/transactions?limit=50` | Retrieve recent transactions |
| POST | `/api/transactions` | Create a transaction |
| PUT | `/api/transactions/:id` | Update a transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |

### Monthly Analysis

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analysis/monthly?month=2024-10` | Retrieve monthly financial analysis |

## Financial Transaction Logic

One of the important parts of MyMoney is its account-balance management.

The backend applies balance changes based on the transaction type.

**Income:**

```text
Updated Balance = Previous Balance + Amount
```

**Expense:**

```text
Updated Balance = Previous Balance - Amount
```

The application also checks whether sufficient balance is available before processing expenses.

**Transfer:**

```text
Source Account = Previous Balance - Amount

Destination Account = Previous Balance + Amount
```

When a transaction is edited or deleted, the backend reverses the previous balance effect and applies the appropriate updated calculation.

This keeps transaction records and account balances synchronized during normal application operations.

## Security Implementation

- Passwords are hashed using bcryptjs.
- JWT-based authentication protects application routes.
- Authenticated requests identify the current user.
- Account and transaction operations are scoped to the authenticated user.
- The AngularJS frontend uses an HTTP interceptor to attach authentication tokens to API requests.

## Limitations

- The frontend uses AngularJS 1.x, which is an older framework.
- The application requires a running MongoDB instance.
- Financial calculations and transaction updates should be tested carefully before production use.
- The current application is intended as a personal finance management project, not a banking or payment-processing platform.
- Production deployment requires appropriate security, validation, and database configuration.

## Future Improvements

- Budget planning and spending limits.
- Recurring income and expense tracking.
- Exportable financial reports.
- Improved financial visualizations.
- Transaction search and filtering.
- Automated tests for balance calculations and transaction operations.
- Improved deployment and production security configuration.
- Migration to a modern frontend framework.

