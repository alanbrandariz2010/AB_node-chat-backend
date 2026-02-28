# node-chat-backend 🚀

API RESTful para clon de chat — Trabajo Final Integrador · Desarrollo en Node.js (UTN BA)

## Stack

- **Node.js** + **Express.js** — servidor y rutas
- **MongoDB** + **Mongoose** — persistencia
- **JWT** — autenticación (bonus)
- **Zod** — validaciones (bonus)
- **dotenv** — variables de entorno (bonus)
- **bcryptjs** — hash de contraseñas

---

## Instalación y ejecución

```bash
# 1. Clonar el repo
git clone https://github.com/alanbrandariz2010/AB_node-chat-backend
cd node-chat-backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores reales

# 4. Iniciar en desarrollo
npm run dev

# 4b. Iniciar en producción
npm start
```

---

## Variables de entorno

```
PORT=8082
MONGO_URI=mongodb+srv://AB27084:v3rifUijgT3m4syW@cluster0.wpvwssk.mongodb.net/cursoNode?appName=Cluster0
JWT_SECRET=random
JWT_EXPIRES_IN=7d
```

---

## Estructura del proyecto

```
/node-chat-backend
├── /src
│   ├── /routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── chat.routes.js
│   │   └── message.routes.js
│   ├── /controllers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── chat.controller.js
│   │   └── message.controller.js
│   ├── /models
│   │   ├── user.model.js
│   │   ├── chat.model.js
│   │   └── message.model.js
│   ├── /middlewares
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── /utils
│   │   ├── response.js
│   │   └── validation.js
│   ├── app.js
│   └── db.js
├── package.json
├── .env.example
└── README.md
```

---

## Endpoints

Todas las respuestas siguen el formato:
```json
{ "success": true, "message": "...", "data": { ... } }
```

### Auth

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/register` | ❌ | Registrar usuario |
| POST | `/api/auth/login` | ❌ | Login, retorna JWT |
| POST | `/api/auth/logout` | ✅ | Logout |
| GET | `/api/auth/me` | ✅ | Perfil del usuario logueado |

### Users

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/users` | ✅ | Listar usuarios (`?search=` `?page=` `?limit=`) |
| POST | `/api/users` | ✅ | Crear usuario |
| GET | `/api/users/:id` | ✅ | Obtener usuario por ID |
| DELETE | `/api/users/:id` | ✅ | Eliminar usuario |

### Chats

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/chats` | ✅ | Listar chats del usuario |
| POST | `/api/chats` | ✅ | Crear chat |
| GET | `/api/chats/:id` | ✅ | Obtener chat por ID |
| DELETE | `/api/chats/:id` | ✅ | Eliminar chat |

### Messages

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/messages` | ✅ | Enviar mensaje |
| GET | `/api/messages/:chatId` | ✅ | Historial (`?page=` `?limit=` `?search=`) |
| DELETE | `/api/messages/:id` | ✅ | Eliminar mensaje |

---

## Ejemplos de requests y responses

### Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "juan",
  "email": "juan@mail.com",
  "password": "123456"
}
```
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": { "_id": "...", "username": "juan", "email": "juan@mail.com" },
    "token": "eyJhbGci..."
  }
}
```

### Enviar mensaje
```http
POST /api/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "chatId": "664abc123...",
  "content": "Hola, ¿cómo estás?"
}
```
```json
{
  "success": true,
  "message": "Mensaje enviado",
  "data": {
    "_id": "...",
    "chatId": { "_id": "...", "name": "Chat privado" },
    "userId": { "_id": "...", "username": "juan" },
    "content": "Hola, ¿cómo estás?",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### Historial paginado
```http
GET /api/messages/664abc123?page=1&limit=20
Authorization: Bearer <token>
```
```json
{
  "success": true,
  "message": "Mensajes obtenidos",
  "data": {
    "messages": [...],
    "total": 85,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

---

## Conexión con el frontend (React)

```js
// utils/api.js
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });
  return res.json();
};

// Ejemplo de uso en un componente
const messages = await api(`/messages/${chatId}`);
```

---

## Despliegue en Render

1. Crear nuevo **Web Service** en [render.com](https://render.com)
2. Conectar repositorio de GitHub
3. Configurar:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Agregar variables de entorno en el dashboard de Render
5. Deploy 🚀
