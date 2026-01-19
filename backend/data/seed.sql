-- CarrerPortal Seed Data
-- Sample data for development and testing

-- Insert sample skills across different categories
INSERT INTO skills (name, category) VALUES
('Python', 'Programming'),
('JavaScript', 'Programming'),
('React', 'Frontend'),
('Data Analysis', 'Data Science'),
('Machine Learning', 'Data Science'),
('Communication', 'Soft Skills');

-- Insert sample careers with descriptions and requirements
INSERT INTO careers (title, description, salary_range, demand_level, roadmap) VALUES
(
    'Full Stack Developer',
    'Build and maintain web applications using modern frameworks and technologies. Work on both frontend and backend systems.',
    '$60,000 - $120,000',
    'very_high',
    '1. Learn HTML/CSS/JavaScript basics\n2. Master a frontend framework (React/Vue/Angular)\n3. Learn backend development (Node.js/Python/Java)\n4. Understand databases and APIs\n5. Build portfolio projects\n6. Learn DevOps basics'
),
(
    'Data Scientist',
    'Analyze complex data sets to derive insights and build predictive models. Use statistical methods and machine learning algorithms.',
    '$70,000 - $140,000',
    'very_high',
    '1. Master Python and R programming\n2. Learn statistics and probability\n3. Study machine learning algorithms\n4. Practice data visualization\n5. Work on real-world datasets\n6. Build a portfolio of projects'
),
(
    'Frontend Developer',
    'Create user interfaces and experiences for web applications. Focus on responsive design and user interaction.',
    '$55,000 - $110,000',
    'high',
    '1. Master HTML, CSS, and JavaScript\n2. Learn a modern framework (React/Vue/Angular)\n3. Understand responsive design principles\n4. Learn state management\n5. Practice accessibility standards\n6. Build interactive projects'
),
(
    'Machine Learning Engineer',
    'Design and implement machine learning systems and algorithms. Deploy ML models to production environments.',
    '$80,000 - $160,000',
    'very_high',
    '1. Strong foundation in Python\n2. Master machine learning algorithms\n3. Learn deep learning frameworks (TensorFlow/PyTorch)\n4. Understand MLOps and deployment\n5. Practice on Kaggle competitions\n6. Build end-to-end ML projects'
),
(
    'Business Analyst',
    'Bridge the gap between business needs and technical solutions. Analyze requirements and communicate with stakeholders.',
    '$50,000 - $95,000',
    'high',
    '1. Develop analytical thinking skills\n2. Learn data analysis tools (Excel, SQL)\n3. Master communication and presentation\n4. Understand business processes\n5. Learn requirements gathering\n6. Practice stakeholder management'
),
(
    'UI/UX Designer',
    'Design intuitive and visually appealing user interfaces. Conduct user research and create prototypes.',
    '$55,000 - $105,000',
    'high',
    '1. Learn design principles and theory\n2. Master design tools (Figma, Sketch, Adobe XD)\n3. Study user psychology and behavior\n4. Practice wireframing and prototyping\n5. Learn user research methods\n6. Build a design portfolio'
);

-- Insert career_skills relationships
-- Full Stack Developer requires Python, JavaScript, and React
INSERT INTO career_skills (career_id, skill_id, required_level) VALUES
(1, 1, 'advanced'),    -- Python
(1, 2, 'advanced'),    -- JavaScript
(1, 3, 'advanced');    -- React

-- Data Scientist requires Python, Data Analysis, and Machine Learning
INSERT INTO career_skills (career_id, skill_id, required_level) VALUES
(2, 1, 'expert'),      -- Python
(2, 4, 'expert'),      -- Data Analysis
(2, 5, 'advanced');    -- Machine Learning

-- Frontend Developer requires JavaScript and React
INSERT INTO career_skills (career_id, skill_id, required_level) VALUES
(3, 2, 'advanced'),    -- JavaScript
(3, 3, 'expert');      -- React

-- Machine Learning Engineer requires Python and Machine Learning
INSERT INTO career_skills (career_id, skill_id, required_level) VALUES
(4, 1, 'expert'),      -- Python
(4, 5, 'expert');      -- Machine Learning

-- Business Analyst requires Data Analysis and Communication
INSERT INTO career_skills (career_id, skill_id, required_level) VALUES
(5, 4, 'intermediate'), -- Data Analysis
(5, 6, 'advanced');     -- Communication

-- UI/UX Designer requires Communication
INSERT INTO career_skills (career_id, skill_id, required_level) VALUES
(6, 6, 'advanced');    -- Communication

-- Note: Portfolio items are stored in frontend/src/data/portfolio.js
-- This is reference data for the 8 portfolio items that should be created:
-- 
-- 1. E-Commerce Platform Redesign
--    Tags: Web Design, React, Node.js
--    Description: Complete redesign of an online retail platform
-- 
-- 2. Mobile Banking App
--    Tags: Mobile, UI/UX, Flutter
--    Description: Secure and intuitive mobile banking application
-- 
-- 3. Healthcare Management System
--    Tags: Web App, Python, Django
--    Description: Patient management and appointment scheduling system
-- 
-- 4. Real Estate Listing Platform
--    Tags: Full Stack, React, MongoDB
--    Description: Property search and listing management platform
-- 
-- 5. Social Media Dashboard
--    Tags: Analytics, React, D3.js
--    Description: Unified dashboard for social media management
-- 
-- 6. Educational Learning Platform
--    Tags: EdTech, Vue.js, Firebase
--    Description: Interactive online learning and course management
-- 
-- 7. Restaurant Ordering System
--    Tags: Mobile, React Native, Node.js
--    Description: Online ordering and delivery management system
-- 
-- 8. Fitness Tracking App
--    Tags: Mobile, Health, Swift
--    Description: Personal fitness and workout tracking application
