# 🌀 Synchrix — Real-Time Chat Application

**Synchrix** is a modern, scalable **real-time chat application** built on the **MERN Stack** (MongoDB, Express.js, React.js, and Node.js).  
It provides seamless **one-to-one and group messaging**, complete with **live synchronization** across all users using **Socket.IO** for lightning-fast communication.

---

## 🚀 Description

Synchrix is designed to deliver a powerful yet intuitive chatting experience.  
It enables users to engage in **real-time private and group conversations**, manage groups, and stay updated with **instant status changes**.  
From **message edits and deletions** to **adding or removing group members**, every action reflects across all connected clients in real time.  

The app uses **Socket.IO** for fast and scalable WebSocket communication, ensuring low latency and high performance even with multiple concurrent connections.

---

## 🧠 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js (Vite) |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB |
| **Real-time Engine** | Socket.IO |
| **Authentication** | JWT + Google OAuth 2.0 |
| **Styling** | CSS / Bootstrap |
| **Version Control** | Git + GitHub |

---

## 🧰 Tools & Libraries

- **Passport.js** for Google OAuth authentication
- **Mongoose** for MongoDB object modeling  
- **Socket.IO** for real-time event-driven communication  
- **dotenv** for environment configuration  
- **Axios** for API communication  
- **React Context API** for global state management  

---

## ✨ Features

### 💬 Chat System
- One-to-one direct messaging  
- Group chat with multiple participants  
- Real-time message delivery and updates  
- Message edit & delete functionality  
- Online/offline status indicators
- Instantly shows *Typing...* when a user starts typing in one-to-one or group chats

### 👥 Group Management
- Create, rename, or delete groups  
- Add or remove members dynamically  
- Assign and remove admin roles  
- Real-time updates for all group actions  

### 🔔 Live Synchronization
- Every action (message, edit, member addition) reflects instantly using Socket.IO  
- Scalable architecture suitable for high concurrency  

### 🔐 Authentication & Security
- Secure **JWT-based** login system  
- Google login integration via **Passport.js**  
- **CSRF** and **CORS** protection
- **Express-rate-limiter** to protect API calls from DDoS attacks and being over-whelmed
- Encrypted environment variables

---

## 📧 Contact
Feel free to connect on [LinkedIn](https://www.linkedin.com/in/usman-hameed-05b513240)