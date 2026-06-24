# Aether - Digital Game Store Platform

Aether is a modern web application and database project inspired by digital storefronts like Steam. Built with a robust layered Node.js/Express backend and a responsive, dynamic Bootstrap frontend, Aether integrates real-time relational database persistence, transactional integrity, and native SGBD automations.

Developed as an academic interdisciplinar project for the **Computer Engineering** degree at **IFSULDEMINAS - Campus Poços de Caldas** for the **Database 2** and **Web Programming 2** courses.

---

## 🚀 Key Features

### 🌐 Web Presentation Layer (Frontend)
- **Dynamic Catalogue Showcase:** A sleek interface utilizing Bootstrap 5 to display games categorized by genre, including featured (highest-rated), sale, and recommended sections.
- **Single Page Feel (AJAX):** Asynchronous state updates and DOM rendering driven by the Javascript **Fetch API**, completely bypassing full-page reloads.
- **Cart & Wishlist Systems:** Real-time item additions and removals with database duplication constraints.
- **Interactive Simulated Gameplay:** Allows users to "play" their games, which dynamically updates playtime hours and features a **40% chance of unlocking random achievements** in their profile.
- **Profile & Wallet Management:** Create user accounts, log in, view statistics (total playtime, unlocked achievements, friends counts), and load wallet balance.

### 🗄️ Relational Database Layer (Backend & MySQL)
- **3rd Normal Form (3FN):** Schema designed from the ground up to prevent insertion, deletion, and update anomalies.
- **Database Trigger Automation:** A native AFTER INSERT trigger (`trg_after_biblioteca_insert`) on the `Biblioteca` table that automatically extracts user/game details and records a social activity in the `Atividades` feed.
- **Transactional Safety:** Critical procedures (like multi-game cart checkout or simulated achievement unlocks) are handled under database transactions with automatic rollback controls (`ROLLBACK`) on failures to guarantee data consistency.
- **Connection Pooling:** Backend optimized with connection reuse (via the `mysql2` driver pool) to manage concurrent API requests efficiently.
- **Advanced Query Integration:** Feed calculations utilizing complex aggregations, subqueries, and multi-table joins.

---

## 🛠️ Architecture & Tech Stack

Aether implements a strict **Layered MVC/Service-oriented Architecture**:

- **Frontend:** HTML5, CSS3, Bootstrap 5, Vanilla JS (Fetch API).
- **Backend:** Node.js, Express.
- **Database Access (Models):** `mysql2` client abstraction communicating via a connection pool.
- **Business Logic (Services):** Transaction controllers, checkout orchestrators, and game simulator.
- **SGBD:** MySQL (managed with MySQL Workbench).

---

## 📥 Installation & Setup

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MySQL Server](https://www.mysql.com/)

### 2. Clone the Repository & Install Dependencies
```bash
npm install
```

### 3. Database Initialization
1. Create a MySQL database (e.g., `db_web2_project`).
2. Run the DDL script located in [database/create-database.sql](file:///C:/Users/renan/programs/db-web2-project/database/create-database.sql) inside your database client to create all the 13 tables and establish relationships/triggers.

### 4. Environment Configuration
Create a `.env` file in the root directory (or modify the existing one) with your database credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=db_web2_project
PORT=3000
```

### 5. Seeding Database Data
Run the seeding script to clean up tables and populate 50 real games (with images, videos, categories, achievements, and review logs directly sourced from Steam's CDN):
```bash
node database/seed.js
```

### 6. Run the Application
Start the Node.js dev server:
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 📊 Database Schema

Aether's database consists of 13 fully normalized tables:
- **Core Entities:** `Usuarios`, `Categorias`, `Jogos`, `Conquistas`
- **Media Support:** `Screenshots_Jogos`, `Videos_Jogos`
- **Social & Interactions:** `Biblioteca`, `Usuario_Conquistas`, `Amigos`, `Atividades`, `Avaliacoes`
- **E-Commerce Flows:** `Carrinho`, `Wishlist`

A visual model of the ER schema can be viewed in the file [diagrama.jpg](file:///C:/Users/renan/programs/db-web2-project/diagrama.jpg) in the project root.

---

## 👥 Authors & Academic Context

- **Institution:** Instituto Federal de Educação, Ciência e Tecnologia do Sul de Minas - IFSULDEMINAS (Poços de Caldas)
- **Course:** Engenharia de Computação
- **Subjects:** Banco de Dados 2 \& Programação Web 2
- **Professores:** Ricardo Ramos de Oliveira \& Marcos Celso Rodrigues
- **Students:**
  - Leticia Maria Batista Carneiro
  - Gustavo Augusto Marques
  - Renan Cristiano Costa
