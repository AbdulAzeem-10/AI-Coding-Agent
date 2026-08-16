````markdown
# 🤖 AI Coding Agent

A full-stack AI-powered coding environment that allows developers to authenticate, create and collaborate on projects in real time, generate code using Gemini AI, render AI responses with Markdown and syntax highlighting, and execute generated Node.js applications directly inside the browser using WebContainers.

The project was built with a strong focus on **backend architecture, real-time communication, AI integration, browser-based code execution, authentication, API design, and maintainable full-stack architecture**.

---

## 🚀 Project Overview

The AI Coding Agent combines an AI code-generation backend with a browser-based development environment.

The application allows a user to:

- Register and authenticate securely.
- Log in and maintain an authenticated session.
- Create projects.
- Retrieve projects.
- Add users to projects.
- Collaborate through real-time project rooms.
- Send messages between connected users.
- Interact with an AI coding assistant.
- Generate structured code and project file trees.
- Render Markdown responses as React components.
- Syntax-highlight generated code.
- Execute Node.js applications directly inside the browser.
- Run generated projects using WebContainers.

The project was built incrementally with a strong emphasis on **debugging real integration problems, separating backend responsibilities, and connecting multiple independent technologies into a single development workflow.**

---

# 🏗️ Architecture

```text
                         ┌───────────────────────┐
                         │       React UI        │
                         │                       │
                         │ Home / Login /        │
                         │ Register / Project    │
                         └───────────┬───────────┘
                                     │
                         HTTP / Axios│
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │    Express Backend    │
                         │                       │
                         │ Controllers           │
                         │ Routes                │
                         │ Middleware            │
                         │ Services              │
                         └───────┬───────┬───────┘
                                 │       │
                    ┌────────────┘       └─────────────┐
                    ▼                                  ▼
             ┌─────────────┐                    ┌─────────────┐
             │   MongoDB   │                    │    Redis    │
             │             │                    │             │
             │ Users       │                    │ Caching /   │
             │ Projects    │                    │ Services    │
             └─────────────┘                    └─────────────┘

                                 │
                                 ▼
                         ┌──────────────────┐
                         │    Socket.IO     │
                         │                  │
                         │ Real-time rooms  │
                         │ Project messages │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    Gemini AI     │
                         │                  │
                         │ Code generation  │
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
* Context API
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
* Browser WebSocket testing
* Nodemon

---

# 📁 Project Structure

```text
AI-Coding-Agent/
│
├── backend/
│   │
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
│   │
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

# 🔐 Authentication System

The backend implements authentication using:

* User registration
* User login
* JWT authentication
* Protected routes
* Authentication middleware
* Profile retrieval
* Logout functionality
* Password validation
* Email validation

### Authentication Routes

```text
POST /users/register
POST /users/login
GET  /users/profile
GET  /users/logout
```

Protected endpoints require authentication using a JWT bearer token.

The frontend uses a centralized Axios configuration and authentication context to manage authenticated requests and user state.

---

# 👥 User Management

The backend provides user-management functionality including:

* Creating users
* Logging users in
* Retrieving authenticated profiles
* Logging users out
* Retrieving users
* Adding users to projects

The `get-all-users` controller was specifically debugged and stabilized during development to ensure reliable user retrieval and correct route integration.

---

# 📦 Project Management

The application supports project-based collaboration.

Projects include:

* Project creation
* Project retrieval
* Get-all-projects functionality
* Adding users to projects
* Project ownership/user relationships
* Duplicate project validation
* Project-based real-time communication

### Example Project Creation

```text
POST /projects/create
```

The endpoint was tested through Postman using:

```text
Authorization: Bearer <JWT>
```

A successful project creation returned:

```text
201 Created
```

Duplicate project creation was also tested and correctly rejected with a bad-request response.

---

# ⚡ Real-Time Communication

Socket.IO was integrated on both the backend and frontend to provide real-time communication.

The backend creates a Socket.IO server on top of the HTTP server.

Each project gets its own Socket.IO room.

```text
User
  ↓
Authentication
  ↓
Project ID validation
  ↓
Project lookup
  ↓
Socket connection
  ↓
Join project room
  ↓
Real-time communication
```

This allows multiple users belonging to the same project to communicate without mixing messages between unrelated projects.

---

# 🔌 Socket Authentication

The Socket.IO middleware validates:

* JWT authentication
* Project ID format
* Project existence
* Socket connection authorization

Tokens can be received through Socket.IO authentication or authorization headers.

Project IDs are validated using Mongoose before database operations are performed.

---

# 🤖 Gemini AI Integration

The project integrates Google's Gemini API through:

```text
@google/genai
```

The AI service is separated from the controller layer to maintain a clean service-oriented backend architecture.

```text
AI Route
   ↓
AI Controller
   ↓
AI Service
   ↓
Google Gemini
```

The AI service receives a developer prompt and generates structured responses designed for an AI coding environment.

---

# 🧠 AI Prompt Engineering

The AI system instruction was designed around production-oriented software development.

The AI is instructed to:

* Write modular code
* Follow development best practices
* Create files when necessary
* Maintain existing functionality
* Handle edge cases
* Handle errors and exceptions
* Produce scalable code
* Produce maintainable code
* Use understandable comments
* Generate structured project file trees

The expected AI output contains information such as:

```json
{
  "text": "...",
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

This structure allows the frontend to interpret AI-generated projects and execute them through WebContainers.

---

# 🔄 AI Model Fallback System

A model fallback-priority mechanism was implemented to improve resilience.

Instead of relying on a single Gemini model, the AI service maintains an ordered list of candidate models.

```text
Primary Model
     ↓
Failure?
     ↓
Fallback Model
     ↓
Failure?
     ↓
Next Fallback
     ↓
Successful Response
```

Each model is attempted sequentially.

If a model fails, the service:

1. Captures the error.
2. Logs the failed model.
3. Moves to the next model.
4. Returns the first successful response.
5. Throws a final error only when all candidates fail.

This fallback behavior was tested through Postman and successfully produced a response using a fallback model after the primary model failed.

---

# 🌐 Browser-Based Node.js Runtime

One of the core features of the project is the integration of the WebContainer API.

WebContainers provide a browser-based Node.js runtime.

This allows the application to move beyond simply displaying generated code.

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
Run inside Browser
```

This establishes the foundation for an AI-powered browser IDE where generated applications can be inspected and executed directly from the browser.

---

# 📝 Markdown & Code Rendering

The frontend integrates:

```text
markdown-to-jsx
```

to convert Markdown responses into React components.

This allows AI-generated responses to be displayed as structured content instead of plain text.

---

# 🎨 Syntax Highlighting

The frontend integrates:

```text
highlight.js
```

for syntax highlighting.

This improves readability of generated programming code by providing language-aware formatting for code blocks.

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
Syntax-highlighted Code
```

---

# 🔌 Axios Architecture

Axios is centralized through frontend configuration rather than creating independent HTTP clients throughout the application.

The frontend uses Axios for:

* Authentication requests
* User requests
* Project requests
* Backend API communication

Axios integration was also debugged during development, including authentication-related imports and configuration.

---

# 🔄 React State Management

React state management and two-way binding were implemented across the primary application screens:

* Login
* Register
* Home
* Project

State is used for:

* Form values
* User input
* Authentication state
* Project information
* Application interactions

The final frontend stabilization included debugging and remodeling state usage across these screens to ensure consistent synchronization between user input and React state.

---

# 🧩 React Context

A dedicated user context was implemented to centralize authenticated user state.

This prevents authentication state from being unnecessarily duplicated across individual components.

```text
User Authentication
       ↓
User Context
       ↓
Application Components
```

---

# 🛣️ Frontend Routing

React Router is used to separate application screens and navigation.

The application includes routes for:

```text
Login
Register
Home
Project
```

Authentication-related routing is connected to the application's user context and authentication layer.

---

# 🐛 Major Bugs & Engineering Fixes

This project was developed through iterative debugging rather than simply assembling libraries.

Several real integration problems were encountered and resolved.

---

## 1. Gemini SDK Import Error

### Problem

Initially the project attempted to import:

```js
GoogleGenerativeAI
```

from:

```text
@google/genai
```

This produced:

```text
SyntaxError:
The requested module '@google/genai'
does not provide an export named 'GoogleGenerativeAI'
```

### Fix

Migrated to the correct SDK interface:

```js
import { GoogleGenAI } from "@google/genai";
```

and configured the client using:

```js
new GoogleGenAI({
    apiKey: process.env.GOOGLE_AI_KEY
});
```

---

# 2. Gemini Model Compatibility Error

### Problem

The initial model:

```text
gemini-1.5-flash
```

returned:

```text
404 NOT_FOUND

models/gemini-1.5-flash is not found
```

### Fix

The AI service was remodeled around available Gemini models and a fallback-priority mechanism was implemented.

The system now attempts models sequentially instead of depending on a single model.

The fallback behavior was verified successfully through Postman.

---

# 3. ESM Module Resolution Error

### Problem

The backend produced:

```text
ERR_MODULE_NOT_FOUND
```

for:

```text
services/ai.service
```

### Cause

The backend uses ES modules, which requires explicit file extensions for local imports.

### Fix

Changed:

```js
import { generateResult } from '../services/ai.service';
```

to:

```js
import { generateResult } from '../services/ai.service.js';
```

---

# 4. Socket.IO Initialization Error

### Problem

The backend initially crashed with:

```text
ReferenceError:
Cannot access 'io' before initialization
```

### Cause

Socket middleware was being registered before the Socket.IO server instance had been initialized.

### Fix

The Socket.IO server was initialized before middleware registration:

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

# 5. Invalid Socket Project ID

### Problem

Socket connections initially returned:

```text
Error: Invalid projectId
```

### Fix

The Socket.IO middleware validates the project ID using Mongoose:

```js
mongoose.Types.ObjectId.isValid(projectId)
```

before allowing the connection to proceed.

This prevents malformed project IDs from reaching the database layer.

---

# 6. Redis Connection Errors

During Redis integration, connection errors such as:

```text
ECONNRESET
```

and:

```text
getaddrinfo ENOTFOUND
```

were encountered.

The Redis connection configuration was debugged and verified until the application successfully reported:

```text
Redis connected
```

This highlighted the importance of handling external service connectivity independently from the core Express application.

---

# 7. CORS Issues

Frontend-to-backend communication initially required CORS configuration adjustments.

The Express application and Socket.IO server were configured to allow frontend communication during development.

Socket.IO was explicitly configured with development CORS support:

```js
cors: {
    origin: '*'
}
```

This was treated as a development configuration rather than a production security policy.

---

# 8. Axios Authentication Issues

Frontend authentication encountered Axios import/configuration issues.

The authentication layer was remodeled and Axios configuration was centralized to provide more reliable communication between the React frontend and Express backend.

---

# 9. React State & Two-Way Binding Issues

State handling across:

```text
Login.jsx
Register.jsx
Home.jsx
Project.jsx
```

was debugged and remodeled.

The final implementation ensures user input is synchronized with React state and that state changes propagate correctly through the relevant components.

---

# 10. Final ESM Import Fix

The frontend also required a final JavaScript import correction in:

```text
main.jsx
```

This was resolved during the final frontend stabilization pass.

---

# 🧪 API Testing

The backend was actively tested using Postman during development.

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

AI generation was tested successfully.

The model fallback mechanism was also tested and successfully returned a response through the fallback model.

### Project Creation Test

Project creation was tested using:

```text
Authorization: Bearer <JWT>
```

Successful creation returned:

```text
201 Created
```

Duplicate project creation was also tested and correctly rejected.

---

# 🔐 Environment Variables

Sensitive credentials are stored through environment variables rather than hardcoded into source code.

Example:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_AI_KEY=your_google_ai_key
REDIS_URL=your_redis_connection_string
```

The `.env` file should never be committed to GitHub.

---

# ⚙️ Running the Project

## Clone

```bash
git clone https://github.com/AbdulAzeem-10/AI-Coding-Agent.git
cd AI-Coding-Agent
```

---

## Backend

```bash
cd backend
npm install
```

Create:

```text
.env
```

with the required environment variables.

Then start the development server:

```bash
npm run dev
```

---

## Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend communicates with the backend through the configured API URL.

---

# 🧪 Development Workflow

The project was developed incrementally rather than as a single implementation.

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
AI Routes / Controllers
        ↓
Model Fallback
        ↓
Markdown Rendering
        ↓
Syntax Highlighting
        ↓
WebContainers
        ↓
Browser Node.js Runtime
        ↓
Frontend Stabilization
        ↓
Backend Stabilization
```

---

# 🧠 Engineering Concepts Demonstrated

This project demonstrates practical experience with:

* REST API design
* MVC-style backend organization
* Service-layer architecture
* Authentication and authorization
* JWT
* Middleware
* MongoDB/Mongoose
* Redis
* Express.js
* Node.js
* Socket.IO
* Real-time communication
* WebSocket-based architecture
* Project-based rooms
* API validation
* Error handling
* CORS
* Axios
* React Context
* React state management
* Two-way data binding
* React Router
* AI API integration
* Gemini
* Prompt engineering
* AI model fallback strategies
* Structured JSON generation
* Markdown rendering
* Syntax highlighting
* Browser-based Node.js execution
* WebContainers
* API testing with Postman
* Git/GitHub workflow
* Debugging distributed integrations

---

# 📈 What Makes This Project Different

This isn't simply an application that sends a prompt to an AI API and displays the response.

The architecture combines multiple systems:

```text
AI
+
Full-Stack Web Application
+
Real-Time Collaboration
+
Project Management
+
Browser-Based Node.js Runtime
+
Code Rendering
```

The important engineering challenge is connecting these systems reliably.

A generated application can conceptually move through the entire pipeline:

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

This makes the project a foundation for an **AI-powered browser IDE**, rather than a conventional CRUD application.

---

# 🧑‍💻 Engineering Lessons

Throughout development, the project required solving several real-world integration problems:

* SDK version mismatches
* API model availability
* ESM module resolution
* Authentication handling
* CORS configuration
* WebSocket authentication
* Socket.IO room isolation
* Redis connection failures
* Axios configuration
* React state synchronization
* AI API fallback strategies
* Browser-based runtime integration

These failures were treated as engineering problems rather than simply replacing the affected libraries.

The final architecture reflects the lessons learned from debugging each integration.

---

# 🔮 Future Improvements

Potential future improvements include:

* Persistent project chat history
* AI-generated file editing
* AI-powered code modification
* Streaming Gemini responses
* Improved WebContainer process management
* Terminal UI inside the browser
* Live preview iframe
* File explorer/editor synchronization
* Collaborative code editing
* Role-based project permissions
* Redis-backed session/caching strategies
* Production-grade CORS restrictions
* Rate limiting
* API request validation
* Automated testing
* CI/CD pipeline
* Docker deployment
* Production monitoring and logging
* More robust AI model routing
* AI-generated debugging and error correction

---

# 🎯 Project Goals

The long-term goal is to evolve the project into a complete browser-based AI development environment where developers can:

1. Describe an application in natural language.
2. Have AI generate the project structure and source code.
3. Inspect and edit the generated files.
4. Install dependencies automatically.
5. Execute the project inside a browser-based Node.js runtime.
6. Preview the application.
7. Collaborate with other developers in real time.
8. Ask the AI to modify or debug the project.

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
* [x] Model fallback priority
* [x] Backend debugging/stabilization

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
* [x] Browser-based Node.js runtime foundation
* [x] Frontend debugging/stabilization

---

# ⭐ Key Takeaway

**AI Coding Agent is a full-stack engineering project focused on building an AI-powered browser development environment.**

It combines:

```text
React
+
Node.js
+
Express
+
MongoDB
+
Redis
+
JWT
+
Socket.IO
+
Gemini AI
+
WebContainers
```

The project demonstrates not only feature development but also practical experience with **debugging, API integration, authentication, real-time systems, AI reliability, state management, browser-based execution, and architectural separation of concerns.**

---

# 👨‍💻 Author

**Abdul Azeem**

Computer Science | Software Engineering | Backend & Full-Stack Development

Focused on building scalable backend systems, APIs, real-time applications, and AI-powered developer tools.

```
```
