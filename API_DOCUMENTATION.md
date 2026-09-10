# Scorecare HR API

Base URL: `http://localhost:5000/api`

All routes except login/health require:
`Authorization: Bearer <JWT>`

## Auth
### POST `/auth/login`
```json
{"email":"admin@scorecare.com","password":"Admin@123"}
```

### GET `/auth/me`
Returns current authenticated user.

### POST `/auth/logout`
Client removes JWT. Server endpoint is provided for REST completeness.

## Employee examples
### POST `/employees`
```json
{
  "employeeId":"EMP-001",
  "fullName":"Aarav Sharma",
  "email":"aarav@example.com",
  "phone":"+91 9876543210",
  "department":"Technology",
  "designation":"Software Developer",
  "employmentType":"Full-time",
  "dateOfJoining":"2026-09-10",
  "employmentStatus":"Active",
  "probationPeriod":3
}
```

Query params for `GET /employees`:
`search`, `department`, `status`, `employmentType`, `sort`, `page`, `limit`.

## Interns
CRUD:
- GET `/interns`
- GET `/interns/:id`
- POST `/interns`
- PUT `/interns/:id`
- DELETE `/interns/:id`
- POST `/interns/:id/convert`

## Salary
- GET `/employees/:id/salary`
- POST `/employees/:id/salary`
- PUT `/salary/:id`

## Documents
Multipart form:
- GET `/employees/:id/documents`
- POST `/employees/:id/documents` with `file`, `documentName`, `documentType`
- DELETE `/documents/:id`

## Offers
- GET `/offers`
- POST `/offers`
- PUT `/offers/:id`
- GET `/offers/:id/pdf`

## Salary slips
- POST `/salary-slips`
- GET `/salary-slips/:id/pdf`

## Master data
Departments:
- GET/POST `/departments`
- PUT/DELETE `/departments/:id`

Designations:
- GET/POST `/designations`
- PUT/DELETE `/designations/:id`
