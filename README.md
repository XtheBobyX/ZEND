# ZEND

**Zend** es una aplicación de microblogging que permite a los usuarios publicar contenido y ver publicaciones en un timeline en tiempo real. Los posts pueden incluir texto, imágenes, emojis y encuestas. Además, los usuarios pueden interactuar mediante acciones como "likes", comentarios, re-posts, guardados y compartidos. También es posible ver a los usuarios con más seguidores.

---

## ✨ Características

- Registro e inicio de sesión de usuarios
- CRUD completo de publicaciones
- Feed público con los posts más recientes
- Interfaz moderna y responsiva
- API RESTful para gestión de datos
- Perfil de usuario con avatar y portada
- Soporte para likes, comentarios, reposts, encuestas, etc.
- Funcionalidades en tiempo real (mediante socket.io)
- Seguimiento de usuarios

---

## 🛠️ Tecnologías

### Frontend

- React con TypeScript
- React Router
- Tailwind CSS

### Backend

- Node.js con TypeScript
- Express
- MySQL con Sequelize
- JSON Web Tokens (JWT)

---

## Web Desplegada

## ⚙️ Instalación

Clona el repositorio y configura el entorno:

```bash
git clone https://github.com/xthebobyx/zend.git
cd zend

```

### Backend

```bash

cd backend
npm install
npm run dev
```

### Frontend

crea un archivo .env.local en /frontend

```bash
VITE_API_URL = 'http://localhost:3000'
```

```bash

cd frontend
npm install
npm run dev
```

## Variables de entorno

crea un archivo .env en /backend

```bash

DB_NAME=zend
DB_USER=root
DB_PASS=root
DB_HOST=localhost
SECRET_KEY=your_secret_key
PORT=3000
DB_PORT=3306

```

## Estructura del Proyecto

/frontend
/src
/assets
/components
/hooks
/pages
App.tsx
main.tsx
index.html

/backend
/src
/controllers
/models
/routes

📌 Estado del Proyecto

🧪 Que funcionalidades podria añadir:

Notificaciones en tiempo real

Panel de administración

Soporte para contenido multimedia (video/audio)

Paginación y Scroll Infinito
