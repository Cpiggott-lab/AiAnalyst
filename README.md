## 📄 `README.md`

```markdown
# PersonaForge 🧠

An AI-powered consumer persona builder built with the MERN stack. Designed for startups and product teams to generate rich, research-backed user personas from minimal input using OpenAI.

---

## 🚀 Tech Stack

- **Frontend:** React (CRA), JSX, Fetch API
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **AI:** OpenAI API
- **Auth:** JWT (coming soon)
- **Linting:** ESLint (Airbnb config)

---

## 📂 Folder Structure
```

persona-forge/
├── client/ # React frontend
│ ├── public/ # index.html and static assets
│ └── src/ # App, components, API services
├── server/ # Node.js backend
│ ├── models/ # Mongoose schemas
│ ├── routes/ # Express routes (coming)
│ ├── controllers/ # Route logic (coming)
│ └── server.js # Main backend entry

````

---

## 🧪 Running the Project

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/persona-forge.git
cd persona-forge
````

### 2. Setup the backend

```bash
cd server
npm install
cp .env.example .env   # Create your env manually if not included
npm run dev
```

Add your Mongo URI to `.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/personaforge
PORT=5000
JWT_SECRET=yourSecretHere
```

### 3. Setup the frontend

```bash
cd ../client
npm install
npm start
```

---

## ✨ Features (Coming Soon)

- [x] MongoDB connected
- [x] React + Express working together
- [x] ESLint configured
- [ ] User Registration/Login (JWT)
- [ ] OpenAI-powered persona generation
- [ ] Project management dashboard
- [ ] Save/share personas for client teams

---

## 🧠 Motivation

Startups often don’t have time to run deep user research. **PersonaForge** aims to help teams quickly generate believable, testable user personas using the power of AI — fast, cheap, and developer-friendly.

---

## 📌 TODOs

- [ ] Build `/register` & `/login` routes
- [ ] Connect OpenAI API
- [ ] Generate persona based on prompt
- [ ] Frontend persona builder UI

---

## 🛠️ Contributing

This project is still early — if you want to contribute, fork the repo and open a PR!

---

## 📃 License

MIT

```

```
