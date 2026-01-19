# Implementation Plan

- [x] 1. Set up project structure and configuration





  - Create frontend and backend directory structure with all necessary folders
  - Initialize package.json with all dependencies (React, Vite, Tailwind, Formik, Axios, Framer Motion, etc.)
  - Create vite.config.js with base configuration and environment variable prefix
  - Set up Tailwind config with custom theme (gradient colors #6EE7B7→#3B82F6, accent #8B5CF6, Inter font)
  - Create postcss.config.cjs for Tailwind processing
  - Set up ESLint and Prettier configuration files
  - Create .env.example files for frontend and backend with all required variables
  - Create backend requirements.txt with Flask, Flask-CORS, Flask-Mail, SQLAlchemy, bcrypt, PyJWT, razorpay, mysql-connector-python
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 19.1, 19.2, 19.3, 19.4_

- [x] 2. Create database schema and seed data





  - [x] 2.1 Write schema.sql with all table definitions


    - Create users table with id, name, email, password_hash, is_admin, created_at
    - Create skills table with id, name, category
    - Create user_skills junction table with user_id, skill_id, proficiency
    - Create careers table with id, title, description, salary_range, demand_level, roadmap
    - Create career_skills junction table with career_id, skill_id, required_level
    - Create experts table with id, user_id, bio, resume_url, certificate_urls, rate_per_hour, status
    - Create bookings table with id, user_id, expert_id, slot_start, slot_end, jitsi_room, status
    - Create transactions table with id, booking_id, razorpay_order_id, razorpay_payment_id, amount, status
    - Create saved_careers, learning_resources, and feedbacks tables
    - Add all foreign key constraints and indexes
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 16.8_
  - [x] 2.2 Write seed.sql with sample data


    - Insert 6 sample skills across different categories
    - Insert 6 sample careers with descriptions and requirements
    - Insert career_skills relationships
    - Insert 8 portfolio items data (for reference)
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

- [x] 3. Implement backend core infrastructure




  - [x] 3.1 Create Flask application setup


    - Write backend/app.py with Flask app initialization
    - Configure CORS with Flask-CORS
    - Set up SQLAlchemy database connection
    - Create config.py for environment variable loading
    - Set up error handlers for 404, 500, and general exceptions
    - _Requirements: 7.1, 7.2, 7.3, 15.3, 15.4_
  - [x] 3.2 Implement JWT utilities


    - Write backend/utils/jwt_utils.py with token generation and validation functions
    - Implement create_access_token and create_refresh_token functions
    - Implement verify_token decorator for protected routes
    - _Requirements: 7.4, 7.5_
  - [x] 3.3 Create database models with SQLAlchemy


    - Define User, Skill, UserSkill, Career, CareerSkill models
    - Define Expert, Booking, Transaction models
    - Define SavedCareer, LearningResource, Feedback models
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 16.8_

- [x] 4. Implement authentication routes



  - [x] 4.1 Create registration endpoint


    - Write backend/routes/auth.py with POST /auth/register route
    - Validate email uniqueness and password strength
    - Hash password with bcrypt
    - Create user record in database
    - Return success response with user_id
    - _Requirements: 7.1, 7.2, 7.3_
  - [x] 4.2 Create login endpoint


    - Implement POST /auth/login route in auth.py
    - Verify email and password
    - Generate JWT access and refresh tokens
    - Return tokens and user data
    - _Requirements: 7.4_
  - [x] 4.3 Create token refresh and logout endpoints


    - Implement POST /auth/refresh route to generate new access token
    - Implement POST /auth/logout route to invalidate session
    - _Requirements: 7.5, 7.6_

- [x] 5. Implement contact form backend





  - [x] 5.1 Create email utility functions

    - Write backend/utils/email_sender.py with Flask-Mail configuration
    - Implement send_contact_email function using Flask-Mail
    - Create HTML email template at backend/templates/email/contact.html
    - Create plain-text email template fallback
    - Add optional SendGrid support with fallback logic
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - [x] 5.2 Create contact route with validation


    - Write backend/routes/contact.py with POST /contact route
    - Validate all required fields (fullName, email, message, consent)
    - Check honeypot field and reject if filled
    - Sanitize all input fields to prevent XSS
    - Call email sending function
    - Log contact data to backend/data/contacts.log in development mode
    - Return success/error JSON response
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 5.1, 5.5, 6.1, 6.2, 6.3, 6.4, 15.1, 15.3_
  - [x] 5.3 Implement rate limiting for contact endpoint


    - Add Flask-Limiter to requirements.txt
    - Configure rate limiting (5 requests per hour per IP)
    - _Requirements: 15.5_

- [x] 6. Implement skills and career recommendation routes





  - [x] 6.1 Create skills routes


    - Write backend/routes/careers.py with GET /skills endpoint
    - Return all skills organized by category
    - Implement POST /skills/user endpoint to save user skills
    - Validate proficiency levels and prevent duplicates
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  - [x] 6.2 Create career recommendation endpoint


    - Implement POST /careers/recommend route
    - Analyze user's saved skills from database
    - Calculate match scores for careers based on skill overlap
    - Return ranked list of recommended careers
    - _Requirements: 9.1, 9.2, 9.3_
  - [x] 6.3 Create career detail and skill gap routes


    - Implement GET /careers/:id endpoint with full career details
    - Implement GET /careers/:id/skill-gap endpoint
    - Calculate skill gaps between user skills and career requirements
    - Implement POST /careers/save endpoint to save careers to user profile
    - _Requirements: 9.3, 9.4, 9.5_
-

- [x] 7. Implement expert and booking routes



  - [x] 7.1 Create Jitsi helper utility


    - Write backend/utils/jitsi_helper.py with UUID generation function
    - Implement generate_jitsi_room function that creates unique room identifiers
    - _Requirements: 11.2, 11.3_
  - [x] 7.2 Create expert routes


    - Write backend/routes/experts.py with POST /experts/register endpoint
    - Validate expert registration data and set status to pending
    - Implement GET /experts endpoint with status filtering
    - Return approved experts with profile information
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  - [x] 7.3 Create booking routes


    - Write backend/routes/bookings.py with POST /bookings/create endpoint
    - Generate Jitsi room ID using helper function
    - Store booking with time slot and Jitsi room
    - Implement GET /bookings/user endpoint to retrieve user bookings
    - _Requirements: 11.1, 11.2, 11.3, 11.5_

- [x] 8. Implement payment processing routes





  - [x] 8.1 Create Razorpay helper utility


    - Write backend/utils/payment_helper.py with Razorpay client initialization
    - Implement create_razorpay_order function
    - Implement verify_razorpay_signature function
    - _Requirements: 12.1, 12.4, 12.5_
  - [x] 8.2 Create payment routes


    - Write backend/routes/payments.py with POST /payments/create-order endpoint
    - Create Razorpay order and return order_id to frontend
    - Implement POST /payments/verify endpoint
    - Verify payment signature using Razorpay secret
    - Update transaction status to completed on successful verification
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
-

- [-] 9. Set up frontend routing and global providers


  - [x] 9.1 Create main application entry point


    - Write frontend/src/main.jsx with React root rendering
    - Import and apply global CSS (Tailwind)
    - Set up React Router BrowserRouter
    - _Requirements: 1.1, 1.2_
  - [x] 9.2 Create route configuration


    - Write frontend/src/routes.jsx with all route definitions
    - Implement lazy loading for page components using React.lazy
    - Set up Suspense with loading fallback
    - Define routes for Home, Services, Portfolio, ProjectPage, About, Blog, PostPage, Contact, NotFound
    - _Requirements: 1.1, 1.2, 1.4, 1.5_
  - [x] 9.3 Create context providers


    - Create frontend/src/contexts/AuthContext.jsx for authentication state
    - Create frontend/src/contexts/ThemeContext.jsx for dark mode state
    - Implement localStorage persistence for theme preference
    - Detect system color scheme preference with prefers-color-scheme
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [x] 9.4 Create App.jsx with providers and error boundary



    - Write frontend/src/App.jsx wrapping routes with providers
    - Implement ErrorBoundary component for global error catching
    - _Requirements: 1.4_

- [x] 10. Create API client and utilities





  - [x] 10.1 Set up Axios instance


    - Write frontend/src/lib/api.js with configured Axios instance
    - Set baseURL from VITE_API_URL environment variable
    - Add request interceptor to attach JWT token from AuthContext
    - Add response interceptor to handle 401 errors and token refresh
    - _Requirements: 7.4, 7.5_
  - [x] 10.2 Create API endpoint functions


    - Define functions for all backend endpoints (auth, skills, careers, experts, bookings, payments, contact)
    - Export organized API object with grouped methods
    - _Requirements: 4.3, 7.1, 7.4, 7.5, 8.1, 8.2, 9.1, 9.3, 9.4, 10.1, 10.3, 11.1, 11.5, 12.1, 12.3_
  - [x] 10.3 Create custom hooks


    - Write frontend/src/hooks/usePrefersReducedMotion.js to detect motion preference
    - Write frontend/src/hooks/useScrollSpy.js for active nav link detection
    - _Requirements: 2.5, 21.5_

- [x] 11. Implement global navigation and footer components





  - [x] 11.1 Create Nav component


    - Write frontend/src/components/Nav.jsx with logo and navigation links
    - Implement responsive hamburger menu for mobile with aria-expanded
    - Add active link highlighting based on current route
    - Implement scroll-based compression animation
    - Add "Get a Quote" CTA button linking to Contact page
    - Ensure keyboard accessibility with proper focus management
    - _Requirements: 1.1, 1.2, 1.3, 2.2, 2.3, 21.1, 21.2, 21.3, 21.4, 21.5_
  - [x] 11.2 Create Footer component


    - Write frontend/src/components/Footer.jsx with quick links
    - Add social media icons
    - Add newsletter subscription input (mock, no backend)
    - Add Terms and Privacy links
    - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5_
  - [x] 11.3 Create ThemeToggle component


    - Write frontend/src/components/ThemeToggle.jsx with toggle button
    - Connect to ThemeContext to update theme state
    - Display appropriate icon for current theme
    - _Requirements: 3.2, 3.3, 3.4_

- [x] 12. Create reusable UI components






  - [x] 12.1 Create Toast notification component

    - Write frontend/src/components/Toast.jsx with success and error variants
    - Implement auto-dismiss after 5 seconds
    - Add manual dismiss button
    - Use ARIA live regions for accessibility
    - _Requirements: 4.4, 4.5, 29.1, 29.2, 29.3, 29.4, 29.5_

  - [x] 12.2 Create Modal component

    - Write frontend/src/components/Modal.jsx with backdrop and content area
    - Implement Framer Motion animations for open/close
    - Add focus trap for accessibility
    - Handle ESC key and backdrop click to close
    - _Requirements: 23.2_
  - [x] 12.3 Create LazyImage component


    - Write frontend/src/components/LazyImage.jsx with loading="lazy"
    - Display skeleton placeholder while loading
    - Show error fallback if image fails to load
    - _Requirements: 30.1, 30.2, 30.5_

- [x] 13. Implement contact form components




  - [x] 13.1 Create ContactForm component


    - Write frontend/src/components/ContactForm.jsx using Formik
    - Define Yup validation schema for all fields
    - Add fields: fullName, businessName, email, phone, budgetRange, interestedService, message, consent
    - Add hidden honeypot field named "website"
    - Implement inline validation error display
    - Handle form submission with API call to /api/contact
    - Show Toast notification on success or error
    - Add optional reCAPTCHA integration hooks
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_
  - [x] 13.2 Write unit test for ContactForm


    - Create frontend/src/components/__tests__/ContactForm.test.jsx
    - Test validation errors for empty required fields
    - Test successful form submission
    - Test honeypot rejection
    - _Requirements: 18.6_
  - [x] 13.3 Create MiniContactForm component


    - Write frontend/src/components/MiniContactForm.jsx with simplified fields
    - Use same validation and submission logic as ContactForm
    - _Requirements: 25.5_

- [x] 14. Create portfolio components and data





  - [x] 14.1 Create portfolio data files


    - Write frontend/src/data/portfolio.js with 8 mock portfolio items
    - Include title, slug, tags, images (picsum URLs), description, techStack, challenge, solution, clientType
    - Create frontend/public/data/portfolio.json mirroring the same data
    - _Requirements: 13.1, 13.5_
  - [x] 14.2 Create ProjectCard component


    - Write frontend/src/components/ProjectCard.jsx displaying portfolio item preview
    - Show image, title, and tags
    - Implement hover animation with Framer Motion
    - Make card clickable to navigate to project detail page
    - _Requirements: 13.1, 23.1_
  - [x] 14.3 Create PortfolioGrid component


    - Write frontend/src/components/PortfolioGrid.jsx with grid layout
    - Implement tag-based filtering with keyboard-accessible controls
    - Implement debounced search input filtering by title/description
    - Render ProjectCard components for filtered items
    - _Requirements: 13.1, 13.2, 13.3, 13.4_
  - [x] 14.4 Create ProjectDetail component


    - Write frontend/src/components/ProjectDetail.jsx displaying full project information
    - Show image gallery, tech stack, challenge, solution, client type
    - Add "Contact about this project" CTA button
    - _Requirements: 13.5_

- [x] 15. Create service components and data






  - [x] 15.1 Create services data file

    - Write frontend/src/data/services.js with 5 services
    - Include Career Recommendation, Skill Gap Analysis, Expert Consultation, Resume Review, Interview Prep
    - Each service has icon, description bullets, timeline, priceRange
    - _Requirements: 14.1, 14.2_

  - [x] 15.2 Create ServiceCard component

    - Write frontend/src/components/ServiceCard.jsx displaying service information
    - Show icon, title, description, timeline, price range
    - Add "Request Quote" button that navigates to Contact with prefilled service
    - _Requirements: 14.2, 14.3_

- [x] 16. Create Hero and home page components




  - [x] 16.1 Create Hero component


    - Write frontend/src/components/Hero.jsx with large heading and subtitle
    - Add primary CTA "Get a Quote" and secondary CTA "Our Work"
    - Implement Framer Motion entrance animations
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5_
  - [x] 16.2 Create Home page


    - Write frontend/src/pages/Home.jsx with Hero component
    - Add services summary section rendering 3-5 ServiceCard components
    - Add featured portfolio carousel with 3 items
    - Add testimonials section with mock content
    - Add pricing CTA card for "Starter Pack"
    - Add MiniContactForm component
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 25.1, 25.2, 25.3, 25.4, 25.5_

- [x] 17. Create all page components





  - [x] 17.1 Create Services page


    - Write frontend/src/pages/Services.jsx displaying all services
    - Render ServiceCard components for each service

    - _Requirements: 14.1, 14.2, 14.3, 14.4_
  - [x] 17.2 Create Portfolio page

    - Write frontend/src/pages/Portfolio.jsx with PortfolioGrid component
    - Load portfolio data from src/data/portfolio.js
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

  - [x] 17.3 Create ProjectPage

    - Write frontend/src/pages/ProjectPage.jsx using useParams to get slug
    - Load project data by slug from portfolio data
    - Render ProjectDetail component
    - _Requirements: 13.5_

  - [x] 17.4 Create About page

    - Write frontend/src/pages/About.jsx with company story and mission
    - Add workflow timeline showing 5 phases (Discovery, Design, Build, Deliver, Support)
    - Add team member cards for 2 founders
    - Add achievement badges section
    - _Requirements: 26.1, 26.2, 26.3, 26.4, 26.5_

  - [x] 17.5 Create Blog and PostPage

    - Write frontend/src/data/blog.js with mock blog posts
    - Write frontend/src/pages/Blog.jsx displaying list of posts
    - Write frontend/src/pages/PostPage.jsx displaying full post content
    - Add social share buttons to PostPage
    - _Requirements: 27.1, 27.2, 27.3, 27.4, 27.5_

  - [x] 17.6 Create Contact page

    - Write frontend/src/pages/Contact.jsx with ContactForm component
    - Add alternate contact information section
    - Add Calendly embed placeholder
    - Add office address display
    - _Requirements: 28.1, 28.2, 28.3, 28.4, 28.5_

  - [x] 17.7 Create NotFound page

    - Write frontend/src/pages/NotFound.jsx with 404 message
    - Add link back to home page
    - _Requirements: 1.4_

- [x] 18. Implement Jitsi video integration






  - [x] 18.1 Create JitsiEmbed component

    - Write frontend/src/components/JitsiEmbed.jsx with iframe embed
    - Accept room ID as prop
    - Set iframe src to https://meet.jit.si/{roomId}
    - Make container responsive
    - _Requirements: 11.4_

  - [x] 18.2 Create booking and video consultation pages

    - Create page to display user bookings with expert info and time slots
    - Add button to join video call that renders JitsiEmbed component
    - _Requirements: 11.4, 11.5_

- [x] 19. Implement SEO and meta tags




  - [x] 19.1 Create SEO utility component


    - Write frontend/src/components/SEO.jsx using react-helmet-async or similar
    - Accept title, description, and ogImage props
    - Set document title and meta tags dynamically
    - _Requirements: 17.1, 17.2, 17.3_
  - [x] 19.2 Add SEO component to all pages

    - Import and use SEO component in each page with appropriate content
    - Set unique titles and descriptions for each route
    - _Requirements: 17.1, 17.2, 17.3_

- [x] 20. Implement admin and expert dashboards (advance)






  - [x] 20.1 Create advance Admin Dashboard page

    - Write frontend/src/pages/AdminDashboard.jsx with protected route
    - Also create Admin Login forms and required pages
    - Display advance stats and charts using Recharts
    - Display Users and which users booked which expert and there payment status
    - Show list of pending expert approvals
    - Show list of approved expert
    - _Requirements: 10.5_
  - [x] 20.2 Create advance Expert Dashboard page

    - Write frontend/src/pages/ExpertDashboard.jsx with protected route
    - Create Expert Login form and there related and required pages  
    - Display expert's upcoming bookings
    - Show earnings summary
    - _Requirements: 11.5_

- [x] 21. Add animations and micro-interactions



  - [x] 21.1 Add Framer Motion to card components


    - Add hover animations to ProjectCard and ServiceCard
    - Implement scale and shadow effects on hover
    - _Requirements: 23.1_
  - [x] 21.2 Add page transition animations


    - Wrap route components with Framer Motion AnimatePresence
    - Implement fade or slide transitions between pages
    - _Requirements: 23.4_
  - [x] 21.3 Ensure reduced motion support


    - Check usePrefersReducedMotion hook in all animated components
    - Disable decorative animations when user prefers reduced motion
    - _Requirements: 2.5, 23.5_

- [ ] 22. Create documentation and deployment files
  - [ ] 22.1 Write comprehensive README.md
    - Document local development setup for frontend and backend
    - Document database setup with schema.sql import
    - Document environment variable configuration
    - Document how to run contact flow locally and where logs are stored
    - Document deployment instructions for Vercel/Netlify (frontend) and Render/Heroku/VPS (backend)
    - Document Razorpay, SendGrid, and reCAPTCHA setup steps
    - Include Lighthouse optimization tips
    - _Requirements: 31.1, 31.2, 31.3, 31.4, 31.5_
  - [ ] 22.2 Create utility scripts
    - Write scripts/add-portfolio.js Node script to append to portfolio.json
    - _Requirements: 13.1_
  - [ ] 22.3 Set up Husky pre-commit hooks
    - Install Husky and configure pre-commit hook
    - Run ESLint and Prettier on staged files
    - _Requirements: 18.6_

- [ ] 23. Final integration and testing
  - [ ] 23.1 Test complete contact flow end-to-end
    - Submit contact form from frontend
    - Verify backend receives request
    - Verify email is sent (or logged in dev mode)
    - Verify toast notification displays
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.5, 6.1, 6.2, 6.3, 6.4_
  - [ ] 23.2 Test authentication flow
    - Test user registration
    - Test login and token generation
    - Test protected routes with JWT
    - Test token refresh
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_
  - [ ] 23.3 Test responsive design and accessibility
    - Test all pages on mobile, tablet, and desktop viewports
    - Test keyboard navigation throughout application
    - Run accessibility audit with browser tools
    - Test dark mode toggle and persistence
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5_
  - [ ] 23.4 Verify all requirements are met
    - Review requirements document and check each acceptance criterion
    - Fix any gaps or issues discovered
    - _Requirements: All_
