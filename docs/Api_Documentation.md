# 📘 API Documentation

## The API features implemented in YourShop are :

### Authentication

- User and Admin login using JWT.
- OTP-based email verification and password reset.
- Token-based protected routes.

### User API

- Registration & Login.
- Profile info fetching.
- Password reset flow via OTP.  
  ----for Admin----
- Admin login.
- Password change.
- Admin-only product & order management.

### Product API

- Add, update, remove, and search products.
- Multiple image support.
- Filtering, sorting, pagination.

### Order API

- COD and Stripe payment options.
- Order placement, Stripe session, and verification.
- Admin order listing and status update with email notifications.

### Review API

- Submit reviews with rating and comment.
- Fetch all reviews for a product.

---

## Let's dive into the details for better understanding

## 🔐 Authentication

Some routes require authentication via **Bearer Token**.

**Header Format:**

```http
Authorization: Bearer <your_token>
```

---

## Base URL

`/api/user`

### 🧍‍♂️ User Registration

**Endpoint:** `POST /register`  
**Description:** Registers a new user..

#### Request Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourpassword"
}
```

#### Responses:

- `201 Created`: User created successfully.
- `200 OK`: User already exists or validation failed.
- `500 Internal Server Error`: Server error.
- `400 Bad Request` : Invalid user data

---

### 🔓 User Login

**Endpoint:** `POST /login`  
**Authentication:** User (JWT)  
**Description:** Logs in a user if credentials are valid and email is verified.

#### Request Body:

```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```

#### Responses:

- `201 Created`: Returns user info and token.
- `200 OK`: Incorrect password or email not verified.
- `404 Not Found`: User doesn’t exist.
- `500 Internal Server Error`: Server error.

---

### 👨‍💻 Admin Login

**Endpoint:** `POST /admin`  
**Authentication:** Admin (JWT)  
**Description:** Logs in an admin using email and password.

#### Request Body:

```json
{
  "email": "admin@example.com",
  "password": "adminpassword"
}
```

#### Responses:

- `201 Created`: Token returned.
- `200 OK`: Incorrect password.
- `404 Not Found`: Invalid credentials.
- `500 Internal Server Error`: Server error.

---

### 🔐 Admin: Change Password

**Endpoint:** `POST /admin/changePassword`  
**Authentication:** Admin (JWT)  
**Description:** Changes admin password (requires authentication).

#### Headers:

```http
Authorization: Bearer <admin_token>
```

#### Request Body:

```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newsecurepassword"
}
```

#### Responses:

- `200 OK`: Password changed.
- `400 Bad Request`: Invalid admin ID.
- `401 Unauthorized`: Wrong current password.
- `500 Internal Server Error`: Server error.

---

### 👤 Get User Info

**Endpoint:** `POST /userInfo`  
**Authentication:** User (JWT)  
**Description:** Fetches basic user profile (name, email).

#### Headers:

```http
Authorization: Bearer <user_token>
```

#### Responses:

- `200 OK`: User profile returned.
- `404 Not Found`: User not found.
- `500 Internal Server Error`: Server error.

---

### 🛠 Create Default Admin

**`INTERNAL`**

This function is run internally on server start to create a default admin using environment variables:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=yourpassword
```

---

# OTP and Password Reset API Documentation

## Base URL

`/api/user`

## Environment Variables

Make sure you have the following environment variables defined in your `.env` file:

```env
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

## Dependencies

```bash
npm install express-async-handler validator crypto bcrypt nodemailer dotenv
```

**Endpoint:** `POST /verifyEmail`  
**Description:** Sends an OTP to a registered user's email address for email verification.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

- `200 OK`: OTP sent successfully.
- `404 Not Found`: User not found.
- `500 Internal Server Error`: Server error.

```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

---

**Endpoint:** `POST /forgotPassword`  
**Description:** Sends an OTP to a registered user's email address for password reset.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

- `200 OK`: OTP sent successfully.
- `404 Not Found`: User not found.
- `500 Internal Server Error`: Server error.

```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

---

**Endpoint:** `POST /verify?otpFor=email|password`  
**Description:** Verifies an OTP for either email verification or password reset.

**Request Body:**

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Query Parameter:**

- `otpFor`: Specify `"email"` or `"password"`.

**Response:**

```json
{
  "result": {
    "valid": true
  }
}
```

---

**Endpoint:** `POST /resetPassword`  
**Description:** Resets the user's password if OTP is already verified.

**Request Body:**

```json
{
  "email": "user@example.com",
  "newPassword": "newSecurePassword123"
}
```

**Response:**

- `400 Bad Request`: Invalid Email.
- `404 Not Found`: User not found.
- `500 Internal Server Error`: Server error.

```json
{
  "success": true,
  "message": "Password reset"
}
```

---

## Internal Utility Functions

- `generateOTP()` - Generates a 6-digit OTP using crypto.
- `storeOTP(email, otp, otpFor)` - Stores OTP with expiration (2 minutes).
- `verifyOTP(email, otp, otpFor)` - Validates the OTP.
- `resetPass(email, newPassword)` - Validates OTP and resets the password.
- `sendOTPEmail({ email, otp, purpose })` - Sends OTP email via Gmail SMTP.
- `processOTPRequest({ email, otpFor, res })` - Handles OTP logic for both verification and password reset.

---

## Notes

- OTP expires after 2 minutes.
- Password must be at least 8 characters.
- OTP is stored in a separate `OTP` MongoDB collection.
- Make sure `EMAIL_USER` and `EMAIL_PASS` credentials are enabled for less secure apps or app password is used.

# Product API Documentation

## Base URL

`/api/product`

---

### 1. Add Product

**Endpoint:** `POST /add`  
**Authentication:** Admin (JWT)  
**Description:** Adds a new product with optional multiple images.

**Form Data Parameters:**

- `name` (string, required)
- `description` (string, required)
- `price` (number, required)
- `sellingPrice` (number, required)
- `category` (string, required)
- `subCategory` (string, optional)
- `sizes` (JSON array as string, required)
- `bestSeller` (boolean, optional)
- `image1`, `image2`, `image3`, `image4` (files, optional)

**Success Response:**

- `200 OK` –

```json
{
  "success": "true",
  "message": "Product added"
}
```

- `500 Internal Server Error`: Server error.

---

### 2. Update Product

**Endpoint:** `POST /updateProduct`  
**Authentication:** Admin (JWT)  
**Description:** Updates an existing product.

**Body Parameters:**

- `productId` (string, required)
- `name`, `description`, `price`, `sellingPrice`, `category`, `subCategory`, `sizes`, `bestSeller`

**Success Response:**

- `200 OK` –

```json
{
  "success": "true",
  "message": "Product updated"
}
```

- `500 Internal Server Error`: Server error.

---

### 3. List Products

**Endpoint:** `GET /list`  
**Description:** Retrieves paginated list of products with filtering and sorting.

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 20)
- `category` (comma-separated string)
- `subCategory` (comma-separated string)
- `sort` (string: "lowHigh" or "highLow")

**Success Response:**

- `200 OK` –

```json
{
  "success": true,
  "products": [],
  "totalProducts": 2,
  "totalPages": 1,
  "currentPage": 1
}
```

- `500 Internal Server Error`: Server error.

---

### 4. Remove Product

**Endpoint:** `POST /remove`  
**Authentication:** Admin (JWT)  
**Description:** Removes a product by ID.

**Body Parameters:**

- `id` (string, required)

**Success Response:**

- `200 OK` –

```json
{
  "success": "true",
  "message": "Product removed"
}
```

- `500 Internal Server Error`: Server error.

---

### 5. Get Single Product

**Endpoint:** `GET /single`  
**Description:** Retrieves a product by ID.

**Body Parameters:**

- `productId` (string, required)

**Success Response:**

- `200 OK` –

```json
{
    "success": "true",
    "product": { ... }
}
```

- `500 Internal Server Error`: Server error.

---

### 6. Search Products

**Endpoint:** `GET /search`  
**Description:** Searches products by name with filters.

**Query Parameters:**

- `search` (string, required)
- `page`, `limit`, `category`, `subCategory`, `sort` – same as `/list`

**Success Response:**

- `200 OK` –

```json
{
  "success": true,
  "products": [],
  "totalProducts": 2,
  "totalPages": 1,
  "currentPage": 1
}
```

- `500 Internal Server Error`: Server error.

# 📦 Order API Documentation

## Base URL

`/api/order`

---

## 🔐 Common Requirements

- All endpoints require authentication via a `Bearer Token`.
- For Admin-specific routes, token must belong to an authenticated Admin.

---

## 1. Place order (COD)

**Endpoint:** `POST /place`  
**Authentication:** User(JWT)  
**Description:** Place an order with **Cash on Delivery (COD)**.

### 🔸 Request Headers:

- `Authorization: Bearer <userToken>`

### 🔸 Request Body:

```json
{
  "items": [
    {
      "name": "Product Name",
      "price": 100,
      "quantity": 1,
      "size": "M"
    }
  ],
  "amount": 200,
  "address": {
    "email": "example@mail.com",
    "street": "123 Main St",
    "city": "Dhaka"
  }
}
```

### 🔸 Response:

-`200` -

```json
{
  "success": true,
  "message": "Order Placed"
}
```

---

## 2. Place order (Stripe)

**Endpoint:** `POST /stripe`  
**Authentication:** User(JWT)  
**Description:** Place an order with **Stripe Payment**.

### 🔸 Request Headers:

- `Authorization: Bearer <userToken>`
- `Origin: <frontend_url>`

### 🔸 Request Body:

Same as `/place` endpoint.

### 🔸 Response:

`200` -

```json
{
  "success": true,
  "session_url": "https://checkout.stripe.com/..."
}
```

---

## 3. Verify Stripe payment

**Endpoint:** `POST /verifyStripe`  
**Authentication:** User(JWT)  
**Description:** Verify Stripe payment success or cancellation.

### 🔸 Request Headers:

- `Authorization: Bearer <userToken>`

### 🔸 Request Body:

```json
{
  "orderId": "<order_id>",
  "success": "true"
}
```

### 🔸 Response (on success):

`200` -

```json
{
  "success": true
}
```

### 🔸 Response (on cancel):

`200` -

```json
{
  "success": false
}
```

---

## 4. Fetch all orders for admin

**Endpoint:** `POST /list`  
**Authentication:** Admin(JWT)  
**Description:** Fetch **all orders** (Admin only)..

### 🔸 Request Headers:

- `Authorization: Bearer <adminToken>`

### 🔸 Query Params:

- `page` (optional, default: 1)
- `limit` (optional, default: 20)

### 🔸 Response:

`200`-

```json
{
  "success": true,
  "orders": [...],
  "totalOrders": 100,
  "totalPages": 5,
  "currentPage": 1
}
```

---

## 5. Fetch User's orders

**Endpoint:** `POST /userorders`  
**Authentication:** User(JWT)  
**Description:** Fetch orders of the **currently logged-in user**.

### 🔸 Request Headers:

- `Authorization: Bearer <userToken>`

### 🔸 Response:

```json
{
  "success": true,
  "orders": [...]
}
```

---

**Endpoint:** `POST /status`  
**Authentication:** Admin(JWT)  
**Description:** Update order status and notify the user via email.

### 🔸 Request Headers:

- `Authorization: Bearer <adminToken>`

### 🔸 Request Body:

```json
{
  "orderId": "<order_id>",
  "status": "Packing"
}
```

✅ Allowed statuses:

- Order placed
- Packing
- Shipped
- Out for delivery
- Delivered

### 🔸 Response:

`200` -

```json
{
  "success": true,
  "message": "Status Updated"
}
```

---

## 🛑 Error Handling

All endpoints return:

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 📬 Email Notification

When order status is updated, a styled email is sent to the customer using **nodemailer** with:

- Product info
- Price
- Order status
- Delivery date

# Review API Documentation

**Base URl:** `api/review`

---

## 1. Get All review

**Endpoint:** `GET /allReview`  
**Description:** Get all review of product.

**Query Parameters:**

- `productId` (string) - Required. The ID of the product to fetch reviews for.

### Success Response:

`200 OK` -

```json
{
  "success": "true",
  "reviews": [
    {
      "_id": "...",
      "productId": "...",
      "email": "user@example.com",
      "rating": 4,
      "comment": "Great product!",
      "createdAt": "...",
      "updatedAt": "..."
    },
    ...
  ]
}
```

`500 Internal Server Error`

```json
{
  "error": "Internal server error"
}
```

---

## 2. Add review

**Endpoint:** `post /addReview`  
**Authentication:** User(JWT)  
**Description:** Add a Review for a Product.

**Request Body:**

```json
{
  "productId": "...",
  "email": "user@example.com",
  "rating": 5,
  "comment": "Amazing quality!"
}
```

### Response:

`200 OK` -

```json
{
  "success": "true",
  "savedReview": {
    "_id": "...",
    "productId": "...",
    "email": "user@example.com",
    "rating": 5,
    "comment": "Amazing quality!",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

`500 Internal Server Error` -

```json
{
  "message": "Error message details"
}
```

---

## 📌 Notes

- The `rating` field is typically expected to be a number (e.g., 1-5).
- The review timestamps (`createdAt`, `updatedAt`) are automatically generated by Mongoose if timestamps are enabled in the model.

---

# Cart API Documentation

## 🔐 Authentication

Some routes require authentication via **Bearer Token**.

**Header Format:**

```http
Authorization: Bearer <your_token>
```

## Base URL

/api/cart

## 1. Add to cart

**Endpoint:** `POST /add`  
**Authentication:** User(JWT)
**Description:** Add to cart .

### Request Body:

```json
{
  "itemId": "string",
  "size": "string"
}
```

### Response:

`200 OK` -

```json
{
  "success": true,
  "message": "Added to cart"
}
```

`400 Bad Request` -

```json
{
  "success": false,
  "message": "Invalid userId"
}
```

## 2.Update Cart

**Endpoint:** `POST /update`  
**Authentication:** User(JWT)
**Description:** Update Cart data .

### Request Body:

```json
{
  "itemId": "string",
  "size": "string",
  "quantity": number
}
```

### Response:

`200 OK` -

```json
{
  "success": true,
  "message": "Cart updated"
}
```

## 3. Get user cart

**Endpoint:** `POST /get`  
**Authentication:** User(JWT)  
**Description:** Get user Cart data .

### Request Body:

```json
{
  "userId": "string"
}
```

### Response:

`200 OK` -

```json
{
  "success": true,
  "cartData": {
    "itemId": {
      "size": quantity
    }
  },
  "name": "User's Name"
}
```

`400 Bad Request` -

```json
{
  "success": false,
  "message": "Invalid userId"
}
```

## ✅ Status Codes

| Code | Description                              |
| ---- | ---------------------------------------- |
| 200  | Request successful but validation failed |
| 201  | Resource created                         |
| 400  | Invalid input / ID                       |
| 401  | Unauthorized                             |
| 404  | Not found                                |
| 500  | Server error                             |
