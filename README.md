# Scorecare Employee & Intern Management System

A professional full-stack HR administration system built for the ScoreSathi/Scorecare technical assessment.

## Stack
- Frontend: React + Vite + React Router + Axios + Recharts + Lucide React
- Styling: Custom responsive CSS (no UI template copied)
- Backend: Node.js + Express.js + REST APIs
- Database: MongoDB + Mongoose
- Auth: JWT + bcryptjs
- Uploads: Multer
- PDFs: PDFKit

## Implemented assessment areas
- JWT Admin/HR login, logout and protected routes
- Dashboard metrics, charts and upcoming joining dates
- Employee CRUD with search/filter/sort
- Detailed employee profile
- Intern CRUD and intern-to-employee conversion
- Offer letter creation/history and PDF generation
- Salary records and salary history
- Salary slip PDF generation
- Employee document upload/list/delete
- Department and designation master data
- Validation and meaningful API errors
- Responsive sidebar/header/table/form UI
- Loading, empty, error and toast states
- `.env.example`
- REST API structure with controllers, models, routes and middleware

## Run locally

### 1. Backend
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

On macOS/Linux:
```bash
cp .env.example .env
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## Environment
Backend `.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/scorecare_hr
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

## Demo admin
The backend automatically creates a demo admin if no admin exists:
- Email: `admin@scorecare.com`
- Password: `Admin@123`

Change this before deployment.

## Suggested Git commit sequence
1. `chore: initialize frontend and backend`
2. `feat: add jwt authentication`
3. `feat: add employee management`
4. `feat: add intern management`
5. `feat: add employee profile and salary history`
6. `feat: add documents and pdf generation`
7. `feat: add dashboard analytics`
8. `docs: add api documentation`

## API overview

### Auth
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Employees
- `GET /api/employees`
- `GET /api/employees/:id`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`

### Interns
- `GET /api/interns`
- `GET /api/interns/:id`
- `POST /api/interns`
- `PUT /api/interns/:id`
- `DELETE /api/interns/:id`
- `POST /api/interns/:id/convert`

### Salary
- `GET /api/employees/:id/salary`
- `POST /api/employees/:id/salary`
- `PUT /api/salary/:id`

### Documents
- `GET /api/employees/:id/documents`
- `POST /api/employees/:id/documents`
- `DELETE /api/documents/:id`

### Offers
- `GET /api/offers`
- `POST /api/offers`
- `PUT /api/offers/:id`
- `GET /api/offers/:id/pdf`

### Salary slips
- `POST /api/salary-slips`
- `GET /api/salary-slips/:id/pdf`

### Master data
- `GET/POST/PUT/DELETE /api/departments`
- `GET/POST/PUT/DELETE /api/designations`




## UI/UX polish
The frontend includes responsive cards, elevated shadows, hover states, smooth page/card entrance animations, focus rings, table hover interactions, loading pulse treatment, smooth scrolling, and reduced-motion accessibility support.
