# Requirements Document

## Introduction

CarrerPortal is a modern, accessible, production-ready multi-page web application that provides skill-based career recommendations. The system enables users to discover career paths based on their skills, connect with experts for consultations, and access career development resources. The platform consists of a React-based frontend with multiple pages (Home, Services, Portfolio, About, Blog, Contact, Admin Dashboard, Expert Dashboard) and a Flask-based backend with MySQL database, supporting features like user authentication, skill assessment, career recommendations, expert bookings with video consultations via Jitsi Meet, and payment processing through Razorpay.

## Glossary

- **CarrerPortal System**: The complete web application including frontend React application and Flask backend API
- **User**: An individual who accesses the platform to explore career recommendations and services
- **Expert**: A registered professional who provides consultation services to users
- **Admin**: A system administrator with elevated privileges to manage the platform
- **Contact Flow**: The end-to-end process of submitting a contact form and receiving email notification
- **Skill Assessment**: The process of users selecting and rating their proficiency in various skills
- **Career Recommendation**: AI-driven suggestions for career paths based on user skills
- **Booking**: A scheduled consultation session between a user and an expert
- **Jitsi Room**: A video conferencing session hosted on Jitsi Meet platform
- **Razorpay Transaction**: A payment processed through the Razorpay payment gateway
- **Dark Mode**: A color scheme preference that uses darker backgrounds and lighter text
- **Portfolio Item**: A showcase project displayed in the portfolio section
- **Service**: A specific offering provided by CarrerPortal (e.g., Career Recommendation, Skill Gap Analysis)

## Requirements

### Requirement 1: Multi-Page Navigation

**User Story:** As a user, I want to navigate between different pages of the application, so that I can access various features and information.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL provide a navigation component with links to Home, Services, Portfolio, About, Blog, Contact, Admin Dashboard, and Expert Dashboard pages
2. WHEN a user clicks a navigation link, THE CarrerPortal System SHALL route to the corresponding page without full page reload
3. THE CarrerPortal System SHALL highlight the active navigation link based on the current route
4. WHEN a user accesses an invalid route, THE CarrerPortal System SHALL display a 404 Not Found page
5. THE CarrerPortal System SHALL implement lazy loading for page components to optimize initial load time

### Requirement 2: Responsive Design and Accessibility

**User Story:** As a user with any device or accessibility need, I want the application to be usable on my device and with my assistive technology, so that I can access all features regardless of my situation.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL render correctly on viewport widths from 320 pixels to 1920 pixels
2. THE CarrerPortal System SHALL use semantic HTML elements and ARIA attributes for screen reader compatibility
3. THE CarrerPortal System SHALL provide keyboard navigation support for all interactive elements
4. THE CarrerPortal System SHALL maintain color contrast ratios of at least 4.5:1 for normal text and 3:1 for large text
5. WHEN a user has enabled prefers-reduced-motion, THE CarrerPortal System SHALL disable or reduce animations

### Requirement 3: Dark Mode Support

**User Story:** As a user, I want to toggle between light and dark color schemes, so that I can use the application comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL detect the user's system color scheme preference via prefers-color-scheme media query
2. THE CarrerPortal System SHALL provide a toggle control to switch between light and dark modes
3. WHEN a user toggles dark mode, THE CarrerPortal System SHALL persist the preference to localStorage
4. WHEN a user returns to the application, THE CarrerPortal System SHALL apply the previously saved color scheme preference
5. THE CarrerPortal System SHALL apply appropriate color values for all UI components in both light and dark modes

### Requirement 4: Contact Form Submission

**User Story:** As a user, I want to submit a contact form with my inquiry, so that I can communicate with the CarrerPortal team.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL provide a contact form with fields for fullName, businessName, email, phone, budgetRange, interestedService, message, and consent checkbox
2. THE CarrerPortal System SHALL validate all required fields client-side before submission
3. WHEN a user submits a valid contact form, THE CarrerPortal System SHALL send the data to the backend API endpoint /api/contact
4. WHEN the backend successfully processes a contact submission, THE CarrerPortal System SHALL display a success toast notification
5. IF the backend returns an error, THEN THE CarrerPortal System SHALL display an error toast notification with the error message
6. THE CarrerPortal System SHALL include a hidden honeypot field to prevent automated spam submissions
7. THE CarrerPortal System SHALL provide inline validation error messages for invalid field values

### Requirement 5: Contact Email Notification

**User Story:** As an admin, I want to receive email notifications when users submit contact forms, so that I can respond to inquiries promptly.

#### Acceptance Criteria

1. WHEN the backend receives a valid contact form submission, THE CarrerPortal System SHALL send an email notification to the configured admin email address
2. THE CarrerPortal System SHALL support Gmail SMTP as the primary email delivery method
3. WHERE SendGrid API key is configured, THE CarrerPortal System SHALL use SendGrid as an alternative email delivery method
4. THE CarrerPortal System SHALL include all submitted form data in the email notification
5. THE CarrerPortal System SHALL use HTML email templates with plain-text fallback for email notifications

### Requirement 6: Contact Request Logging

**User Story:** As an admin, I want contact form submissions to be logged locally during development, so that I can review submissions without requiring email configuration.

#### Acceptance Criteria

1. WHEN running in development mode, THE CarrerPortal System SHALL append contact form submissions to a contacts.log file
2. THE CarrerPortal System SHALL store the contacts.log file in the backend/data directory
3. THE CarrerPortal System SHALL log the complete JSON payload of each contact submission
4. THE CarrerPortal System SHALL include a timestamp with each logged contact submission

### Requirement 7: User Authentication

**User Story:** As a user, I want to register and log in to the platform, so that I can access personalized features and save my progress.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL provide registration endpoint accepting name, email, and password
2. THE CarrerPortal System SHALL hash passwords using bcrypt before storing in the database
3. THE CarrerPortal System SHALL validate email uniqueness during registration
4. WHEN a user submits valid login credentials, THE CarrerPortal System SHALL return a JWT access token
5. THE CarrerPortal System SHALL provide a token refresh endpoint to obtain new access tokens
6. THE CarrerPortal System SHALL provide a logout endpoint to invalidate user sessions

### Requirement 8: Skill Management

**User Story:** As a user, I want to select and rate my skills, so that the system can provide accurate career recommendations.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL provide an endpoint to retrieve all available skills organized by category
2. THE CarrerPortal System SHALL allow users to save their selected skills with proficiency ratings
3. THE CarrerPortal System SHALL store user skills with proficiency levels (beginner, intermediate, advanced, expert)
4. THE CarrerPortal System SHALL associate saved skills with the authenticated user account
5. THE CarrerPortal System SHALL prevent duplicate skill entries for the same user

### Requirement 9: Career Recommendations

**User Story:** As a user, I want to receive career recommendations based on my skills, so that I can explore suitable career paths.

#### Acceptance Criteria

1. WHEN a user requests career recommendations, THE CarrerPortal System SHALL analyze the user's saved skills
2. THE CarrerPortal System SHALL return a ranked list of career options matching the user's skill profile
3. THE CarrerPortal System SHALL provide detailed information for each recommended career including title, description, required skills, salary range, and demand level
4. THE CarrerPortal System SHALL calculate and display skill gap analysis for each recommended career
5. THE CarrerPortal System SHALL allow users to save recommended careers to their profile

### Requirement 10: Expert Registration and Listing

**User Story:** As an expert, I want to register my profile with credentials and availability, so that users can book consultations with me.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL provide an expert registration endpoint accepting bio, resume URL, certificate URLs, and hourly rate
2. THE CarrerPortal System SHALL set expert status to pending upon registration
3. THE CarrerPortal System SHALL provide an endpoint to retrieve all approved experts
4. THE CarrerPortal System SHALL display expert profiles with bio, credentials, and hourly rate
5. WHERE an admin approves an expert, THE CarrerPortal System SHALL update the expert status to approved

### Requirement 11: Expert Booking and Video Consultation

**User Story:** As a user, I want to book consultation sessions with experts and join video calls, so that I can receive personalized career guidance.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL allow users to create bookings with selected experts for specific time slots
2. WHEN a booking is created, THE CarrerPortal System SHALL generate a unique Jitsi room identifier
3. THE CarrerPortal System SHALL store the Jitsi room identifier with the booking record
4. THE CarrerPortal System SHALL provide an interface to embed Jitsi Meet video conferencing using the generated room identifier
5. THE CarrerPortal System SHALL retrieve user bookings with associated expert and time slot information

### Requirement 12: Payment Processing

**User Story:** As a user, I want to pay for expert consultations securely, so that I can confirm my bookings.

#### Acceptance Criteria

1. WHEN a user initiates payment, THE CarrerPortal System SHALL create a Razorpay order and return the order identifier
2. THE CarrerPortal System SHALL provide the Razorpay order details to the frontend for payment modal display
3. WHEN Razorpay payment succeeds, THE CarrerPortal System SHALL receive payment verification request with payment identifier and signature
4. THE CarrerPortal System SHALL verify the Razorpay payment signature using the configured secret key
5. WHEN payment verification succeeds, THE CarrerPortal System SHALL update the transaction status to completed

### Requirement 13: Portfolio Display

**User Story:** As a visitor, I want to view portfolio projects with filtering and search capabilities, so that I can explore past work examples.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL display a grid of portfolio items with title, tags, and preview image
2. THE CarrerPortal System SHALL provide client-side filtering by project tags
3. THE CarrerPortal System SHALL provide search functionality with debounced input to filter projects by title or description
4. WHEN a user clicks a portfolio item, THE CarrerPortal System SHALL navigate to a detail page showing full project information
5. THE CarrerPortal System SHALL display project details including images, tech stack, challenge, solution, and client type

### Requirement 14: Services Information

**User Story:** As a visitor, I want to view available services with details and pricing, so that I can understand what CarrerPortal offers.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL display a list of services including Career Recommendation, Skill Gap Analysis, Expert Consultation, Resume Review, and Interview Prep
2. THE CarrerPortal System SHALL show service details including icon, description bullets, typical timeline, and estimated price range
3. WHEN a user clicks Request Quote on a service, THE CarrerPortal System SHALL navigate to the contact page with the service pre-selected
4. THE CarrerPortal System SHALL display service information in an accessible card layout

### Requirement 15: Security and Spam Prevention

**User Story:** As an admin, I want the system to prevent spam and malicious submissions, so that the platform remains secure and reliable.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL reject contact form submissions where the honeypot field contains a value
2. WHERE reCAPTCHA is configured, THE CarrerPortal System SHALL validate reCAPTCHA tokens server-side before processing submissions
3. THE CarrerPortal System SHALL sanitize all user input to prevent XSS attacks
4. THE CarrerPortal System SHALL use parameterized queries or ORM to prevent SQL injection
5. THE CarrerPortal System SHALL implement rate limiting on API endpoints to prevent abuse

### Requirement 16: Database Schema

**User Story:** As a developer, I want a well-structured database schema, so that data is organized efficiently and relationships are maintained.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL implement a users table with fields for id, name, email, password_hash, is_admin, and created_at
2. THE CarrerPortal System SHALL implement a skills table with fields for id, name, and category
3. THE CarrerPortal System SHALL implement a user_skills junction table with user_id, skill_id, and proficiency
4. THE CarrerPortal System SHALL implement a careers table with fields for id, title, description, required_skills, salary_range, demand_level, and roadmap
5. THE CarrerPortal System SHALL implement an experts table with fields for id, user_id, bio, resume_url, certificate_urls, rate_per_hour, and status
6. THE CarrerPortal System SHALL implement a bookings table with fields for id, user_id, expert_id, slot_start, slot_end, jitsi_room, and status
7. THE CarrerPortal System SHALL implement a transactions table with fields for id, booking_id, razorpay_order_id, razorpay_payment_id, and status
8. THE CarrerPortal System SHALL enforce foreign key constraints between related tables

### Requirement 17: SEO and Performance Optimization

**User Story:** As a visitor, I want the application to load quickly and be discoverable by search engines, so that I can access content efficiently.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL set dynamic page titles for each route
2. THE CarrerPortal System SHALL include meta description tags with relevant content for each page
3. THE CarrerPortal System SHALL include Open Graph meta tags for social media sharing
4. THE CarrerPortal System SHALL lazy load images using the loading="lazy" attribute
5. THE CarrerPortal System SHALL implement code splitting for route-based components using React.lazy and Suspense

### Requirement 18: Development and Build Configuration

**User Story:** As a developer, I want proper development and build tooling configured, so that I can develop and deploy the application efficiently.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL provide a package.json with scripts for dev, build, preview, lint, format, and test
2. THE CarrerPortal System SHALL use Vite as the build tool with appropriate configuration
3. THE CarrerPortal System SHALL configure Tailwind CSS with custom theme including primary gradient colors and Inter font
4. THE CarrerPortal System SHALL provide ESLint configuration for code quality
5. THE CarrerPortal System SHALL provide Prettier configuration for code formatting
6. THE CarrerPortal System SHALL include at least one Jest test with React Testing Library for the ContactForm component

### Requirement 19: Environment Configuration

**User Story:** As a developer, I want environment variables properly configured, so that I can manage different configurations for development and production.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL provide a .env.example file documenting all required environment variables
2. THE CarrerPortal System SHALL use VITE_ prefix for frontend environment variables
3. THE CarrerPortal System SHALL configure backend environment variables for Flask, database, JWT, email, Razorpay, and optional reCAPTCHA
4. THE CarrerPortal System SHALL load environment variables from .env file in development
5. THE CarrerPortal System SHALL not commit actual secret values to version control

### Requirement 20: Visual Design and Branding

**User Story:** As a visitor, I want a modern and visually appealing interface with consistent branding, so that I have a professional and engaging experience.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL use a primary gradient color scheme from #6EE7B7 to #3B82F6 for key UI elements
2. THE CarrerPortal System SHALL use #8B5CF6 as the accent color for secondary actions and highlights
3. THE CarrerPortal System SHALL use Inter font from Google Fonts as the primary typeface
4. THE CarrerPortal System SHALL display a text-based SVG logo in the navigation header
5. THE CarrerPortal System SHALL maintain consistent spacing, typography, and color usage across all pages

### Requirement 21: Navigation User Experience

**User Story:** As a user, I want an intuitive and responsive navigation system, so that I can easily move through the application on any device.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL display a sticky navigation bar that remains visible when scrolling
2. WHEN a user scrolls down the page, THE CarrerPortal System SHALL compress the navigation bar height
3. THE CarrerPortal System SHALL display a "Get a Quote" call-to-action button in the navigation
4. WHEN viewing on mobile devices, THE CarrerPortal System SHALL display a hamburger menu icon with aria-expanded attribute
5. THE CarrerPortal System SHALL provide smooth scroll behavior for anchor link navigation

### Requirement 22: Hero Section and Landing Experience

**User Story:** As a visitor, I want an engaging hero section on the home page, so that I immediately understand the value proposition.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL display a hero section with the title "CarrerPortal — Skill-Based Career Recommendation"
2. THE CarrerPortal System SHALL include a subtitle explaining the platform's purpose in the hero section
3. THE CarrerPortal System SHALL provide a primary call-to-action button labeled "Get a Quote" in the hero section
4. THE CarrerPortal System SHALL provide a secondary call-to-action button labeled "Our Work" in the hero section
5. THE CarrerPortal System SHALL animate the hero section elements using Framer Motion on page load

### Requirement 23: Animations and Micro-interactions

**User Story:** As a user, I want smooth animations and interactive feedback, so that the interface feels responsive and polished.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL animate card components on hover using Framer Motion
2. THE CarrerPortal System SHALL animate modal open and close transitions using Framer Motion
3. THE CarrerPortal System SHALL provide visual feedback for button clicks and interactive elements
4. THE CarrerPortal System SHALL animate page transitions between routes
5. WHEN a user has prefers-reduced-motion enabled, THE CarrerPortal System SHALL disable decorative animations while maintaining functional transitions

### Requirement 24: Footer and Global Elements

**User Story:** As a visitor, I want a comprehensive footer with useful links and information, so that I can access important resources from any page.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL display a footer with quick links to main pages
2. THE CarrerPortal System SHALL include social media icons in the footer
3. THE CarrerPortal System SHALL provide a newsletter subscription input field in the footer
4. THE CarrerPortal System SHALL display Terms of Service and Privacy Policy links in the footer
5. THE CarrerPortal System SHALL maintain consistent footer appearance across all pages

### Requirement 25: Home Page Content Sections

**User Story:** As a visitor, I want to see key information and features on the home page, so that I can quickly understand what CarrerPortal offers.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL display a services summary section with 3 to 5 service cards on the home page
2. THE CarrerPortal System SHALL display a featured portfolio carousel with 3 portfolio items on the home page
3. THE CarrerPortal System SHALL display a testimonials section with mock testimonial content on the home page
4. THE CarrerPortal System SHALL display a pricing call-to-action card for "Starter Pack" on the home page
5. THE CarrerPortal System SHALL include a mini contact form on the home page that submits to the same contact endpoint

### Requirement 26: About Page Content

**User Story:** As a visitor, I want to learn about the company and team, so that I can understand who is behind CarrerPortal.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL display company story, mission, and values on the About page
2. THE CarrerPortal System SHALL display a workflow timeline showing Discovery, Design, Build, Deliver, and Support phases
3. THE CarrerPortal System SHALL display team member cards for founders including "Aman — Full Stack & AI" and "Partner — Mobile Apps & UI"
4. THE CarrerPortal System SHALL display achievement badges with mock accomplishments
5. THE CarrerPortal System SHALL organize About page content in visually distinct sections

### Requirement 27: Blog Functionality

**User Story:** As a visitor, I want to read blog posts about career development topics, so that I can gain insights and knowledge.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL display a list of blog posts with title, excerpt, and publication date
2. WHEN a user clicks a blog post, THE CarrerPortal System SHALL navigate to a detail page showing the full post content
3. THE CarrerPortal System SHALL display optimized images within blog post content
4. THE CarrerPortal System SHALL provide social media share buttons on blog post detail pages
5. THE CarrerPortal System SHALL store blog post data in src/data/blog.js or as markdown files

### Requirement 28: Contact Page Layout

**User Story:** As a visitor, I want multiple ways to contact CarrerPortal, so that I can choose my preferred communication method.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL display the full contact form prominently on the Contact page
2. THE CarrerPortal System SHALL display alternate contact information including email and phone
3. THE CarrerPortal System SHALL include a Calendly embed placeholder for scheduling meetings
4. THE CarrerPortal System SHALL display office address information on the Contact page
5. THE CarrerPortal System SHALL organize contact methods in a clear and accessible layout

### Requirement 29: Toast Notifications

**User Story:** As a user, I want clear feedback when I perform actions, so that I know whether my actions succeeded or failed.

#### Acceptance Criteria

1. WHEN a user action succeeds, THE CarrerPortal System SHALL display a success toast notification
2. WHEN a user action fails, THE CarrerPortal System SHALL display an error toast notification with a descriptive message
3. THE CarrerPortal System SHALL automatically dismiss toast notifications after 5 seconds
4. THE CarrerPortal System SHALL allow users to manually dismiss toast notifications by clicking a close button
5. THE CarrerPortal System SHALL position toast notifications in a consistent location that does not obstruct important content

### Requirement 30: Image Optimization and Loading

**User Story:** As a user, I want images to load efficiently, so that I can view content quickly without long wait times.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL use the loading="lazy" attribute for images below the fold
2. THE CarrerPortal System SHALL display placeholder skeletons while images are loading
3. THE CarrerPortal System SHALL use optimized image formats and appropriate dimensions
4. THE CarrerPortal System SHALL use picsum.photos with seed values for mock portfolio images
5. THE CarrerPortal System SHALL implement a LazyImage component for consistent lazy loading behavior

### Requirement 31: Documentation and Deployment

**User Story:** As a developer, I want comprehensive documentation, so that I can set up, run, and deploy the application successfully.

#### Acceptance Criteria

1. THE CarrerPortal System SHALL provide a README.md with setup instructions for frontend and backend
2. THE CarrerPortal System SHALL document database setup steps including schema import
3. THE CarrerPortal System SHALL document how to run the contact flow locally and where logs are stored
4. THE CarrerPortal System SHALL provide deployment instructions for frontend (Vercel/Netlify) and backend (Render/Heroku/VPS)
5. THE CarrerPortal System SHALL document Razorpay, SendGrid, and reCAPTCHA setup steps
