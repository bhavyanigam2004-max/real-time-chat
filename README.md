# Real-Time Chat App

A real-time private chat application built with Node.js, React, and Socket.io.

## What it does

- Private one-on-one messaging (real-time)
- User authentication (register/login)
- Image sharing in chat
- Emoji support
- Online/offline status

## Tech Used

**Frontend** — React, Socket.io-client  
**Backend** — Node.js, Express, Socket.io  
**Database** — MongoDB  
**Auth** — JWT

## Folder Structure
real-time-chat/
├── backend/
└── frontend/

## How to Run

**Clone the repo**
git clone https://github.com/bhavyanigam2004-max/real-time-chat.git
cd real-time-chat

**Backend**
cd backend
npm install

Create a `.env` file:
PORT=5000
MONGO_URI=your_mongo_url
JWT_SECRET=your_secret

npm start

**Frontend**
cd frontend
npm install
npm start

App runs on `http://localhost:3000`

## Author

Bhavya Nigam — [@bhavyanigam2004-max](https://github.com/bhavyanigam2004-max)
