# 🍲 LocalChefBazaar

## 📌 Project Purpose
LocalChefBazaar is a modern online marketplace that connects talented home cooks with food lovers looking for fresh, authentic homemade meals. Home chefs can list their daily menus and manage orders, while customers can browse, order, and pay for meals — all in one place.

---

## 🌐 Live URL
- **Client:** https://local-chef-bazaar-958e3.web.app
- **Server:** https://local-chef-bazaar-server-inky.vercel.app

---

## ✨ Key Features

### 👤 User Features
- Secure registration and login with Firebase Authentication
- Browse all available meals with sorting and pagination
- View detailed meal information including ingredients, chef info, and delivery time
- Add meals to favorites and manage favorite list
- Place orders and track order status in real time
- Stripe-powered secure payment system
- Submit, update, and delete meal reviews
- Request to become a Chef or Admin from profile page

### 👨‍🍳 Chef Features
- Create new meals with image upload via ImgBB
- Manage personal meal listings (update/delete)
- View and manage incoming customer orders
- Accept, cancel, or mark orders as delivered

### 🛡 Admin Features
- View and manage all registered users
- Mark suspicious users as fraud
- Approve or reject Chef/Admin requests
- View platform statistics with charts (Recharts)
- Full role-based access control

### 🔐 Security Features
- JWT-based authentication for all protected routes
- Role-based route protection (User / Chef / Admin)
- Firebase environment variables secured via `.env`
- MongoDB credentials secured via `.env`

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React | UI Library |
| Vite | Build Tool |
| React Router | Client-side Routing |
| Tailwind CSS | Styling |
| Framer Motion | Animations |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Server Framework |
| MongoDB | Database |
| JWT | Authentication |
| Stripe | Payment Processing |

---

## 📦 NPM Packages Used

### Client Side
npm install react-router
npm install firebase
npm install react-hook-form
npm install axios
npm install sweetalert2
npm install react-hot-toast
npm install framer-motion
npm install @stripe/react-stripe-js
npm install @stripe/stripe-js
npm install recharts

### Server Side
npm install express
npm install cors
npm install dotenv
npm install mongodb
npm install jsonwebtoken
npm install stripe

---


## 📁 Project Structure
localchefbazaar-client/
├── public/
├── src/
│   ├── components/
│   │   ├── home/
│   │   │   ├── Banner.jsx
│   │   │   ├── DailyMeals.jsx
│   │   │   ├── CustomerReviews.jsx
│   │   │   └── WhyChooseUs.jsx
│   │   ├── CheckoutForm.jsx
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── context/
│   │   └── AuthProvider.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useAxiosSecure.js
│   ├── layouts/
│   │   ├── MainLayout.jsx
│   │   └── DashboardLayout.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Meals.jsx
│   │   ├── MealDetails.jsx
│   │   ├── OrderPage.jsx
│   │   ├── Payment.jsx
│   │   ├── PaymentSuccess.jsx
│   │   ├── ErrorPage.jsx
│   │   └── dashboard/
│   │       ├── MyProfile.jsx
│   │       ├── MyOrders.jsx
│   │       ├── MyReviews.jsx
│   │       ├── FavoriteMeals.jsx
│   │       ├── chef/
│   │       │   ├── CreateMeal.jsx
│   │       │   ├── MyMeals.jsx
│   │       │   └── OrderRequests.jsx
│   │       └── admin/
│   │           ├── ManageUsers.jsx
│   │           ├── ManageRequests.jsx
│   │           └── Statistics.jsx
│   └── routes/
│       ├── router.jsx
│       └── PrivateRoute.jsx
└── README.md

---

## 👨‍💻 Developer
- **Name:**     MAINUL ISLAM ANIK
- **Email:** mainulislamanik1710@gmail.com
---

*© 2025 LocalChefBazaar. All rights reserved.*