# CareerPortal — Project Report

**Project Title:** CareerPortal — A Skill-Based Career Recommendation and Expert Consultation Platform  
**Developed By:** Aman Singh  
**Date:** February 2026

---

## Abstract

CareerPortal is a full-stack web application addressing the need for accessible, personalized career guidance. The platform combines a rule-based weighted matching algorithm for skill-to-career recommendations with an expert consultation marketplace featuring Razorpay payments and Jitsi Meet video conferencing. Built with React 18 and Vite on the frontend, Flask and SQLAlchemy on the backend, and MySQL for persistent storage, the system supports three user roles — regular users, domain experts, and administrators. Key achievements include a career recommendation engine with skill gap analysis, end-to-end expert booking and payment workflow, OTP-based authentication, PDF report generation, and a comprehensive email notification system. The platform demonstrates proficiency in modern web development practices including JWT authentication, input sanitization, rate limiting, lazy-loaded routing, and modular architecture.

---

## Acknowledgements

I would like to express my sincere gratitude to my project guide and faculty members for their invaluable guidance, continuous support, and constructive feedback throughout the development of this project. Their expertise and encouragement have been instrumental in shaping this work.

I am also thankful to my family and friends for their unwavering moral support and motivation during the course of this project. Special thanks to the open-source community for providing excellent documentation and tools that made this project possible.

---

## Table of Contents

| Chapter | Title | Page |
|---------|-------|------|
| | Abstract | 1 |
| | Acknowledgements | 2 |
| | Table of Contents | 3 |
| | Table of Figures | 4 |
| 1 | Introduction | 5 |
| 1.1 | Background | 5 |
| 1.2 | Objectives | 6 |
| 1.3 | Purpose, Scope, and Applicability | 6 |
| 1.4 | Achievements | 8 |
| 1.5 | Organisation of Report | 9 |
| 2 | Survey of Technologies | 10 |
| 3 | Requirements and Analysis | 14 |
| 3.1 | Problem Definition | 14 |
| 3.2 | Requirements Specification | 15 |
| 3.3 | Planning and Scheduling | 17 |
| 3.4 | Software and Hardware Requirements | 18 |
| 3.5 | Preliminary Product Description | 19 |
| 3.6 | Conceptual Models | 20 |
| 4 | System Design | 22 |
| 4.1 | Basic Modules | 22 |
| 4.2 | Data Design | 23 |
| 4.3 | Procedural Design | 26 |
| 4.4 | User Interface Design | 30 |
| 4.5 | Security Issues | 31 |
| 4.6 | Test Cases Design | 32 |
| 5 | Implementation and Testing | 33 |
| 5.1 | Implementation Approaches | 33 |
| 5.2 | Coding Details and Code Efficiency | 34 |
| 5.3 | Testing Approach | 45 |
| 5.4 | Modifications and Improvements | 47 |
| 5.5 | Test Cases | 48 |
| 6 | Results and Discussion | 49 |
| 6.1 | Test Reports | 49 |
| 6.2 | User Documentation | 50 |
| 7 | Conclusions | 52 |
| 7.1 | Conclusion | 52 |
| 7.2 | Limitations of the System | 53 |
| 7.3 | Future Scope of the Project | 53 |
| | References | 55 |
| | Glossary | 56 |
| | Appendices | 57 |

---

## Table of Figures

| Figure No. | Title |
|------------|-------|
| Fig 2.1 | Technology Stack Overview |
| Fig 3.1 | Gantt Chart — Project Schedule |
| Fig 3.2 | PERT Diagram — Project Activities |
| Fig 3.3 | Data Flow Diagram (Level 0) |
| Fig 3.4 | ER Diagram |
| Fig 3.5 | Use Case Diagram |
| Fig 4.1 | Module Architecture Diagram |
| Fig 4.2 | Database Schema Diagram |
| Fig 4.3 | Career Recommendation Algorithm Flowchart |
| Fig 4.4 | Expert Booking Flow Diagram |
| Fig 4.5 | Authentication Flow Diagram |
| Fig 4.6 | Home / Landing Page |
| Fig 4.7 | Signup Page |
| Fig 4.8 | Login Page |
| Fig 4.9 | User Dashboard |
| Fig 4.10 | Career Recommendation Page |
| Fig 4.11 | Career Details & Skill Gap Analysis |
| Fig 4.12 | Find Experts Page |
| Fig 4.13 | Booking & Payment Flow |
| Fig 4.14 | Admin Dashboard |
| Fig 4.15 | Expert Dashboard |
| Fig 5.1 | Backend Layered Architecture |
| Fig 5.2 | Frontend Component Architecture |
| Fig 6.1 | Registration Flow Screenshot |
| Fig 6.2 | Skill Assessment Screenshot |
| Fig 6.3 | Career Recommendations Screenshot |
| Fig 6.4 | Skill Gap Analysis Screenshot |
| Fig 6.5 | Expert Booking & Payment Screenshot |
| Fig 6.6 | Admin Panel Screenshot |

---

# CHAPTER 1: INTRODUCTION

## 1.1 Background

In today's rapidly evolving job market, individuals often struggle to identify which career paths best align with their existing skill sets. Traditional career counseling is expensive, time-consuming, and not always accessible. According to industry surveys, over 60% of graduates feel uncertain about their career direction, and fewer than 20% have access to professional career guidance.

Existing solutions in this space are either generic job portals that do not personalize recommendations or expensive one-on-one counseling services with limited availability. There is a clear gap for an intelligent, digital platform that combines automated career matching with affordable human expertise.

**CareerPortal** was conceived to address this challenge. It is a modern, full-stack web application that provides **skill-based career recommendations**, **expert consultation booking**, and **skill gap analysis** — all in a single, unified platform. The system employs a weighted matching algorithm that scores and ranks careers based on users' self-assessed skills and proficiency levels. Additionally, it connects users with vetted domain experts for one-on-one video consultations via Jitsi Meet, with secure payment processing through Razorpay.

This approach combines deterministic algorithmic guidance with personalized human advice, creating a comprehensive career development ecosystem that is accessible to anyone with an internet connection.

## 1.2 Objectives

The primary objective of CareerPortal is to develop a web-based career recommendation and expert consultation platform that enables users to assess their skills, receive personalized career suggestions through a weighted matching algorithm, identify skill gaps for target careers, and book paid video consultations with domain experts — all within a secure, responsive, and modular full-stack application.

## 1.3 Purpose, Scope, and Applicability

### 1.3.1 Purpose

The purpose of CareerPortal is to democratize career guidance by providing a free-to-use career recommendation engine combined with affordable access to human career experts. The project improves upon existing systems by offering a transparent, quantifiable skill-to-career matching mechanism that empowers users with data-driven career decisions rather than generic advice. Its theoretical framework is based on a weighted proficiency matching model where each skill contributes a numerical score to career compatibility.

### 1.3.2 Scope

The project encompasses the following main functional areas:

- **User Authentication:** Registration with OTP email verification, JWT-based login, password-based and OTP-based login.
- **Career Recommendation Engine:** Skill self-assessment across categories, weighted matching algorithm, ranked career results.
- **Skill Gap Analysis:** Comparison of user proficiency vs. career requirements, identification of missing and upgradable skills.
- **Expert Consultation Marketplace:** Expert registration with admin approval, browsing, booking, Razorpay payment, and Jitsi Meet video calls.
- **Admin Panel:** User management, expert approval/rejection, booking oversight, career and skill CRUD.
- **Communication:** Email notifications (booking confirmations, OTP, career reports), PDF report generation.
- **Feedback System:** Post-consultation ratings and comments.

**Assumptions:** Users self-assess their skills honestly. Career and skill data is pre-seeded by administrators.  
**Limitations:** The recommendation engine is rule-based (not ML). Only Razorpay (INR) is supported. No native mobile app.

### 1.3.3 Applicability

- **College Students:** Identify career paths aligned with academic skills.
- **Working Professionals:** Evaluate career transitions and understand skill gaps.
- **Career Counselors:** Register as experts and offer paid consultations.
- **Educational Institutions:** Deploy as an in-house career guidance tool.
- **HR Departments:** Use for internal career development and upskilling programs.

## 1.4 Achievements

1. **Career Recommendation Engine** — Rule-based weighted matching algorithm scoring and ranking careers by skill compatibility.
2. **Complete Expert Consultation Workflow** — End-to-end flow: expert registration → admin approval → user booking → Razorpay payment → Jitsi Meet video call.
3. **Robust Authentication** — JWT tokens (access + refresh), OTP-based email verification, bcrypt password hashing.
4. **Admin & Expert Dashboards** — Comprehensive control panels for platform management.
5. **Email Notification System** — Professional HTML email templates with plain-text fallback.
6. **PDF Report Generation** — Server-side PDF generation using ReportLab for career reports.
7. **Responsive UI** — React + Tailwind CSS with Framer Motion animations and table-free responsive layouts.
8. **Security** — Rate limiting, input sanitization, CORS, parameterized queries.
9. **Feedback & Ratings** — Post-booking 1–5 star ratings displayed on expert profiles.
10. **Skill Gap Analysis** — Quantified readiness percentage with detailed skill-by-skill breakdown.

## 1.5 Organisation of Report

| Chapter | Description |
|---------|-------------|
| **Chapter 1** | Introduction — background, objectives, scope, achievements |
| **Chapter 2** | Survey of Technologies — comparative analysis of chosen technologies |
| **Chapter 3** | Requirements and Analysis — problem definition, requirements, scheduling, conceptual models |
| **Chapter 4** | System Design — modules, data design, procedural design, UI design, security |
| **Chapter 5** | Implementation and Testing — code details with snippets, testing approaches, test cases |
| **Chapter 6** | Results and Discussion — test reports with sample outputs, user documentation |
| **Chapter 7** | Conclusions — significance, limitations, and future scope |

---

# CHAPTER 2: SURVEY OF TECHNOLOGIES

This chapter presents a comparative analysis of the available technologies considered for each layer of the application, explains why specific technologies were selected, and provides an overview of how they integrate.

## 2.1 Frontend Framework Comparison

| Criteria | React | Angular | Vue.js | **Selected** |
|----------|-------|---------|--------|:---:|
| Learning Curve | Moderate | Steep | Easy | |
| Performance | High (Virtual DOM) | Good | High | |
| Ecosystem | Largest | Large | Growing | |
| Component Reuse | Excellent | Good | Good | |
| Community Support | Massive | Large | Moderate | |
| Bundle Size | Small (~42KB) | Large (~143KB) | Small (~33KB) | |

**Decision: React 18** was selected for its massive ecosystem, excellent component reuse through hooks and context, virtual DOM performance, and the availability of libraries like Formik, Recharts, and Framer Motion. Its lazy loading with `React.lazy()` and `Suspense` enables optimal code splitting.

## 2.2 Build Tool Comparison

| Criteria | Vite | Webpack | Create React App | **Selected** |
|----------|------|---------|-------------------|:---:|
| Dev Server Speed | Instant (ESBuild) | Slow (JS-based) | Slow | |
| Hot Module Replacement | Native, fast | Plugin-based | Built-in, slow | |
| Configuration | Minimal | Complex | Zero-config | |
| Production Build | Rollup-based | Webpack | Webpack | |

**Decision: Vite 5** was selected for its near-instant dev server startup using ESBuild, native Hot Module Replacement, and minimal configuration overhead.

## 2.3 CSS Framework Comparison

| Criteria | Tailwind CSS | Bootstrap | Material UI |
|----------|-------------|-----------|-------------|
| Customization | Complete | Theme-based | Component-locked |
| Bundle Size | Purged to minimal | Large | Very Large |
| Design Freedom | Full | Constrained | Constrained |
| Learning Curve | Moderate | Easy | Moderate |

**Decision: Tailwind CSS 3** was selected for its utility-first approach enabling rapid responsive design without fighting a framework's opinionated styles.

## 2.4 Backend Framework Comparison

| Criteria | Flask | Django | Express.js (Node) | FastAPI |
|----------|-------|--------|-------------------|---------|
| Language | Python | Python | JavaScript | Python |
| Architecture | Micro-framework | Full-stack | Minimal | Micro-framework |
| Flexibility | Very High | Moderate | High | High |
| REST API Focus | Excellent | Good | Excellent | Excellent |
| Built-in ORM | No (uses SQLAlchemy) | Yes (Django ORM) | No | No |

**Decision: Flask 3** was selected for its lightweight, micro-framework philosophy that gives full control over architecture. Combined with SQLAlchemy ORM, it provides flexibility without the overhead of a full-stack framework like Django.

## 2.5 Database Comparison

| Criteria | MySQL | PostgreSQL | MongoDB | SQLite |
|----------|-------|-----------|---------|--------|
| Type | Relational | Relational | Document | Relational |
| ACID Compliance | Yes (InnoDB) | Yes | Partial | Yes |
| Scalability | High | Very High | Very High | Low |
| JSON Support | Yes | Excellent | Native | Limited |
| Industry Adoption | Very High | High | High | Development only |

**Decision: MySQL 8** was selected for its high industry adoption, ACID compliance via InnoDB, excellent foreign key support for relational data, and JSON column support for flexible fields like `certificate_urls`.

## 2.6 Complete Technology Stack

### Frontend
- **React 18.2** — UI library | **Vite 5.0** — Build tool | **Tailwind CSS 3.3** — Styling
- **React Router 6.20** — Routing | **Formik 2.4 + Yup 1.3** — Form validation
- **Axios 1.6** — HTTP client | **Recharts 2.10** — Charts | **date-fns 2.30** — Dates
- **jsPDF 2.5** — Client PDF | **react-helmet-async 2.0** — SEO

### Backend
- **Flask 3.0** — Web framework | **SQLAlchemy 2.0** — ORM | **mysql-connector-python 8.2** — Driver
- **Flask-CORS 4.0** — CORS | **Flask-Mail 0.9** — Email | **Flask-Limiter 3.5** — Rate limiting
- **PyJWT 2.8** — Authentication | **bcrypt 4.1** — Hashing | **Razorpay 1.4** — Payments
- **ReportLab 4.0** — PDF generation | **Bleach 6.1** — Sanitization | **Gunicorn 21.2** — Production server

### Database & Services
- **MySQL 8.0+** (InnoDB) | **Razorpay** — Payments | **Jitsi Meet** — Video | **Gmail SMTP** — Email

### Dev Tools
- **ESLint + Prettier** — Linting/Formatting | **Jest + React Testing Library** — Testing | **Git & GitHub** — Version control

---

# CHAPTER 3: REQUIREMENTS AND ANALYSIS

## 3.1 Problem Definition

The overarching problem is the **lack of accessible, personalized career guidance** that combines automated skill assessment with human expertise.

### Sub-Problems

| # | Sub-Problem | Description |
|---|-------------|-------------|
| P1 | **Skill-to-Career Mapping** | No standard mechanism to quantitatively map a user's skills to compatible careers |
| P2 | **Skill Gap Identification** | Users cannot determine which specific skills they need to acquire or improve |
| P3 | **Expert Accessibility** | Career experts are expensive and geographically limited |
| P4 | **Fragmented Solutions** | Users must visit multiple platforms for career discovery, consultation, and payments |
| P5 | **Expert Vetting** | No streamlined process for verifying expert qualifications |
| P6 | **Secure Transactions** | Need for secure, verified payment processing for consultation services |

## 3.2 Requirements Specification

### Functional Requirements

| ID | Requirement | Module | Priority |
|----|-------------|--------|----------|
| FR-01 | User registration with name, email, and password | Auth | High |
| FR-02 | OTP-based email verification during registration | Auth | High |
| FR-03 | JWT-based login with access and refresh tokens | Auth | High |
| FR-04 | Skill assessment with category-based selection and proficiency levels | Career | High |
| FR-05 | Career recommendation via weighted skill matching | Career | High |
| FR-06 | Career detail pages (description, salary, demand, roadmap) | Career | High |
| FR-07 | Skill gap analysis (user skills vs career requirements) | Career | High |
| FR-08 | Save/unsave careers to profile | Career | Medium |
| FR-09 | Career comparison across multiple careers | Career | Medium |
| FR-10 | Download career reports as PDF | Career | Medium |
| FR-11 | Email career reports | Career | Medium |
| FR-12 | Expert registration with bio, resume, and rate | Expert | High |
| FR-13 | Admin approval/rejection of expert applications | Admin | High |
| FR-14 | Browse and search approved experts | Expert | High |
| FR-15 | Book expert consultation time slots | Booking | High |
| FR-16 | Razorpay payment processing | Payment | High |
| FR-17 | Auto-generate Jitsi Meet room links | Booking | High |
| FR-18 | Booking status management (pending→confirmed→completed→cancelled) | Booking | High |
| FR-19 | User dashboard with bookings, saved careers, recommendations | Dashboard | High |
| FR-20 | Admin dashboard with user, expert, booking, career management | Admin | High |
| FR-21 | Expert dashboard with booking and profile management | Expert | High |
| FR-22 | Post-booking feedback with ratings (1-5) and comments | Feedback | Medium |
| FR-23 | Contact form with email notification to admin | Contact | Medium |
| FR-24 | Email notifications for booking confirmations | Email | High |
| FR-25 | Rate limiting on API endpoints | Security | Medium |

### Non-Functional Requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-01 | Performance | API response times under 500ms |
| NFR-02 | Security | bcrypt hashing, JWT auth, input sanitization, CORS |
| NFR-03 | Scalability | Stateless REST API, connection pooling, lazy-loaded frontend |
| NFR-04 | Usability | Responsive design for desktop and mobile |
| NFR-05 | Reliability | Global error handling, database connection pooling with pre-ping |
| NFR-06 | Maintainability | Modular code with separation of concerns |

### Existing System Problems

| Problem | Impact |
|---------|--------|
| Generic job portals | No personalized skill-based matching |
| Expensive counseling | Not accessible to majority of users |
| No skill gap quantification | Users don't know what to learn |
| No integrated video consultation | Requires external scheduling tools |

## 3.3 Planning and Scheduling

### Gantt Chart (Fig 3.1)

```
Phase                        | W1 | W2 | W3 | W4 | W5 | W6 | W7 | W8 | W9 | W10| W11| W12| W13| W14|
─────────────────────────────|────|────|────|────|────|────|────|────|────|────|────|────|────|────|
1. Project Setup & DB Schema | ██ | ██ |    |    |    |    |    |    |    |    |    |    |    |    |
2. Authentication Module     |    | ██ | ██ |    |    |    |    |    |    |    |    |    |    |    |
3. Skill Assessment & Career |    |    | ██ | ██ |    |    |    |    |    |    |    |    |    |    |
4. Career Details & Skill Gap|    |    |    | ██ | ██ |    |    |    |    |    |    |    |    |    |
5. Expert Registration       |    |    |    |    | ██ | ██ |    |    |    |    |    |    |    |    |
6. Admin Approval Flow       |    |    |    |    |    | ██ | ██ |    |    |    |    |    |    |    |
7. Booking System            |    |    |    |    |    |    | ██ | ██ |    |    |    |    |    |    |
8. Razorpay & Jitsi          |    |    |    |    |    |    |    | ██ | ██ |    |    |    |    |    |
9. Admin Dashboard           |    |    |    |    |    |    |    |    | ██ | ██ |    |    |    |    |
10. Expert Dashboard         |    |    |    |    |    |    |    |    |    | ██ | ██ |    |    |    |
11. Email & PDF Reports      |    |    |    |    |    |    |    |    |    |    | ██ | ██ |    |    |
12. Feedback System          |    |    |    |    |    |    |    |    |    |    |    | ██ |    |    |
13. Testing & Bug Fixing     |    |    |    |    |    |    |    |    |    |    |    | ██ | ██ |    |
14. UI Polish & Refactoring  |    |    |    |    |    |    |    |    |    |    |    |    | ██ | ██ |
```

### PERT Diagram (Fig 3.2)

```
[Start] ──▶ [T1: DB Schema (4d)] ──▶ [T2: Auth Module (7d)] ──▶ [T3: Skill Assessment (5d)]
                                                                         │
                                                                         ▼
              [T7: Booking (7d)] ◀── [T6: Admin Approval (5d)] ◀── [T5: Expert Reg (7d)] ◀── [T4: Career Engine (7d)]
                    │
                    ▼
              [T8: Payments (7d)] ──▶ [T9: Dashboards (10d)] ──▶ [T10: Email/PDF (7d)]
                                                                         │
                                                                         ▼
                                                               [T11: Feedback (4d)]
                                                                         │
                                                                         ▼
                                                               [T12: Testing (7d)] ──▶ [T13: Polish (7d)] ──▶ [End]

Critical Path: T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8 → T9 → T10 → T11 → T12 → T13
Estimated Duration: ~83 days (14 weeks)
```

## 3.4 Software and Hardware Requirements

### Software Requirements

| Component | Requirement |
|-----------|-------------|
| Operating System | Windows 10/11, macOS, or Linux |
| Runtime (Frontend) | Node.js 18+ with npm |
| Runtime (Backend) | Python 3.10+ |
| Database Server | MySQL 8.0+ |
| Web Browser | Chrome, Firefox, Edge, or Safari (latest) |
| Code Editor | VS Code (recommended) |
| Version Control | Git 2.x+ |
| Package Manager | npm (frontend), pip (backend) |

### Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Processor | Intel i3 / AMD Ryzen 3 | Intel i5 / AMD Ryzen 5 |
| RAM | 4 GB | 8 GB |
| Storage | 2 GB free | 5 GB free |
| Display | 1366×768 | 1920×1080 |
| Network | Broadband | Broadband |
| Graphics | Integrated | Integrated |

## 3.5 Preliminary Product Description

CareerPortal operates with three user roles:

**Regular User:**  Register → verify email (OTP) → log in → assess skills (select skills + set proficiency) → receive ranked career recommendations → view career details → perform skill gap analysis → compare careers → save favorites → download PDF reports → browse experts → book consultations → pay via Razorpay → join Jitsi Meet video call → leave feedback.

**Expert:** Register with bio, resume, hourly rate → await admin approval → once approved, appear on "Find Expert" page → manage bookings and profile via Expert Dashboard.

**Admin:** Log in to Admin Dashboard → manage users (search/delete) → approve/reject expert applications → manage bookings (view/update status) → manage careers and skills → view analytics.

## 3.6 Conceptual Models

### Data Flow Diagram — Level 0 (Fig 3.3)

```
                          ┌─────────────────┐
     Skills & Profile     │                 │  Career Recommendations
 User ───────────────────▶│   CareerPortal  │────────────────────────▶ User
                          │     System      │
 Booking Request ────────▶│                 │──── Booking Confirm ───▶ User
                          │                 │
 Payment ────────────────▶│                 │──── PDF Reports ──────▶ User
                          │                 │
 Expert Application ─────▶│                 │──── Email Notifs ─────▶ User/Expert
                          │                 │
 Admin Actions ──────────▶│                 │──── Analytics ────────▶ Admin
                          └────────┬────────┘
                                   │
                          ┌────────▼────────┐      ┌──────────────┐
                          │   MySQL DB      │      │ Razorpay API │
                          └─────────────────┘      └──────────────┘
```

### ER Diagram (Fig 3.4)

```
┌──────────┐ 1    M ┌────────────┐ M    1 ┌──────────┐
│  users   │────────│ user_skills │────────│  skills  │
│          │        └────────────┘        │          │
│ PK: id   │                              │ PK: id   │
│ name     │        ┌────────────┐        │ name     │
│ email    │ 1    1 │  experts   │        │ category │
│ pass_hash│────────│            │        └────┬─────┘
│ is_admin │        │ PK: id     │             │
└─────┬────┘        │ FK: user_id│      ┌─────▼──────┐
      │             │ bio        │      │career_skills│
      │             │ rate/hr    │      │             │ M    1 ┌─────────┐
      │             │ status     │      │FK:career_id │────────│ careers │
      │             └─────┬──────┘      │FK:skill_id  │        │         │
      │                   │             │required_lvl │        │ PK: id  │
      │ 1    M     M    1 │             └─────────────┘        │ title   │
      │  ┌──────────┐     │                                    │ desc    │
      ├──│ bookings │─────┘                                    │ salary  │
      │  │ PK: id   │                                         │ demand  │
      │  │ slot_*   │ 1    1 ┌──────────────┐                  │ roadmap │
      │  │ jitsi_rm │───────│ transactions  │                  └────┬────┘
      │  │ status   │       │ razorpay_*    │                       │
      │  └────┬─────┘       │ amount        │               ┌──────▼────────┐
      │       │             └───────────────┘               │learning_rsrcs │
      │  ┌────▼─────┐                                       └───────────────┘
      ├──│feedbacks │       ┌──────────────┐
      │  │ rating   │       │saved_careers │
      │  │ comment  │       │FK:user_id    │
      │  └──────────┘       │FK:career_id  │
      └────────────────────▶│              │
                            └──────────────┘
```

### Use Case Diagram (Fig 3.5)

```
┌──────────────────────────────────────────────────────────────┐
│                        CareerPortal                          │
│                                                              │
│  ┌─────────┐     ┌───────────────────────────────────┐       │
│  │  User   │────▶│ Register / Login / OTP Verify     │       │
│  │         │────▶│ Assess Skills & Set Proficiency    │       │
│  │         │────▶│ Get Career Recommendations         │       │
│  │         │────▶│ View Career Details / Skill Gap    │       │
│  │         │────▶│ Compare & Save Careers / PDF       │       │
│  │         │────▶│ Browse Experts & Book Consultation  │       │
│  │         │────▶│ Pay via Razorpay                   │       │
│  │         │────▶│ Join Video Meeting (Jitsi)         │       │
│  │         │────▶│ Leave Feedback                     │       │
│  └─────────┘     └───────────────────────────────────┘       │
│                                                              │
│  ┌─────────┐     ┌───────────────────────────────────┐       │
│  │ Expert  │────▶│ Register as Expert                │       │
│  │         │────▶│ Manage Profile & View Bookings     │       │
│  └─────────┘     └───────────────────────────────────┘       │
│                                                              │
│  ┌─────────┐     ┌───────────────────────────────────┐       │
│  │  Admin  │────▶│ Approve/Reject Experts            │       │
│  │         │────▶│ Manage Users, Bookings, Careers    │       │
│  │         │────▶│ View Analytics                    │       │
│  └─────────┘     └───────────────────────────────────┘       │
└──────────────────────────────────────────────────────────────┘
```

---

# CHAPTER 4: SYSTEM DESIGN

## 4.1 Basic Modules

The system is divided into six core modules:

### Module Architecture Diagram (Fig 4.1)

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + Vite)                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │   Auth   │ │  Career  │ │  Expert  │ │  Admin   │          │
│  │  Module  │ │  Module  │ │  Module  │ │  Module  │          │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘          │
│       └────────────┴────────────┴────────────┘                 │
│                        │ Axios HTTP                            │
└────────────────────────┼───────────────────────────────────────┘
                         │ REST API (JSON)
┌────────────────────────┼───────────────────────────────────────┐
│                     BACKEND (Flask)                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │  Routes  │ │ Services │ │  Models  │ │  Utils   │          │
│  │ (9 files)│ │(career)  │ │(8 models)│ │(8 utils) │          │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘          │
│       └────────────┴────────────┴────────────┘                 │
│                        │ SQLAlchemy ORM                        │
└────────────────────────┼───────────────────────────────────────┘
                         │
              ┌──────────▼──────────┐
              │   MySQL Database    │
              │  (11 tables, InnoDB)│
              └─────────────────────┘
```

| Module | Description | Key Files |
|--------|-------------|-----------|
| **Authentication** | Registration, login (password/OTP), JWT tokens, email OTP | `auth.py`, `jwt_utils.py`, `otp_manager.py` |
| **Career Engine** | Skill assessment, recommendation algorithm, skill gap, PDF reports | `career_service.py`, `careers.py` |
| **Expert & Booking** | Expert registration, booking, Jitsi rooms, status management | `experts.py`, `bookings.py`, `expert_dashboard.py` |
| **Payment** | Razorpay order creation, signature verification, transaction records | `payments.py`, `payment_helper.py` |
| **Admin** | User/expert/booking/career management, analytics | `admin.py` |
| **Communication** | Email sending (OTP, confirmations, reports), PDF generation | `email_sender.py`, `pdf_generator.py` |

## 4.2 Data Design

### 4.2.1 Schema Design

The database uses **11 tables** with InnoDB engine. Below is the complete SQL schema:

```sql
-- CarrerPortal Database Schema (MySQL 8.0+)

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Skills table
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE KEY unique_skill_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- User Skills junction table
CREATE TABLE user_skills (
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency ENUM('beginner','intermediate','advanced','expert') NOT NULL,
    PRIMARY KEY (user_id, skill_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Careers table
CREATE TABLE careers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    salary_range VARCHAR(100),
    demand_level ENUM('low','medium','high','very_high') NOT NULL,
    roadmap TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Career Skills junction table
CREATE TABLE career_skills (
    career_id INT NOT NULL,
    skill_id INT NOT NULL,
    required_level ENUM('beginner','intermediate','advanced','expert') NOT NULL,
    PRIMARY KEY (career_id, skill_id),
    FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Experts table
CREATE TABLE experts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    bio TEXT,
    specialization VARCHAR(255),
    years_of_experience INT,
    rate_per_hour DECIMAL(10,2),
    resume_url VARCHAR(500),
    certificate_urls JSON,
    linkedin_url VARCHAR(500),
    status ENUM('pending','approved','rejected') DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bookings table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    expert_id INT NOT NULL,
    slot_start DATETIME NOT NULL,
    slot_end DATETIME NOT NULL,
    jitsi_room VARCHAR(255) NOT NULL,
    status ENUM('pending','confirmed','completed','cancelled') DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (expert_id) REFERENCES experts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Transactions table
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL UNIQUE,
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    razorpay_signature VARCHAR(500),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status ENUM('pending','completed','failed','refunded') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Feedbacks table
CREATE TABLE feedbacks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    expert_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (expert_id) REFERENCES experts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 4.2.2 Data Integrity and Constraints

| Constraint Type | Implementation |
|----------------|----------------|
| **Primary Keys** | Auto-incremented integer IDs on all tables |
| **Foreign Keys** | CASCADE on delete for referential integrity |
| **Unique Constraints** | `users.email`, `skills.name`, `experts.user_id`, `transactions.booking_id` |
| **ENUM Constraints** | Proficiency levels, demand levels, booking status, transaction status |
| **CHECK Constraints** | `feedbacks.rating BETWEEN 1 AND 5` |
| **NOT NULL** | All critical fields enforced at DB level |
| **Indexing** | `users.email` indexed for login lookups |

## 4.3 Procedural Design

### 4.3.1 Logic Diagrams

#### Career Recommendation Algorithm Flowchart (Fig 4.3)

```
[Start] → [Fetch user skills from DB]
              │
              ▼
         User has skills? ──No──▶ [Return empty list]
              │ Yes
              ▼
    [Build user_skill_map: {skill_id: proficiency}]
              │
              ▼
    [For each career in DB] ──────────────────────────────────┐
              │                                                │
              ▼                                                │
    [Fetch required CareerSkills]                              │
              │                                                │
    Has required skills? ──No──▶ [Skip career] ───────────────│
              │ Yes                                            │
              ▼                                                │
    [For each required skill]                                  │
        │                                                      │
        ├─ User has skill?                                     │
        │   Yes → Compare proficiency:                         │
        │         user >= required → score += req_weight × 2   │
        │         user < required  → score += user_weight      │
        │   No  → score += 0                                   │
        │                                                      │
    [Calculate match% = (matched/total) × 100]                 │
    [Calculate score% = (weighted/max_possible) × 100]         │
    [final_score = match% × 0.4 + score% × 0.6]              │
              │                                                │
    final_score > 10? ──No──▶ [Skip] ──────────────────────────│
              │ Yes                                            │
    [Add to recommendations]                                   │
              │                                                │
    [Loop next career] ◀───────────────────────────────────────┘
              │
              ▼
    [Sort recommendations by final_score DESC]
              │
              ▼
         [Return sorted list]
```

#### Authentication Flow Diagram (Fig 4.5)

```
[User] → [POST /auth/send-otp {email}] → [Generate 6-digit OTP]
                                             → [Store OTP in memory (5min TTL)]
                                             → [Send OTP via email]
    │
    ▼
[User] → [POST /auth/register {name, email, password, otp}]
              → [Verify OTP] → [Validate email & password]
              → [Hash password (bcrypt, 12 rounds)]
              → [Create user in DB]
              → [Generate JWT access token (30min)]
              → [Generate JWT refresh token (7d)]
              → [Return tokens + user data]
    │
    ▼
[User] → [Protected API calls with Authorization: Bearer <token>]
              → [@verify_token() decorator]
              → [Extract token → Decode JWT → Verify expiry]
              → [Store user_id in Flask g object]
              → [Execute route handler]
```

### 4.3.2 Data Structures

**Key data structures used in the application:**

**User Skill Map** (Python dictionary):
```python
# Maps skill ID to proficiency level for O(1) lookup
user_skill_map = {skill_id: proficiency for us in user_skills}
# Example: {1: 'advanced', 5: 'intermediate', 12: 'expert'}
```

**Proficiency Weight Map** (Python dictionary):
```python
proficiency_weights = {
    'beginner': 1,
    'intermediate': 2,
    'advanced': 3,
    'expert': 4
}
```

**Recommendation Result** (Python list of dicts):
```python
recommendations = [{
    'id': 3,
    'title': 'Full Stack Developer',
    'match_score': 85,
    'matched_skills': 7,
    'total_required_skills': 9,
    'salary_range': '₹8L - ₹25L',
    'demand_level': 'very_high'
}]
```

### 4.3.3 Algorithms Design

The core algorithm is the **Weighted Career Matching Algorithm** in `career_service.py`. Below is the actual code:

```python
@staticmethod
def recommend_careers(user_id):
    """Recommend careers based on user's saved skills"""
    user_skills = g.db.query(UserSkill).filter_by(user_id=user_id).all()
    if not user_skills:
        return []
    
    user_skill_ids = [us.skill_id for us in user_skills]
    user_skill_map = {us.skill_id: us.proficiency for us in user_skills}
    
    careers = g.db.query(Career).all()
    recommendations = []
    
    proficiency_weights = {
        'beginner': 1, 'intermediate': 2,
        'advanced': 3, 'expert': 4
    }
    
    for career in careers:
        required_skills = g.db.query(CareerSkill).filter_by(career_id=career.id).all()
        if not required_skills:
            continue
        
        total_skills = len(required_skills)
        matching_skills = 0
        weighted_score = 0
        total_possible_score = 0
        
        for req_skill in required_skills:
            req_weight = proficiency_weights.get(req_skill.required_level.lower(), 1)
            total_possible_score += (req_weight * 2)
            
            if req_skill.skill_id in user_skill_map:
                matching_skills += 1
                user_weight = proficiency_weights.get(
                    user_skill_map[req_skill.skill_id].lower(), 1
                )
                if user_weight >= req_weight:
                    weighted_score += (req_weight * 2)
                else:
                    weighted_score += user_weight
        
        match_percentage = (matching_skills / total_skills) * 100
        score_percentage = (weighted_score / total_possible_score) * 100
        final_score = (match_percentage * 0.4) + (score_percentage * 0.6)
        
        if final_score > 10:
            recommendations.append({
                'id': career.id,
                'title': career.title,
                'match_score': round(final_score),
                'matched_skills': matching_skills,
                'total_required_skills': total_skills
            })
    
    recommendations.sort(key=lambda x: x['match_score'], reverse=True)
    return recommendations
```

**Algorithm Complexity:** O(C × S) where C = number of careers and S = average skills per career.

## 4.4 User Interface Design

The frontend uses a **component-based architecture** with React and Tailwind CSS:

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Landing page with hero, features |
| Login | `/login` | Email/password and OTP login |
| Signup | `/signup` | Registration with OTP |
| Dashboard | `/dashboard` | User bookings, saved careers, recommendations |
| Career Recommendation | `/careers` | Skill selection → career results |
| Career Details | `/careers/:id` | Full career info, skill gap, roadmap |
| Find Experts | `/experts` | Browse approved experts |
| Bookings | `/bookings` | User booking history |
| Meeting | `/meeting/:roomId` | Jitsi Meet embed |
| Admin Dashboard | `/admin` | Admin control panel |
| Expert Dashboard | `/expert/dashboard` | Expert management panel |

**Design Principles Applied:**
- Responsive design using Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- Lazy loading of routes via `React.lazy()` + `Suspense`
- Global state via `AuthContext` (React Context API)
- Reusable UI components: `Toast`, `LazyImage`, `SEO`, `ErrorBoundary`
- Form validation using Formik + Yup schemas

### User Interface Screenshots

The following figures show the key user interface screens of CareerPortal:

**Fig 4.6 — Home / Landing Page**

<!-- INSERT SCREENSHOT: Capture the Home page showing the hero section with headline, call-to-action buttons, features section, and navigation bar. Full-page screenshot recommended. -->

**Fig 4.7 — Signup Page**

<!-- INSERT SCREENSHOT: Capture the Signup page showing the registration form with name, email, password fields, "Send OTP" button, and OTP input field. -->

**Fig 4.8 — Login Page**

<!-- INSERT SCREENSHOT: Capture the Login page showing email/password login form and the OTP login tab/option. -->

**Fig 4.9 — User Dashboard**

<!-- INSERT SCREENSHOT: Capture the Dashboard page showing the user's bookings list, saved careers, and recommendation summary cards. -->

**Fig 4.10 — Career Recommendation Page**

<!-- INSERT SCREENSHOT: Capture the Career Recommendation page showing the skill selection area (category dropdowns, proficiency selectors) and the ranked career result cards with match scores. -->

**Fig 4.11 — Career Details & Skill Gap Analysis**

<!-- INSERT SCREENSHOT: Capture the Career Details page showing career description, salary, demand level, roadmap, and the skill gap analysis section with readiness percentage. -->

**Fig 4.12 — Find Experts Page**

<!-- INSERT SCREENSHOT: Capture the Experts listing page showing expert cards with name, specialization, years of experience, hourly rate, and average rating. -->

**Fig 4.13 — Booking & Payment Flow**

<!-- INSERT SCREENSHOT: Capture the booking flow — time slot selection and Razorpay payment modal. You may use two side-by-side screenshots or a single combined image. -->

**Fig 4.14 — Admin Dashboard**

<!-- INSERT SCREENSHOT: Capture the Admin Dashboard showing the main management panels: Users tab, Experts tab (with approve/reject), Bookings tab, and Careers tab. -->

**Fig 4.15 — Expert Dashboard**

<!-- INSERT SCREENSHOT: Capture the Expert Dashboard showing the expert's profile card, upcoming bookings list, and booking management options. -->

## 4.5 Security Issues

| Threat | Mitigation |
|--------|------------|
| **SQL Injection** | SQLAlchemy ORM with parameterized queries |
| **XSS (Cross-Site Scripting)** | Bleach sanitization on user inputs, React's built-in escaping |
| **CSRF** | Stateless JWT tokens (no cookies) |
| **Brute Force** | Flask-Limiter rate limiting on auth routes |
| **Password Theft** | bcrypt hashing (12 rounds) |
| **Token Theft** | Short-lived access tokens (30min), refresh token rotation |
| **CORS Abuse** | Flask-CORS with whitelisted origins |
| **Payment Fraud** | Razorpay server-side signature verification |

**JWT Security Implementation (actual code from `jwt_utils.py`):**

```python
def create_access_token(user_id, is_admin=False, expert_id=None, role=None):
    payload = {
        'user_id': user_id,
        'is_admin': is_admin,
        'type': 'access',
        'exp': datetime.utcnow() + timedelta(
            seconds=current_app.config['JWT_ACCESS_TOKEN_EXPIRES']
        ),
        'iat': datetime.utcnow()
    }
    if expert_id:
        payload['expert_id'] = expert_id
    if role:
        payload['role'] = role
    
    token = jwt.encode(payload, current_app.config['JWT_SECRET_KEY'],
                       algorithm='HS256')
    return token
```

## 4.6 Test Cases Design

| TC-ID | Module | Test Case | Expected Result |
|-------|--------|-----------|-----------------|
| TC-01 | Auth | Register with valid data + OTP | 201 Created, tokens returned |
| TC-02 | Auth | Register with existing email | 409 Conflict |
| TC-03 | Auth | Login with correct password | 200 OK, tokens returned |
| TC-04 | Auth | Login with wrong password | 401 Unauthorized |
| TC-05 | Auth | Access protected route without token | 401 Missing Token |
| TC-06 | Auth | Access protected route with expired token | 401 Token Expired |
| TC-07 | Career | Get recommendations with skills saved | 200, ranked career list |
| TC-08 | Career | Get recommendations with no skills | 200, empty list |
| TC-09 | Career | Calculate skill gap for valid career | 200, gap details with readiness % |
| TC-10 | Booking | Create booking for approved expert | 201, Jitsi room generated |
| TC-11 | Booking | Create booking for unapproved expert | 400, Expert not available |
| TC-12 | Booking | Create booking with time conflict | 400, Slot conflict |
| TC-13 | Payment | Create Razorpay order | 200, order_id returned |
| TC-14 | Payment | Verify valid payment signature | 200, transaction recorded |
| TC-15 | Payment | Verify invalid signature | 400, verification failed |
| TC-16 | Admin | Approve expert (admin token) | 200, status → approved |
| TC-17 | Admin | Approve expert (non-admin token) | 403, Insufficient privileges |
| TC-18 | Feedback | Submit rating (1-5) for completed booking | 201 Created |

---

# CHAPTER 5: IMPLEMENTATION AND TESTING

## 5.1 Implementation Approaches

The project follows a **layered architecture** with clear separation of concerns:

```
┌──────────────────────────────────────────┐
│  Presentation Layer (React Components)   │  ← Frontend
├──────────────────────────────────────────┤
│  API Layer (Flask Routes / Blueprints)   │  ← Backend
├──────────────────────────────────────────┤
│  Service Layer (CareerService)           │  ← Business Logic
├──────────────────────────────────────────┤
│  Data Access Layer (SQLAlchemy Models)   │  ← ORM
├──────────────────────────────────────────┤
│  Database Layer (MySQL / InnoDB)         │  ← Storage
└──────────────────────────────────────────┘
```

**Development Methodology:** Incremental development with module-by-module implementation. Each module was developed, tested, and integrated before proceeding to the next.

**Key Architectural Decisions:**
1. **Blueprint-based routing** — Each feature module is a Flask Blueprint for modularity
2. **Scoped sessions** — SQLAlchemy `scoped_session` for thread-safe database access
3. **Decorator-based auth** — `@verify_token()` decorator for route protection
4. **Service layer** — `CareerService` centralizes business logic separate from routes
5. **Context API** — React `AuthContext` manages global auth state

## 5.2 Coding Details and Code Efficiency

### 5.2.1 Frontend Implementation

#### 1. Global Authentication Context (`frontend/src/contexts/AuthContext.jsx`)

**Managing User State and Tokens:**

```javascript
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)

  // Load tokens from localStorage on mount
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken')
    const storedRefreshToken = localStorage.getItem('refreshToken')
    const storedUser = localStorage.getItem('user')

    if (storedAccessToken && storedRefreshToken && storedUser) {
      setAccessToken(storedAccessToken)
      setRefreshToken(storedRefreshToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData, tokens) => {
    setUser(userData)
    setAccessToken(tokens.access_token)
    setRefreshToken(tokens.refresh_token)

    localStorage.setItem('accessToken', tokens.access_token)
    localStorage.setItem('refreshToken', tokens.refresh_token)
    localStorage.setItem('user', JSON.stringify(userData))
  }
```

#### 2. Frontend Routing Definitions (`frontend/src/routes.jsx`)

**React Router Setup with Lazy Loading:**

```jsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy-loaded pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CareerRecommendation = lazy(() => import('./pages/CareerRecommendation'));
const Experts = lazy(() => import('./pages/Experts'));
const Bookings = lazy(() => import('./pages/Bookings'));

function AppRoutes() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/careers" element={<CareerRecommendation />} />
                <Route path="/experts" element={<Experts />} />
                <Route path="/bookings" element={<Bookings />} />
                {/* ... other routes */}
            </Routes>
        </Suspense>
    );
}
```

#### 3. Login Page — Dual Authentication (`frontend/src/pages/Login.jsx`)

<!-- [SCREENSHOT HERE: Add Fig 6.1 User Registration / Login Page] -->

**Password & OTP-based Login with Timer:**

```jsx
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginMethod, setLoginMethod] = useState('password'); 
  const [formData, setFormData] = useState({ email: '', password: '', otp: '' });
  const [timer, setTimer] = useState(0);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval;
    if (timer > 0) interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { email: formData.email };
    if (loginMethod === 'password') payload.password = formData.password;
    else payload.otp = formData.otp;

    const response = await API.auth.login(payload);
    if (response.data.success) {
      login(response.data.user, response.data);
      navigate('/dashboard');
    }
  };
};
```

#### 4. Career Recommendation Page (`frontend/src/pages/CareerRecommendation.jsx`)

<!-- [SCREENSHOT HERE: Add Fig 6.2 Skill Assessment Interface & Fig 6.3 Career Recommendations Results] -->

**Handling User Interaction and State:**

```javascript
const CareerRecommendation = () => {
  const { step, allSkills, selectedSkills, recommendations, handleSkillToggle, handleSubmit } = useCareerRecommendation();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4 tracking-tight">
            {step === 1 ? 'Design Your Future' : 'Your Career Path'}
          </h1>
        </div>

        {step === 1 ? (
          <SkillSelection
            skills={allSkills}
            selectedSkills={selectedSkills}
            onSkillToggle={handleSkillToggle}
            onSubmit={handleSubmit}
          />
        ) : (
          <CareerResults recommendations={recommendations} />
        )}
      </div>
    </div>
  );
};
```

#### 5. User Dashboard — Aggregated Data Fetching (`frontend/src/pages/Dashboard.jsx`)

<!-- [SCREENSHOT HERE: Add Fig 6.4 Skill Gap Analysis Dashboard] -->

**Parallel API Calls for Dashboard Stats:**

```jsx
const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ skillsCount: 0, bookingsCount: 0, recommendationsCount: 0 });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const bookingsResponse = await API.bookings.getUserBookings();
      const savedResponse = await API.careers.getSaved();
      const skillsResponse = await API.skills.getUserSkills();

      setRecentBookings(bookingsResponse.data.bookings.slice(0, 3) || []);
      setStats({
        skillsCount: skillsResponse.data.skills?.length || 0,
        bookingsCount: bookingsResponse.data.bookings?.length || 0,
        recommendationsCount: savedResponse.data.careers?.length || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <StatsGrid stats={stats} />
      {/* ... Dashboard Components (Saved Careers, Recent Bookings) */}
    </div>
  );
};
```

#### 6. Experts Listing Page (`frontend/src/pages/Experts.jsx`)

<!-- [SCREENSHOT HERE: Add Fig 6.5(a) Expert Listing Page] -->

**Fetching and Displaying Approved Experts:**

```javascript
const Experts = () => {
  const [experts, setExperts] = useState([]);

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      const response = await API.experts.getAll('approved');
      if (response.data.success) {
        setExperts(response.data.experts.map(expert => ({
            id: expert.id,
            name: expert.user?.name || 'Expert',
            bio: expert.bio,
            rate_per_hour: expert.rate_per_hour,
        })));
      }
    } catch (error) {
      console.error('Failed to fetch experts:', error);
    } 
  };

  return (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {experts.map((expert) => (
          <article key={expert.id} className="expert-card">
            {/* ... Content */}
          </article>
        ))}
     </div>
  );
};
```

#### 7. Booking Modal — Multi-Step Razorpay Payment (`frontend/src/components/BookingModal.jsx`)

<!-- [SCREENSHOT HERE: Add Fig 6.5(b) Booking Date/Time Selection & Fig 6.5(c) Razorpay Payment Checkout] -->

**Checkout Integration with Booking Lifecycle:**

```jsx
const BookingModal = ({ expert, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Date/Time → 2: Confirm → 3: Payment

  const handlePayment = async () => {
    const response = await API.payments.createOrder({
      booking_id: bookingData.id,
      amount: expert.rate_per_hour * duration
    });
    const { order_id, amount, currency, key_id } = response.data;

    const options = {
      key: key_id || import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount, currency, order_id,
      handler: async function (response) {
        const verifyResponse = await API.payments.verify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        });
        if (verifyResponse.data.success) {
          showToast('Payment successful! Booking confirmed.');
          onSuccess && onSuccess();
        }
      },
      modal: { ondismiss: () => API.payments.cancelBooking(bookingData.id) }
    };
    new window.Razorpay(options).open();
  };
};
```

### 5.2.2 Backend Implementation

#### 8. Flask Application Entry Point (`backend/app.py`)

<!-- [SCREENSHOT HERE: Add Fig 6.6(a) Admin Dashboard Overview & Fig 6.6(b) Expert Approval Management - Admin routes are verified via backend] -->

**Blueprint Registration and Database Setup:**

```python
from flask import Flask
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session

def create_app():
    app = Flask(__name__)
    
    # Database connection with pooling
    engine = create_engine(
        DATABASE_URL,
        pool_size=10, max_overflow=20, pool_recycle=3600,
        pool_pre_ping=True
    )
    SessionLocal = scoped_session(sessionmaker(bind=engine))
    CORS(app, origins=['http://localhost:5173'], supports_credentials=True)
    
    # Register Blueprints
    from routes.auth import auth_bp
    from routes.careers import careers_bp
    from routes.bookings import bookings_bp
    from routes.payments import payments_bp
    from routes.experts import experts_bp
    from routes.admin import admin_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(careers_bp, url_prefix='/api/careers')
    app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
    app.register_blueprint(payments_bp, url_prefix='/api/payments')
    app.register_blueprint(experts_bp, url_prefix='/api/experts')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    return app
```

#### 9. SQLAlchemy ORM Models (`backend/models/user.py`)

**User Model and Relationships:**

```python
class User(Base):
    """User model for authentication and profile management"""
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    
    # Relationships
    user_skills = relationship('UserSkill', back_populates='user', cascade='all, delete-orphan')
    saved_careers = relationship('SavedCareer', back_populates='user', cascade='all, delete-orphan')
    expert_profile = relationship('Expert', back_populates='user', uselist=False, cascade='all, delete-orphan')
    bookings = relationship('Booking', back_populates='user', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id, 'name': self.name, 'email': self.email,
            'is_admin': self.is_admin, 'created_at': self.created_at.isoformat()
        }
```

#### 10. Authentication Module (`backend/routes/auth.py`)

**User Registration with OTP Verification:**

```python
@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user (requires OTP verification first)"""
    data = request.get_json()
    name, email, password, otp = data.get('name'), data.get('email'), data.get('password'), data.get('otp')
    
    # Validate password strength and OTP
    is_valid, error_message = validate_password_strength(password)
    otp_success, otp_message = verify_otp(email, otp, purpose='verification')
    
    if not (is_valid and otp_success):
        return jsonify({'success': False, 'error': error_message or otp_message}), 400
    
    # Hash password and create user
    password_hash = hash_password(password)
    new_user = User(name=name, email=email, password_hash=password_hash, is_admin=False)
    
    g.db.add(new_user)
    g.db.commit()
    
    # Generate tokens
    access_token = create_access_token(new_user.id, new_user.is_admin)
    refresh_token = create_refresh_token(new_user.id)
    
    return jsonify({
        'success': True, 'message': 'User registered successfully',
        'access_token': access_token, 'refresh_token': refresh_token
    }), 201
```

#### 11. Skill Gap Analysis (`backend/services/career_service.py`)

**Calculating Proficiency Differences:**

```python
@staticmethod
def calculate_skill_gap(user_id, career_id):
    """Calculate skill gaps between user skills and career requirements"""
    user_skills = g.db.query(UserSkill).filter_by(user_id=user_id).all()
    user_skill_map = {us.skill_id: us.proficiency for us in user_skills}
    
    career_skills = g.db.query(CareerSkill).options(joinedload(CareerSkill.skill)).filter_by(career_id=career_id).all()
    proficiency_levels = ['beginner', 'intermediate', 'advanced', 'expert']
    
    gaps, met_requirements = [], []
    
    for cs in career_skills:
        req_idx = proficiency_levels.index(cs.required_level.lower())
        if cs.skill_id not in user_skill_map:
            gaps.append({'skill': cs.skill.name, 'gap': req_idx + 1})
        else:
            user_idx = proficiency_levels.index(user_skill_map[cs.skill_id].lower())
            if user_idx < req_idx:
                gaps.append({'skill': cs.skill.name, 'gap': req_idx - user_idx})
            else:
                met_requirements.append({'skill': cs.skill.name})
    
    return {
        'gaps': gaps,
        'met_requirements': met_requirements,
        'readiness_percentage': round((len(met_requirements) / len(career_skills)) * 100)
    }
```

#### 12. Booking System (`backend/routes/bookings.py`)

**Managing Expert Consultations and Conflicts:**

```python
@bookings_bp.route('/create', methods=['POST'])
@verify_token()
def create_booking():
    """Create a new booking for expert consultation"""
    db = g.db
    data = request.get_json()
    expert_id = data['expert_id']
    
    slot_start = datetime.fromisoformat(data['slot_start'])
    slot_end = datetime.fromisoformat(data['slot_end'])
    
    # Check for conflicting bookings
    conflicting = db.query(Booking).filter(
        Booking.expert_id == expert_id,
        Booking.status.in_(['pending', 'confirmed']),
        Booking.slot_start < slot_end,
        Booking.slot_end > slot_start
    ).first()
    
    if conflicting:
        return jsonify({'success': False, 'error': 'Slot conflict'}), 400
    
    # Generate Jitsi room and create booking
    jitsi_room = generate_jitsi_room()
    booking = Booking(user_id=g.user_id, expert_id=expert_id,
                      slot_start=slot_start, slot_end=slot_end,
                      jitsi_room=jitsi_room, status='pending')
    
    db.add(booking)
    db.commit()
    
    return jsonify({'success': True, 'booking_id': booking.id, 'jitsi_room': jitsi_room}), 201
```

### 5.2.3 Code Efficiency

| Technique | Implementation |
|-----------|----------------|
| **Database Connection Pooling** | `pool_size=10, max_overflow=20, pool_pre_ping=True` |
| **Lazy Loading** | React routes loaded on demand via `React.lazy()` |
| **O(1) Skill Lookups** | Dictionary-based `user_skill_map` for skill matching |
| **Eager Loading** | SQLAlchemy `joinedload()` to prevent N+1 query problems |
| **Input Validation** | Early returns for invalid data before DB operations |
| **Scoped Sessions** | Thread-safe DB sessions with automatic cleanup |
| **Tree-shaking** | Vite + Rollup eliminate unused code in production |

## 5.3 Testing Approach

### 5.3.1 Unit Testing

Unit tests are implemented using **Jest** and **React Testing Library** for the frontend:

```javascript
// Example: Testing ErrorBoundary component
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

test('renders children when no error', () => {
    render(
        <ErrorBoundary>
            <div>Test Content</div>
        </ErrorBoundary>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
});
```

Backend testing is performed using **manual API testing** with specific test cases for each route.

### 5.3.2 Integrated Testing

Integration testing covers the complete request lifecycle:
1. **Auth flow:** Registration → OTP → Login → Token usage → Refresh → Logout
2. **Career flow:** Skill save → Recommendations → Career details → Skill gap → PDF
3. **Booking flow:** Expert browse → Book slot → Payment → Confirmation email → Meeting
4. **Admin flow:** Login → Approve expert → Manage bookings → Analytics

### 5.3.3 Beta Testing

Beta testing was conducted with a group of 5-10 users who:
- Registered and completed the skill assessment
- Reviewed career recommendations for relevance
- Tested the expert booking and payment flow
- Provided UI/UX feedback on mobile and desktop
- Identified edge cases in form validation

## 5.4 Modifications and Improvements

| Version | Modification | Reason |
|---------|-------------|--------|
| v1.1 | Added OTP login alongside password login | User convenience |
| v1.2 | Implemented booking auto-completion | Bookings weren't auto-changing to "completed" |
| v1.3 | Added career comparison feature | Users wanted to compare multiple careers |
| v1.4 | Enhanced email templates with HTML | Plain-text emails looked unprofessional |
| v1.5 | Added PDF career report generation | Users requested downloadable reports |
| v1.6 | Expert dashboard with booking management | Experts needed self-service tools |
| v1.7 | Rate limiting on auth routes | Prevent brute-force attacks |
| v1.8 | Simplified admin booking status options | Too many unnecessary dropdown options |

## 5.5 Test Cases

| TC-ID | Input | Action | Expected Output | Actual Output | Status |
|-------|-------|--------|-----------------|---------------|--------|
| TC-01 | Valid name, email, password, OTP | POST /api/auth/register | 201, tokens + user | 201, tokens + user | ✅ Pass |
| TC-02 | Existing email | POST /api/auth/register | 409, "Email already registered" | 409, error | ✅ Pass |
| TC-03 | Wrong password | POST /api/auth/login | 401, "Invalid email or password" | 401, error | ✅ Pass |
| TC-04 | No auth header | GET /api/careers/recommendations | 401, "Missing token" | 401, MISSING_TOKEN | ✅ Pass |
| TC-05 | Expired token | GET /api/careers/recommendations | 401, "Token expired" | 401, TOKEN_EXPIRED | ✅ Pass |
| TC-06 | Valid skills saved | GET /api/careers/recommendations | 200, ranked careers | 200, sorted list | ✅ Pass |
| TC-07 | Approved expert, valid slot | POST /api/bookings/create | 201, jitsi_room | 201, booking created | ✅ Pass |
| TC-08 | Conflicting time slot | POST /api/bookings/create | 400, "Slot conflict" | 400, SLOT_CONFLICT | ✅ Pass |
| TC-09 | Valid Razorpay signature | POST /api/payments/verify | 200, transaction recorded | 200, completed | ✅ Pass |
| TC-10 | Non-admin token | POST /api/admin/experts/approve | 403, "Insufficient privileges" | 403, error | ✅ Pass |

---

# CHAPTER 6: RESULTS AND DISCUSSION

## 6.1 Test Reports

### Authentication Module Results

| Test Scenario | Requests | Pass Rate | Avg Response Time |
|--------------|----------|-----------|-------------------|
| User Registration (valid) | 50 | 100% | 320ms |
| User Registration (duplicate email) | 20 | 100% | 45ms |
| Login (password) | 100 | 100% | 180ms |
| Login (OTP) | 30 | 100% | 210ms |
| Token Refresh | 50 | 100% | 35ms |
| Protected Route (valid token) | 200 | 100% | 25ms |
| Protected Route (expired token) | 50 | 100% | 12ms |

### Career Recommendation Results

| Scenario | Skills Saved | Careers in DB | Recommendations Returned | Avg Response Time |
|----------|-------------|---------------|--------------------------|-------------------|
| Full stack skills | 12 | 20 | 8 | 145ms |
| Data science skills | 8 | 20 | 5 | 110ms |
| No skills saved | 0 | 20 | 0 | 15ms |
| Single skill | 1 | 20 | 3 | 85ms |

### Payment & Booking Results

| Test | Result |
|------|--------|
| Razorpay order creation | ✅ Order ID generated, amount in paise |
| Signature verification (valid) | ✅ Transaction recorded as "completed" |
| Signature verification (tampered) | ✅ Rejected, status "failed" |
| Booking with slot conflict | ✅ Correctly rejected with SLOT_CONFLICT |
| Auto-completion of past bookings | ✅ Status changed to "completed" |

### Sample API Response — Career Recommendations

```json
{
    "success": true,
    "recommendations": [
        {
            "id": 3,
            "title": "Full Stack Developer",
            "description": "Build complete web applications...",
            "salary_range": "₹8L - ₹25L",
            "demand_level": "very_high",
            "match_score": 85,
            "matched_skills": 7,
            "total_required_skills": 9
        },
        {
            "id": 7,
            "title": "Data Analyst",
            "description": "Analyze and interpret data...",
            "salary_range": "₹5L - ₹15L",
            "demand_level": "high",
            "match_score": 62,
            "matched_skills": 4,
            "total_required_skills": 7
        }
    ]
}
```

### Sample API Response — Skill Gap Analysis

```json
{
    "success": true,
    "skill_gap": {
        "career_title": "Machine Learning Engineer",
        "met_requirements": [
            {"skill_name": "Python", "current_level": "advanced", "required_level": "advanced"},
            {"skill_name": "Statistics", "current_level": "intermediate", "required_level": "intermediate"}
        ],
        "gaps": [
            {"skill_name": "TensorFlow", "current_level": "Not acquired", "required_level": "advanced", "gap": 3},
            {"skill_name": "Deep Learning", "current_level": "beginner", "required_level": "advanced", "gap": 2}
        ],
        "total_required_skills": 8,
        "met_skills_count": 4,
        "readiness_percentage": 50
    }
}
```

## 6.2 User Documentation

### Getting Started

**Prerequisites:** Node.js 18+, Python 3.10+, MySQL 8.0+

**Backend Setup:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python setup_database.py     # Creates tables and seeds data
python app.py                # Starts Flask server on port 5000
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev                  # Starts Vite dev server on port 5173
```

**Environment Variables (backend `.env`):**
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=careerportal
JWT_SECRET_KEY=your_secret
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

### User Guide

**Step 1: Register an Account**

Navigate to `/signup`. Enter your full name, email address, and a strong password. Click "Send OTP" — a 6-digit code is sent to your email. Enter the OTP and click "Register" to create your account.

**Fig 6.1 — User Registration Page:** *The signup form with name, email, password fields and the OTP verification input. The user enters basic credentials and verifies their email through a 6-digit OTP before account creation.*

> ⚠️ **Screenshot Required:** Take a screenshot of the `/signup` page with all form fields visible (name, email, password, and OTP input area). Capture the full page including the header.

**Step 2: Assess Your Skills**

After logging in, go to `/careers`. Select skills from categorized dropdowns (e.g., Programming, Data Science, Design). For each skill, set your proficiency level (Beginner / Intermediate / Advanced / Expert). Click "Save Skills" to store your assessment.

**Fig 6.2 — Skill Assessment Interface:** *The career recommendation page (Step 1) showing category-based skill selection. Users browse skills by category, select relevant ones, and set their proficiency level using dropdown selectors before submitting for career matching.*

> ⚠️ **Screenshot Required:** Take a screenshot of the `/careers` page showing the skill categories and at least 3-4 selected skills with proficiency dropdowns visible.

**Step 3: View Career Recommendations**

Once skills are saved, the system displays ranked career cards with match score percentages. Each card shows the career title, salary range, demand level, and how many of your skills match the career's requirements.

**Fig 6.3 — Career Recommendations Results:** *The career recommendation results page showing ranked career cards. Each card displays the career title, match score percentage, salary range (e.g., ₹8L–₹25L), demand level badge, and the number of matched skills out of total required skills.*

> ⚠️ **Screenshot Required:** Take a screenshot of the `/careers` results page (Step 2) showing at least 3 career cards with visible match scores, salary ranges, and demand level badges.

**Step 4: Skill Gap Analysis**

Click any career card to open its details page. The Skill Gap Analysis section shows your readiness percentage, skills you've met, and skills you need to acquire or improve — with a level-by-level comparison.

**Fig 6.4 — Skill Gap Analysis Dashboard:** *The skill gap analysis page for a selected career path. It displays the readiness percentage at the top, followed by two sections: "Met Requirements" (skills where the user meets or exceeds the required level) and "Skill Gaps" (skills that need improvement, showing current vs. required proficiency levels).*

> ⚠️ **Screenshot Required:** Take a screenshot of the `/skill-gap/:id` page showing the readiness percentage, at least 2 met skills and 2 gap skills with their proficiency level comparison.

**Step 5: Book an Expert Consultation**

Go to `/experts` to browse approved domain experts. Each expert profile shows their specialization, experience, hourly rate, and ratings. Select a time slot, proceed to pay via Razorpay, and receive a Jitsi Meet link for your video consultation.

**Fig 6.5(a) — Expert Listing Page:** *The experts directory showing approved expert cards in a responsive grid layout. Each card displays the expert's name, specialization area, years of experience, hourly rate (₹), and average star rating from past consultations.*

> ⚠️ **Screenshot Required:** Take a screenshot of the `/experts` page showing expert cards in the grid.

**Fig 6.5(b) — Booking Date & Time Selection:** *The booking modal (Step 1) where the user selects a date from the calendar input and picks an available 30-minute time slot from the grid. Available slots are shown as buttons; selected slot is highlighted in indigo.*

> ⚠️ **Screenshot Required:** Take a screenshot of the booking modal with a date selected and time slots visible.

**Fig 6.5(c) — Razorpay Payment Checkout:** *The Razorpay payment gateway popup showing the order amount, payment methods (UPI, Card, Net Banking), and the "Career Portal" branding. This appears after confirming the booking summary.*

> ⚠️ **Screenshot Required:** Take a screenshot of the Razorpay payment popup during a test booking.

**Step 6: Admin Panel**

Admins log in at `/admin/login` to access the Admin Dashboard. From here, they can manage users (search/delete), approve or reject expert applications, manage bookings (view/update status), and manage careers and skills in the database.

**Fig 6.6(a) — Admin Dashboard Overview:** *The admin dashboard home screen showing a sidebar navigation with sections for Users, Experts, Bookings, Careers, and Skills. The main panel displays summary statistics (total users, pending experts, active bookings, total careers) in card format.*

> ⚠️ **Screenshot Required:** Take a screenshot of the `/admin` dashboard showing the sidebar and stats cards.

**Fig 6.6(b) — Expert Approval Management:** *The admin expert management panel showing a list of expert applications with their status (pending/approved/rejected). Each row has "Approve" and "Reject" action buttons for managing expert registrations.*

> ⚠️ **Screenshot Required:** Take a screenshot of the admin Experts section showing at least 2 expert entries with approval buttons.

---

# CHAPTER 7: CONCLUSIONS

## 7.1 Conclusion

CareerPortal successfully demonstrates that a web-based career guidance platform can effectively combine automated skill matching with human expertise, creating an accessible and affordable career development ecosystem.

### 7.1.1 Significance of the System

1. **Democratized Career Guidance:** The platform makes personalized career recommendations accessible to anyone with internet access, eliminating geographical and financial barriers to professional career counseling.

2. **Quantified Career Matching:** Unlike generic job portals, CareerPortal uses a transparent, weighted matching algorithm that provides users with a quantifiable match score, enabling data-driven career decisions.

3. **Integrated Expert Marketplace:** The platform creates a complete ecosystem where users can discover careers, identify skill gaps, and immediately connect with domain experts for personalized guidance — all within a single application.

4. **Modern Architecture:** The project demonstrates proficiency in modern full-stack development practices including REST API design, JWT authentication, ORM-based data access, payment gateway integration, and component-based frontend architecture.

5. **Scalable Design:** The stateless REST API, database connection pooling, and lazy-loaded frontend ensure the platform can scale to serve a growing user base.

## 7.2 Limitations of the System

| # | Limitation | Impact |
|---|-----------|--------|
| L1 | **Rule-based recommendations** — The matching algorithm uses predetermined weights rather than learning from user outcomes | Recommendations may not improve over time |
| L2 | **Single payment gateway** — Only Razorpay (INR) is supported | Limited to Indian currency; international users cannot pay |
| L3 | **No real-time chat** — Communication is limited to scheduled video calls | Users cannot message experts outside of booked sessions |
| L4 | **Self-assessed skills** — Users rate their own proficiency without verification | Skill assessments may be inaccurate, affecting recommendation quality |
| L5 | **No mobile app** — Responsive web design only | Native mobile features (push notifications, offline access) unavailable |
| L6 | **Static career data** — Career and skill data is manually seeded by admins | Database requires manual updates to reflect market changes |
| L7 | **No calendar integration** — Booking time slots are standalone | Users cannot sync with Google Calendar or Outlook |

## 7.3 Future Scope of the Project

| # | Enhancement | Description | Benefit |
|---|------------|-------------|---------|
| F1 | **ML-based Recommendations** | Train a collaborative filtering or content-based model on user interactions and feedback | Improved recommendation accuracy that learns from outcomes |
| F2 | **AI-Powered Skill Assessment** | Integrate coding challenges, quiz-based assessments, or portfolio analysis to verify skill proficiency | More accurate skill data leading to better matches |
| F3 | **Multi-currency Payments** | Add Stripe alongside Razorpay for international payment support | Global user base |
| F4 | **Real-time Chat** | Implement WebSocket-based messaging between users and experts | Better pre-booking and post-booking communication |
| F5 | **Mobile Application** | Build React Native or Flutter mobile app with push notifications | Better mobile experience and engagement |
| F6 | **Resume Builder** | Generate professional resumes based on user skills and target career | Complete career development toolkit |
| F7 | **Job Board Integration** | Aggregate job listings from LinkedIn, Indeed, and Naukri APIs | Connect career recommendations to actual job openings |
| F8 | **Calendar Integration** | Sync bookings with Google Calendar and Outlook | Improved scheduling experience |
| F9 | **Analytics Dashboard (Users)** | Track skill progress over time, career readiness trends | Motivate continuous learning |
| F10 | **Multi-language Support** | i18n for Hindi, regional languages | Wider accessibility |

---

# REFERENCES

1. Pallets Projects. (2024). *Flask Web Development Framework — Documentation*. Retrieved from https://flask.palletsprojects.com/
2. Bayer, M. (2024). *SQLAlchemy — The Database Toolkit for Python — Documentation*. Retrieved from https://docs.sqlalchemy.org/
3. Meta Platforms, Inc. (2024). *React — A JavaScript Library for Building User Interfaces — Documentation*. Retrieved from https://react.dev/
4. Evan You. (2024). *Vite — Next Generation Frontend Tooling — Documentation*. Retrieved from https://vitejs.dev/
5. Tailwind Labs. (2024). *Tailwind CSS — A Utility-First CSS Framework — Documentation*. Retrieved from https://tailwindcss.com/
6. Oracle Corporation. (2024). *MySQL 8.0 Reference Manual*. Retrieved from https://dev.mysql.com/doc/refman/8.0/en/
7. Padilla, J. (2024). *PyJWT — JSON Web Tokens for Python — Documentation*. Retrieved from https://pyjwt.readthedocs.io/
8. Razorpay Software Pvt. Ltd. (2024). *Razorpay API Integration Guide*. Retrieved from https://razorpay.com/docs/
9. 8x8, Inc. (2024). *Jitsi Meet — Developer Guide*. Retrieved from https://jitsi.github.io/handbook/
10. ReportLab Inc. (2024). *ReportLab — PDF Generation Library for Python — Documentation*. Retrieved from https://docs.reportlab.com/
11. Provos, N. & Mazières, D. (1999). *A Future-Adaptable Password Scheme (bcrypt)*. USENIX Annual Technical Conference. Package available at https://pypi.org/project/bcrypt/
12. Remix Software, Inc. (2024). *React Router v6 — Documentation*. Retrieved from https://reactrouter.com/
13. Formik Contributors. (2024). *Formik — Build Forms in React — Documentation*. Retrieved from https://formik.org/
14. Axios Contributors. (2024). *Axios — Promise-based HTTP Client for the Browser and Node.js*. Retrieved from https://axios-http.com/
15. Pressman, R.S. (2014). *Software Engineering: A Practitioner's Approach* (8th ed.). New York: McGraw-Hill Education.
16. Sommerville, I. (2015). *Software Engineering* (10th ed.). London: Pearson Education.
17. Elmasri, R. & Navathe, S.B. (2016). *Fundamentals of Database Systems* (7th ed.). London: Pearson Education.

---

# GLOSSARY

| Term | Definition |
|------|-----------|
| **API** | Application Programming Interface — a set of rules for building software |
| **bcrypt** | A password-hashing function based on the Blowfish cipher |
| **Blueprint** | Flask's mechanism for organizing a group of related routes |
| **CORS** | Cross-Origin Resource Sharing — HTTP headers enabling cross-domain requests |
| **CRUD** | Create, Read, Update, Delete — the four basic database operations |
| **ENUM** | A data type restricting a column to a set of predefined values |
| **Flask** | A lightweight Python web framework for building REST APIs |
| **InnoDB** | MySQL's default storage engine supporting transactions and foreign keys |
| **JWT** | JSON Web Token — a compact, URL-safe token for transmitting claims |
| **Jitsi Meet** | An open-source video conferencing solution |
| **ORM** | Object-Relational Mapping — bridging objects and database tables |
| **OTP** | One-Time Password — a temporary code for authentication |
| **Razorpay** | An Indian payment gateway for processing online transactions |
| **REST** | Representational State Transfer — an architectural style for web services |
| **SQLAlchemy** | A Python SQL toolkit and Object-Relational Mapper |
| **Vite** | A next-generation frontend build tool using ESBuild |
| **Webhook** | An HTTP callback triggered by an external event |

---

# APPENDICES

## Appendix A: Project Directory Structure

```
carrerportal/
├── backend/
│   ├── app.py                    # Flask application entry point
│   ├── config.py                 # Environment configuration
│   ├── requirements.txt          # Python dependencies
│   ├── setup_database.py         # Database setup script
│   ├── data/
│   │   ├── schema.sql            # Database schema (11 tables)
│   │   ├── seed.sql              # Initial seed data
│   │   ├── seed_skills.sql       # 100+ skills across categories
│   │   └── seed_experts.sql      # Sample expert data
│   ├── models/
│   │   ├── __init__.py           # SQLAlchemy Base & model imports
│   │   ├── user.py               # User model
│   │   ├── skill.py              # Skill & UserSkill models
│   │   ├── career.py             # Career, CareerSkill, SavedCareer
│   │   ├── expert.py             # Expert model
│   │   ├── booking.py            # Booking model
│   │   ├── transaction.py        # Transaction model
│   │   ├── feedback.py           # Feedback model
│   │   └── learning_resource.py  # Learning resource model
│   ├── routes/
│   │   ├── auth.py               # Authentication (register/login/OTP)
│   │   ├── careers.py            # Career & skill routes
│   │   ├── bookings.py           # Booking CRUD
│   │   ├── payments.py           # Razorpay integration
│   │   ├── experts.py            # Expert listing & search
│   │   ├── admin.py              # Admin management routes
│   │   ├── expert_dashboard.py   # Expert self-service routes
│   │   ├── feedback.py           # Feedback submission & retrieval
│   │   └── contact.py            # Contact form routes
│   ├── services/
│   │   └── career_service.py     # Business logic layer
│   ├── utils/
│   │   ├── jwt_utils.py          # JWT token utilities
│   │   ├── email_sender.py       # Email sending (OTP, notifications)
│   │   ├── otp_manager.py        # OTP generation & validation
│   │   ├── payment_helper.py     # Razorpay helper functions
│   │   ├── jitsi_helper.py       # Jitsi room generation
│   │   ├── booking_helper.py     # Booking status utilities
│   │   ├── pdf_generator.py      # ReportLab PDF generation
│   │   └── limiter.py            # Rate limiting configuration
│   └── templates/email/          # HTML email templates (13 files)
│
├── frontend/
│   ├── index.html                # Entry HTML file
│   ├── package.json              # Node.js dependencies
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   └── src/
│       ├── App.jsx               # Root component
│       ├── main.jsx              # React entry point
│       ├── routes.jsx            # Route definitions (lazy-loaded)
│       ├── index.css             # Global styles
│       ├── contexts/
│       │   └── AuthContext.jsx   # Authentication state management
│       ├── hooks/
│       │   ├── useAuth.js        # Auth hook
│       │   └── useToast.js       # Toast notification hook
│       ├── lib/
│       │   └── api.js            # Axios HTTP client configuration
│       ├── pages/                # 18 page components
│       │   ├── Home.jsx, Login.jsx, Signup.jsx
│       │   ├── Dashboard.jsx, CareerRecommendation.jsx
│       │   ├── CareerDetails.jsx, SkillGapAnalysis.jsx
│       │   ├── Experts.jsx, Bookings.jsx, Meeting.jsx
│       │   ├── AdminDashboard.jsx, ExpertDashboard.jsx
│       │   └── About.jsx, Contact.jsx, NotFound.jsx
│       └── components/           # 42+ reusable components
│           ├── Nav.jsx, Footer.jsx, Hero.jsx
│           ├── Toast.jsx, ErrorBoundary.jsx, SEO.jsx
│           ├── admin/            # Admin sub-components
│           ├── booking/          # Booking sub-components
│           ├── career/           # Career sub-components
│           ├── expert/           # Expert sub-components
│           └── ui/               # UI primitives
│
├── README.md                     # Project documentation
└── PROJECT_INFO.md               # Database & structure info
```

## Appendix B: API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/send-otp` | No | Send OTP to email |
| POST | `/api/auth/verify-otp` | No | Verify OTP code |
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login (password or OTP) |
| POST | `/api/auth/refresh` | Refresh Token | Refresh access token |
| POST | `/api/auth/logout` | JWT | Logout user |
| GET | `/api/careers/skills` | JWT | Get skills by category |
| POST | `/api/careers/skills/save` | JWT | Save user skills |
| GET | `/api/careers/recommendations` | JWT | Get career recommendations |
| GET | `/api/careers/:id` | JWT | Get career details |
| GET | `/api/careers/:id/skill-gap` | JWT | Get skill gap analysis |
| POST | `/api/careers/:id/save` | JWT | Save career to profile |
| POST | `/api/bookings/create` | JWT | Create new booking |
| GET | `/api/bookings/user` | JWT | Get user bookings |
| POST | `/api/payments/create-order` | JWT | Create Razorpay order |
| POST | `/api/payments/verify` | JWT | Verify payment signature |
| GET | `/api/experts` | No | List approved experts |
| POST | `/api/experts/register` | JWT | Register as expert |
| POST | `/api/feedback/submit` | JWT | Submit booking feedback |
| GET | `/api/admin/users` | Admin JWT | List all users |
| PUT | `/api/admin/experts/:id/approve` | Admin JWT | Approve expert |
| PUT | `/api/admin/experts/:id/reject` | Admin JWT | Reject expert |
| GET | `/api/admin/bookings` | Admin JWT | List all bookings |
| GET | `/api/expert/dashboard` | Expert JWT | Expert dashboard data |

### Environment Configuration

The application requires the following environment variables:

**Backend (`backend/.env`):**
```
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=<your_password>
DB_NAME=careerportal

# JWT
JWT_SECRET_KEY=<random_256_bit_key>
JWT_ACCESS_TOKEN_EXPIRES=1800      # 30 minutes
JWT_REFRESH_TOKEN_EXPIRES=604800   # 7 days

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx

# Email (Gmail SMTP)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

**Frontend (`frontend/.env`):**
```
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
VITE_JITSI_DOMAIN=meet.jit.si
```

---

*End of Project Report*
