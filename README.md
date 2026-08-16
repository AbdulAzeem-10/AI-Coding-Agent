# 🤖 AI Coding Agent

A full-stack AI-powered coding environment that allows developers to create projects, collaborate in real time, generate code using Google Gemini, render AI-generated Markdown and code with syntax highlighting, and execute Node.js applications directly inside the browser using WebContainers.

The project focuses on **backend architecture, real-time communication, AI integration, authentication, API design, and browser-based code execution**.

---

## 🚀 Overview

The AI Coding Agent combines an AI-powered backend with a browser-based development environment.

Users can:

- Register and authenticate
- Login securely
- Create projects
- Retrieve projects
- Add users to projects
- Collaborate through real-time project rooms
- Send real-time messages
- Interact with an AI coding assistant
- Generate structured project file trees
- Render Markdown responses
- Syntax-highlight generated code
- Execute Node.js applications inside the browser
- Run generated projects using WebContainers

The project was developed incrementally with a strong focus on **debugging real-world integration problems and building maintainable full-stack architecture**.

---

# 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │      React UI        │
                    │                      │
                    │ Login                │
                    │ Register             │
                    │ Home                 │
                    │ Project              │
                    └──────────┬───────────┘
                               │
                         Axios / HTTP
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Express Backend    │
                    │                      │
                    │ Routes               │
                    │ Controllers          │
                    │ Middleware           │
                    │ Services             │
                    └───────┬──────┬───────┘
                            │      │
                 ┌──────────┘      └──────────┐
                 ▼                            ▼
          ┌──────────────┐             ┌──────────────┐
          │   MongoDB    │             │    Redis     │
          │              │             │              │
          │ Users        │             │ Redis        │
          │ Projects     │             │ Services     │
          └──────────────┘             └──────────────┘

                            │
                            ▼
                    ┌──────────────────┐
                    │    Socket.IO     │
                    │                  │
                    │ Project Rooms    │
                    │ Real-time Chat   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    Gemini AI     │
                    │                  │
                    │ Code Generation  │
                    │ Structured JSON  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   WebContainers  │
                    │                  │
                    │ Browser Node.js  │
                    │ Runtime          │
                    └──────────────────┘
````

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* React Router
* Axios
* React Context API
* Socket.IO Client
* WebContainer API
* Tailwind CSS
* Highlight.js
* markdown-to-jsx

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Redis
* ioredis
* Socket.IO
* JSON Web Tokens
* Express Validator
* Google Gemini API
* `@google/genai`
* Nodemon

## Development & Testing

* Git
* GitHub
* Postman
* WebSocket testing
* Nodemon

---

# 📁 Project Structure

```text
AI-Coding-Agent/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── user.controller.js
│   │   ├── project.controller.js
│   │   └── ai.controller.js
│   │
│   ├── middleware/
│   │   └── auth.middleware.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   └── project.model.js
│   │
│   ├── routes/
│   │   ├── user.routes.js
│   │   ├── project.routes.js
│   │   └── ai.routes.js
│   │
│   ├── services/
│   │   ├── user.service.js
│   │   ├── project.service.js
│   │   ├── redis.service.js
│   │   └── ai.service.js
│   │
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── auth/
│   │   │   └── UserAuth.jsx
│   │   │
│   │   ├── config/
│   │   │   ├── axios.js
│   │   │   ├── socket.js
│   │   │   └── webcontainer.js
│   │   │
│   │   ├── context/
│   │   │   └── user.context.jsx
│   │   │
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   │
│   │   ├── screens/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Project.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 🔐 Authentication

The backend implements JWT-based authentication with protected routes.

### Authentication Features

* User registration
* User login
* JWT authentication
* Protected routes
* Authentication middleware
* Profile retrieval
* Logout
* Email validation
* Password validation

### Authentication Routes

```text
POST /users/register
POST /users/login
GET  /users/profile
GET  /users/logout
```

Protected endpoints require a valid JWT bearer token.

The frontend uses a centralized Axios configuration together with React Context to manage authentication state.

---

# 👥 User Management

The backend provides user-management functionality including:

* Creating users
* Logging users in
* Retrieving authenticated profiles
* Logging users out
* Retrieving users
* Adding users to projects

The `get-all-users` controller was debugged and stabilized during development to ensure reliable user retrieval and route integration.

---

# 📦 Project Management

Projects provide the foundation for collaborative development.

The backend supports:

* Project creation
* Project retrieval
* Getting all projects
* Adding users to projects
* Project ownership/user relationships
* Duplicate project validation
* Project-based real-time communication

### Example

```http
POST /projects/create
Authorization: Bearer <JWT>
```

A successful project creation returned:

```text
201 Created
```

Duplicate project creation was also tested and correctly rejected with a bad-request response.

---

# ⚡ Real-Time Communication

Socket.IO was integrated on both the backend and frontend.

Each project has its own Socket.IO room, allowing users inside the same project to communicate in real time.

```text
User
  ↓
JWT Authentication
  ↓
Project ID Validation
  ↓
Project Lookup
  ↓
Socket Connection
  ↓
Join Project Room
  ↓
Real-Time Communication
```

This prevents messages from unrelated projects from being mixed together.

---

# 🔌 Socket Authentication

Socket.IO middleware validates:

* JWT authentication
* Project ID format
* Project existence
* Socket connection authorization

Authentication information can be passed through Socket.IO authentication data or an authorization header.

Project IDs are validated with Mongoose before database operations are performed.

---

# 🤖 Gemini AI Integration

Google Gemini is integrated through:

```text
@google/genai
```

The AI functionality follows a layered architecture:

```text
AI Route
    ↓
AI Controller
    ↓
AI Service
    ↓
Google Gemini API
```

Keeping AI logic inside a dedicated service separates external API communication from HTTP controller logic.

---

# 🧠 AI Prompt Engineering

The AI system instruction is designed around production-oriented software development.

The AI is instructed to:

* Write modular code
* Follow development best practices
* Break applications into appropriate files
* Create files when necessary
* Maintain existing functionality
* Handle edge cases
* Handle errors and exceptions
* Generate scalable code
* Generate maintainable code
* Use understandable comments
* Return structured project information

The expected AI output follows a structure similar to:

```json
{
  "text": "Generated project description",
  "fileTree": {},
  "buildCommand": {
    "mainItem": "npm",
    "commands": ["install"]
  },
  "startCommand": {
    "mainItem": "node",
    "commands": ["app.js"]
  }
}
```

This structure allows the frontend to interpret AI-generated projects and eventually execute them through WebContainers.

---

# 🔄 AI Model Fallback System

A model fallback-priority system was implemented to improve AI service reliability.

Instead of relying entirely on a single Gemini model, the service can attempt models sequentially.

```text
Primary Model
      ↓
   Failure?
      ↓
Fallback Model
      ↓
   Failure?
      ↓
Next Model
      ↓
Successful Response
```

When a model fails:

1. The error is captured.
2. The failed model is recorded.
3. The next available model is attempted.
4. The first successful response is returned.
5. An error is returned only if all configured models fail.

The fallback behavior was tested through Postman and successfully generated a response using a fallback model.

---

# 🌐 WebContainer Integration

The frontend integrates WebContainers to provide a browser-based Node.js runtime.

This allows generated applications to move beyond simply displaying code.

The workflow is:

```text
User Prompt
    ↓
Gemini AI
    ↓
Generated File Tree
    ↓
Frontend IDE
    ↓
WebContainer
    ↓
npm install
    ↓
Node.js Application
    ↓
Browser Execution
```

This forms the foundation for an AI-powered browser development environment.

---

# 📝 Markdown Rendering

AI responses can contain Markdown and formatted code.

The frontend uses:

```text
markdown-to-jsx
```

to transform Markdown into React components.

This allows AI responses to be displayed as structured content instead of plain text.

---

# 🎨 Syntax Highlighting

The frontend uses:

```text
highlight.js
```

for syntax highlighting of generated source code.

The rendering pipeline is:

```text
Markdown
    ↓
markdown-to-jsx
    ↓
React Components
    ↓
highlight.js
    ↓
Syntax-Highlighted Code
```

---

# 🔌 Axios Architecture

Axios is centralized through frontend configuration rather than creating independent clients throughout the application.

Axios handles communication for:

* Authentication
* Users
* Projects
* Backend APIs

The authentication flow was also debugged and remodeled to ensure the correct Axios configuration and imports were used throughout the frontend.

---

# 🔄 React State Management

React state and two-way binding were implemented across the main screens:

* `Login.jsx`
* `Register.jsx`
* `Home.jsx`
* `Project.jsx`

State is used for:

* Form values
* User input
* Authentication state
* Project information
* UI interactions

The final frontend stabilization included remodeling state usage to ensure consistent synchronization between user input and application state.

---

# 🧩 React Context

A dedicated user context centralizes authenticated user information.

```text
Authentication
      ↓
User Context
      ↓
React Components
```

This avoids unnecessarily duplicating authentication state across individual screens.

---

# 🛣️ Frontend Routing

React Router manages application navigation.

Current application screens include:

```text
Login
Register
Home
Project
```

Routing is connected to the authentication and user-context architecture.

---

# 🐛 Major Bugs & Fixes

This project was built through iterative development and debugging.

Several real integration issues were encountered and resolved.

---

## 1. Gemini SDK Import Error

### Problem

The initial implementation attempted to import:

```js
GoogleGenerativeAI
```

from `@google/genai`.

This produced:

```text
SyntaxError:
The requested module '@google/genai'
does not provide an export named 'GoogleGenerativeAI'
```

### Fix

The implementation was migrated to the correct SDK interface:

```js
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_KEY
});
```

---

## 2. Gemini Model Compatibility Error

### Problem

The initial Gemini model returned:

```text
404 NOT_FOUND

models/gemini-1.5-flash is not found
```

### Fix

The AI service was remodeled around supported Gemini models and a fallback-priority mechanism.

The fallback system was then tested successfully through Postman.

---

## 3. ESM Module Resolution Error

### Problem

The backend produced:

```text
ERR_MODULE_NOT_FOUND
```

when importing the AI service.

### Cause

The backend uses ES modules, requiring explicit file extensions for local imports.

### Fix

The import was changed from:

```js
import { generateResult } from "../services/ai.service";
```

to:

```js
import { generateResult } from "../services/ai.service.js";
```

---

## 4. Socket.IO Initialization Error

### Problem

The backend initially crashed with:

```text
ReferenceError:
Cannot access 'io' before initialization
```

### Cause

Socket middleware was registered before the Socket.IO instance was initialized.

### Fix

The initialization order was corrected:

```text
HTTP Server
    ↓
Socket.IO Server
    ↓
Socket Middleware
    ↓
Connection Handler
```

---

## 5. Invalid Socket Project ID

### Problem

Socket connections initially returned:

```text
Error: Invalid projectId
```

### Fix

The Socket.IO middleware validates project IDs using:

```js
mongoose.Types.ObjectId.isValid(projectId)
```

before querying MongoDB.

---

## 6. Redis Connection Errors

Redis initially produced errors including:

```text
ECONNRESET
```

and:

```text
getaddrinfo ENOTFOUND
```

The Redis configuration was debugged and eventually the application successfully established a Redis connection.

```text
Redis connected
```

This demonstrated the importance of isolating external-service connectivity problems from the main Express application.

---

## 7. CORS Issues

Frontend-to-backend communication required CORS configuration.

Both Express and Socket.IO were configured to allow frontend communication during development.

Socket.IO was configured with:

```js
cors: {
  origin: "*"
}
```

This is intended for development and should be restricted to trusted frontend origins in production.

---

## 8. Axios Authentication Issues

Frontend authentication encountered Axios configuration and import issues.

The authentication layer was remodeled and Axios configuration was centralized to provide consistent communication between the React frontend and Express backend.

---

## 9. React State & Two-Way Binding Issues

State handling across:

```text
Login.jsx
Register.jsx
Home.jsx
Project.jsx
```

was debugged and remodeled.

The final implementation ensures user input remains synchronized with React state.

---

## 10. Final Frontend Import Fix

A final JavaScript import issue in `main.jsx` was also corrected during the frontend stabilization phase.

---

# 🧪 API Testing

The backend was actively tested using Postman.

## Authentication

```text
POST /users/register
POST /users/login
GET  /users/profile
GET  /users/logout
```

## Projects

```text
POST /projects/create
GET  /projects
POST /projects/add-user
```

## AI

```text
GET /ai/get-result
```

AI generation was successfully tested.

The fallback model mechanism was also tested successfully.

---

# 🔐 Environment Variables

Sensitive credentials are stored through environment variables.

Example:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_AI_KEY=your_google_ai_key
REDIS_URL=your_redis_connection_string
```

**Never commit `.env` files or API keys to GitHub.**

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/AbdulAzeem-10/AI-Coding-Agent.git

cd AI-Coding-Agent
```

---

## 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file containing the required environment variables.

Then run:

```bash
npm run dev
```

---

## 3. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend communicates with the backend through the configured API URL.

---

# 🧪 Development Workflow

The application was developed incrementally:

```text
Project Initialization
        ↓
Express Backend
        ↓
MongoDB
        ↓
Authentication
        ↓
JWT Middleware
        ↓
Redis
        ↓
Project Management
        ↓
Project Members
        ↓
Socket.IO
        ↓
Project Rooms
        ↓
Gemini AI
        ↓
AI Service
        ↓
AI Routes & Controllers
        ↓
Model Fallback
        ↓
Markdown Rendering
        ↓
Syntax Highlighting
        ↓
WebContainers
        ↓
Frontend Stabilization
        ↓
Backend Stabilization
```

---

# 🧠 Engineering Concepts Demonstrated

This project demonstrates practical experience with:

* REST API development
* MVC architecture
* Service-layer architecture
* Authentication
* Authorization
* JWT
* Middleware
* MongoDB
* Mongoose
* Redis
* Express.js
* Node.js
* Socket.IO
* Real-time communication
* WebSocket architecture
* Project-based rooms
* API validation
* Error handling
* CORS
* Axios
* React Context
* React state management
* Two-way data binding
* React Router
* Gemini AI
* Prompt engineering
* AI model fallback
* Structured JSON generation
* Markdown rendering
* Syntax highlighting
* WebContainers
* Browser-based Node.js execution
* Postman API testing
* Git/GitHub workflow
* Debugging external integrations

---

# 📈 Why This Project Is Different

This project goes beyond a traditional CRUD application.

It combines:

```text
AI
+
Full-Stack Application
+
Real-Time Collaboration
+
Project Management
+
Browser-Based Node.js Runtime
+
Code Rendering
```

The complete pipeline is designed around:

```text
Developer Prompt
       ↓
Gemini AI
       ↓
Structured File Tree
       ↓
React Frontend
       ↓
Code Rendering
       ↓
WebContainer
       ↓
npm install
       ↓
Node.js Runtime
       ↓
Application Execution
```

This creates the foundation for a **browser-based AI development environment**.

---

# 🧑‍💻 Engineering Lessons

The project required solving multiple real-world engineering problems:

* SDK version mismatches
* Gemini model availability
* ESM module resolution
* JWT authentication
* Socket authentication
* Socket.IO room management
* Redis connectivity
* CORS configuration
* Axios configuration
* React state synchronization
* AI model fallback
* Browser-based runtime integration

Rather than simply replacing problematic technologies, each issue was debugged at the integration level.

This resulted in a more reliable understanding of how the individual systems interact.

---

# 🔮 Future Improvements

Planned improvements include:

* Persistent project chat history
* AI-generated file editing
* AI-powered code modification
* Streaming Gemini responses
* Browser terminal
* Live application preview
* Improved WebContainer process management
* File explorer/editor synchronization
* Collaborative code editing
* Role-based project permissions
* Redis-backed caching
* Production-grade CORS configuration
* Rate limiting
* Automated testing
* CI/CD
* Docker deployment
* Production monitoring
* Improved AI model routing
* AI-powered debugging
* AI-powered error correction

---

# 📌 Current Status

## Backend

* [x] Express server
* [x] MongoDB integration
* [x] User authentication
* [x] JWT middleware
* [x] User routes
* [x] Project model
* [x] Project service
* [x] Project controller
* [x] Project routes
* [x] Project creation
* [x] Project retrieval
* [x] Add users to projects
* [x] Redis integration
* [x] Socket.IO integration
* [x] Project-based Socket.IO rooms
* [x] Socket authentication
* [x] Gemini AI integration
* [x] AI controller
* [x] AI routes
* [x] AI service
* [x] Structured AI responses
* [x] AI model fallback
* [x] Backend debugging and stabilization

## Frontend

* [x] React + Vite
* [x] Tailwind CSS
* [x] React Router
* [x] Login screen
* [x] Register screen
* [x] Home screen
* [x] Project screen
* [x] User authentication context
* [x] Axios configuration
* [x] Socket.IO client
* [x] WebContainer integration
* [x] Markdown rendering
* [x] Highlight.js
* [x] React state management
* [x] Two-way binding
* [x] Browser-based Node.js runtime
* [x] Frontend debugging and stabilization

---

# 🎯 Project Vision

The long-term goal is to evolve this project into a complete AI-powered browser IDE where developers can:

1. Describe an application using natural language.
2. Generate an entire project using AI.
3. Inspect and edit generated files.
4. Install dependencies automatically.
5. Execute applications directly inside the browser.
6. Preview generated applications.
7. Collaborate with other developers in real time.
8. Ask AI to modify existing code.
9. Ask AI to debug runtime errors.
10. Iterate on an application without leaving the browser.

---

# 👨‍💻 Author

## Abdul Azeem

Computer Science | Software Engineering | Backend & Full-Stack Development

Focused on building scalable backend systems, APIs, real-time applications, and AI-powered developer tools.

````
