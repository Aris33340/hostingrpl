🚀 STIS-GRAD — Setup & Installation Guide

Panduan ini membantu kamu melakukan setup Backend (NestJS) dan Frontend (Vue 3) secara lengkap untuk menjalankan aplikasi STIS-GRAD.


---

📥 1. Clone Repository

git clone https://github.com/SadewaAri12/STIS-GRAD.git  
cd STIS-GRAD  
git checkout main  


---

🗄️ 2. Backend Setup (NestJS)

Masuk ke folder backend:

cd BACKEND

🔧 Requirements

Node.js 18+

Docker (dibutuhkan untuk Redis)

Redis (otomatis berjalan melalui Docker)


▶️ Menjalankan Redis menggunakan Docker

docker compose up -d

Jika file docker-compose.yml berbeda, sesuaikan dengan konfigurasi kamu.

📦 Install Dependencies

npm install

🏗️ Build Backend

npm run build

▶️ Menjalankan Backend

npm run start:prod

Secara default backend berjalan di:

http://localhost:3000


---

🎨 3. Frontend Setup (Vue 3 + Vite)

Masuk ke folder frontend:

cd FRONTEND

📦 Install Dependencies

npm install

🏗️ Build Frontend

npm run build

▶️ Menjalankan Mode Development

npm run dev

Frontend akan berjalan pada:

http://localhost:5173


---

🌐 4. Struktur Project

STIS-GRAD/
│── BACKEND/        # API menggunakan NestJS
│── FRONTEND/       # Vue 3 + Vite
│── README.md


---

🧪 5. Environment Variables

Sesuaikan file .env pada folder BACKEND dan FRONTEND.

Contoh .env Backend:

PORT=3000
REDIS_HOST=localhost
REDIS_PORT=6379

Contoh .env Frontend:

VITE_API_URL=http://localhost:3000


---

🚀 6. Running Final Production

Backend:

npm run start:prod

Frontend (setelah build):

npm run preview

Atau deploy ke Nginx / hosting.


---

❤️ Kontribusi

Pull Request dan Issue sangat diterima.


---

📄 License

MIT License


---
