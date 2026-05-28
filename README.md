# Breathe ESG Data Ingestion Platform

A full-stack ESG (Environmental, Social, Governance) data ingestion and analytics platform that allows organizations to upload, validate, analyze, and audit emission records with interactive dashboards and reporting.

## Live Demo

**Frontend (Live App)**
https://breathe-esg-data-ingestion-platform-chi.vercel.app/

**Backend API**
https://breathe-esg-backend-1nxy.onrender.com/api/records/

---

## Features

### ESG Data Upload

* Upload ESG emission CSV files
* Support for realistic source types:

  * SAP Fuel & Procurement
  * Utility Portal Export
  * Corporate Travel Platform

### Emission Records Dashboard

* View uploaded ESG emission records
* Company-wise filtering
* Scope filtering (Scope 1, Scope 2, Scope 3)
* Search activity records

### Analytics Dashboard

* Emission distribution charts
* Scope distribution visualization
* Risk distribution analysis
* Approval status analytics

### Audit & Approval Workflow

* Approve emission records
* Edit emission values
* Audit tracking for modified records
* Suspicious activity monitoring
* Record locking for audit compliance

### Reports

* Download Audit Reports
* Download PDF Reports

---

## Tech Stack

### Frontend

* React.js
* Vite
* Recharts
* CSS

### Backend

* Django
* Django REST Framework
* Pandas
* ReportLab

### Deployment

* Frontend: Vercel
* Backend: Render

---

## Project Structure

```text
Breathe-ESG-Data-Ingestion-Platform/
│
├── frontend/      # React + Vite frontend
├── backend/       # Django backend API
├── README.md
├── DECISIONS.md
├── SOURCES.md
└── TRADEOFFS.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/sweetylinga/Breathe-ESG-Data-Ingestion-Platform.git
cd Breathe-ESG-Data-Ingestion-Platform
```

### Backend Setup

```bash
cd backend

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## Environment Variables

Create a `.env` file inside `frontend/`

```env
VITE_API_URL=https://breathe-esg-backend-1nxy.onrender.com
```

---

## API Endpoints

```text
/api/records/
/api/upload/
/api/approve/<id>/
/api/edit/<id>/
/api/analytics/
/api/audit-logs/
/api/download-audit-report/
/api/download-pdf-report/
```

---

## Key Highlights

* Realistic ESG data ingestion workflow
* Audit-ready record management
* Interactive analytics dashboard
* CSV upload support
* PDF report generation
* Public cloud deployment

---

## Author

**Linga Srilaxmi**

