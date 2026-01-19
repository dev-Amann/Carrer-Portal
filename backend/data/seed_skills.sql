-- Seed data for skills and careers
-- Run this after schema.sql to populate the database with sample data

-- Insert Skills
INSERT INTO skills (name, category) VALUES
-- Programming Languages
('Python', 'programming'),
('JavaScript', 'programming'),
('Java', 'programming'),
('C++', 'programming'),
('TypeScript', 'programming'),
('Go', 'programming'),
('Rust', 'programming'),
('PHP', 'programming'),
('Ruby', 'programming'),
('Swift', 'programming'),
('Kotlin', 'programming'),
('C#', 'programming'),

-- Web Development
('React', 'web_development'),
('Angular', 'web_development'),
('Vue.js', 'web_development'),
('Node.js', 'web_development'),
('HTML/CSS', 'web_development'),
('REST APIs', 'web_development'),
('GraphQL', 'web_development'),
('WebSockets', 'web_development'),
('Responsive Design', 'web_development'),

-- Database
('MySQL', 'database'),
('PostgreSQL', 'database'),
('MongoDB', 'database'),
('Redis', 'database'),
('SQL', 'database'),
('Database Design', 'database'),
('NoSQL', 'database'),

-- DevOps & Cloud
('Docker', 'devops'),
('Kubernetes', 'devops'),
('AWS', 'cloud'),
('Azure', 'cloud'),
('Google Cloud', 'cloud'),
('CI/CD', 'devops'),
('Jenkins', 'devops'),
('Terraform', 'devops'),
('Linux', 'devops'),

-- Data Science & ML
('Machine Learning', 'data_science'),
('Deep Learning', 'data_science'),
('TensorFlow', 'data_science'),
('PyTorch', 'data_science'),
('Data Analysis', 'data_science'),
('Statistics', 'data_science'),
('Pandas', 'data_science'),
('NumPy', 'data_science'),
('Scikit-learn', 'data_science'),
('NLP', 'data_science'),
('Computer Vision', 'data_science'),

-- Mobile Development
('Android Development', 'mobile'),
('iOS Development', 'mobile'),
('React Native', 'mobile'),
('Flutter', 'mobile'),
('Mobile UI/UX', 'mobile'),

-- Soft Skills
('Communication', 'soft_skills'),
('Leadership', 'soft_skills'),
('Problem Solving', 'soft_skills'),
('Teamwork', 'soft_skills'),
('Time Management', 'soft_skills'),
('Critical Thinking', 'soft_skills'),
('Adaptability', 'soft_skills'),
('Project Management', 'soft_skills'),

-- Design
('UI Design', 'design'),
('UX Design', 'design'),
('Figma', 'design'),
('Adobe XD', 'design'),
('Wireframing', 'design'),
('Prototyping', 'design'),

-- Security
('Cybersecurity', 'security'),
('Network Security', 'security'),
('Penetration Testing', 'security'),
('Security Auditing', 'security'),

-- Other
('Git', 'tools'),
('Agile', 'methodology'),
('Scrum', 'methodology'),
('Testing', 'quality_assurance'),
('API Development', 'backend');

-- Insert Careers
INSERT INTO careers (title, description, salary_range, demand_level, roadmap) VALUES
('Full Stack Developer', 
 'Build complete web applications from frontend to backend, working with databases, servers, and client-side technologies.',
 '6-15 LPA',
 'very_high',
 'Learn HTML/CSS, JavaScript, React/Vue, Node.js, Databases, DevOps basics'),

('Data Scientist',
 'Analyze complex data sets, build predictive models, and derive insights using statistical methods and machine learning.',
 '8-20 LPA',
 'very_high',
 'Learn Python, Statistics, Pandas/NumPy, Machine Learning, Deep Learning, Big Data tools'),

('DevOps Engineer',
 'Automate and streamline software development and deployment processes, manage infrastructure and ensure system reliability.',
 '7-18 LPA',
 'high',
 'Learn Linux, Scripting, Docker, Kubernetes, CI/CD, Cloud platforms, Monitoring'),

('Mobile App Developer',
 'Create applications for mobile devices using native or cross-platform technologies.',
 '5-14 LPA',
 'high',
 'Learn programming basics, Choose platform (iOS/Android/Flutter), UI/UX, APIs, App deployment'),

('Machine Learning Engineer',
 'Design and implement machine learning systems, deploy ML models to production, and optimize algorithms.',
 '10-25 LPA',
 'very_high',
 'Learn Python, Math/Statistics, ML algorithms, Deep Learning, MLOps, Production deployment'),

('Cloud Architect',
 'Design and implement cloud infrastructure solutions, ensure scalability, security, and cost-effectiveness.',
 '12-30 LPA',
 'high',
 'Learn networking, Cloud platforms, Architecture patterns, Security, Cost optimization, DevOps'),

('Frontend Developer',
 'Create user interfaces and experiences for web applications using modern frameworks and best practices.',
 '4-12 LPA',
 'high',
 'Learn HTML/CSS, JavaScript, React/Vue/Angular, Responsive design, Performance optimization'),

('Backend Developer',
 'Build server-side logic, APIs, and database systems that power web and mobile applications.',
 '5-14 LPA',
 'high',
 'Learn programming language, Databases, API design, Authentication, Caching, Scalability'),

('UI/UX Designer',
 'Design intuitive and visually appealing user interfaces and experiences for digital products.',
 '4-12 LPA',
 'medium',
 'Learn design principles, Figma/Adobe XD, User research, Wireframing, Prototyping, Usability testing'),

('Cybersecurity Analyst',
 'Protect systems and networks from security threats, conduct security audits, and respond to incidents.',
 '6-16 LPA',
 'high',
 'Learn networking, Security fundamentals, Penetration testing, Security tools, Compliance, Incident response');

-- Link skills to careers (career_skills)
-- Full Stack Developer
INSERT INTO career_skills (career_id, skill_id, required_level) VALUES
(1, (SELECT id FROM skills WHERE name = 'JavaScript'), 'advanced'),
(1, (SELECT id FROM skills WHERE name = 'React'), 'advanced'),
(1, (SELECT id FROM skills WHERE name = 'Node.js'), 'intermediate'),
(1, (SELECT id FROM skills WHERE name = 'HTML/CSS'), 'advanced'),
(1, (SELECT id FROM skills WHERE name = 'MySQL'), 'intermediate'),
(1, (SELECT id FROM skills WHERE name = 'REST APIs'), 'advanced'),
(1, (SELECT id FROM skills WHERE name = 'Git'), 'intermediate'),
(1, (SELECT id FROM skills WHERE name = 'Problem Solving'), 'advanced');

-- Data Scientist
INSERT INTO career_skills (career_id, skill_id, required_level) VALUES
(2, (SELECT id FROM skills WHERE name = 'Python'), 'advanced'),
(2, (SELECT id FROM skills WHERE name = 'Machine Learning'), 'advanced'),
(2, (SELECT id FROM skills WHERE name = 'Statistics'), 'advanced'),
(2, (SELECT id FROM skills WHERE name = 'Pandas'), 'advanced'),
(2, (SELECT id FROM skills WHERE name = 'NumPy'), 'intermediate'),
(2, (SELECT id FROM skills WHERE name = 'Data Analysis'), 'advanced'),
(2, (SELECT id FROM skills WHERE name = 'SQL'), 'intermediate'),
(2, (SELECT id FROM skills WHERE name = 'Critical Thinking'), 'advanced');

-- DevOps Engineer
INSERT INTO career_skills (career_id, skill_id, required_level) VALUES
(3, (SELECT id FROM skills WHERE name = 'Docker'), 'advanced'),
(3, (SELECT id FROM skills WHERE name = 'Kubernetes'), 'advanced'),
(3, (SELECT id FROM skills WHERE name = 'Linux'), 'advanced'),
(3, (SELECT id FROM skills WHERE name = 'AWS'), 'intermediate'),
(3, (SELECT id FROM skills WHERE name = 'CI/CD'), 'advanced'),
(3, (SELECT id FROM skills WHERE name = 'Terraform'), 'intermediate'),
(3, (SELECT id FROM skills WHERE name = 'Python'), 'intermediate'),
(3, (SELECT id FROM skills WHERE name = 'Problem Solving'), 'advanced');

-- Mobile App Developer
INSERT INTO career_skills (career_id, skill_id, required_level) VALUES
(4, (SELECT id FROM skills WHERE name = 'React Native'), 'advanced'),
(4, (SELECT id FROM skills WHERE name = 'JavaScript'), 'advanced'),
(4, (SELECT id FROM skills WHERE name = 'Mobile UI/UX'), 'intermediate'),
(4, (SELECT id FROM skills WHERE name = 'REST APIs'), 'intermediate'),
(4, (SELECT id FROM skills WHERE name = 'Git'), 'intermediate'),
(4, (SELECT id FROM skills WHERE name = 'Problem Solving'), 'advanced');

-- Machine Learning Engineer
INSERT INTO career_skills (career_id, skill_id, required_level) VALUES
(5, (SELECT id FROM skills WHERE name = 'Python'), 'expert'),
(5, (SELECT id FROM skills WHERE name = 'Machine Learning'), 'expert'),
(5, (SELECT id FROM skills WHERE name = 'Deep Learning'), 'advanced'),
(5, (SELECT id FROM skills WHERE name = 'TensorFlow'), 'advanced'),
(5, (SELECT id FROM skills WHERE name = 'PyTorch'), 'intermediate'),
(5, (SELECT id FROM skills WHERE name = 'Statistics'), 'advanced'),
(5, (SELECT id FROM skills WHERE name = 'Docker'), 'intermediate'),
(5, (SELECT id FROM skills WHERE name = 'Problem Solving'), 'expert');

-- Cloud Architect
INSERT INTO career_skills (career_id, skill_id, required_level) VALUES
(6, (SELECT id FROM skills WHERE name = 'AWS'), 'expert'),
(6, (SELECT id FROM skills WHERE name = 'Azure'), 'advanced'),
(6, (SELECT id FROM skills WHERE name = 'Kubernetes'), 'advanced'),
(6, (SELECT id FROM skills WHERE name = 'Docker'), 'advanced'),
(6, (SELECT id FROM skills WHERE name = 'Terraform'), 'advanced'),
(6, (SELECT id FROM skills WHERE name = 'Linux'), 'advanced'),
(6, (SELECT id FROM skills WHERE name = 'Cybersecurity'), 'intermediate'),
(6, (SELECT id FROM skills WHERE name = 'Leadership'), 'advanced');

-- Frontend Developer
INSERT INTO career_skills (career_id, skill_id, required_level) VALUES
(7, (SELECT id FROM skills WHERE name = 'JavaScript'), 'advanced'),
(7, (SELECT id FROM skills WHERE name = 'React'), 'advanced'),
(7, (SELECT id FROM skills WHERE name = 'HTML/CSS'), 'expert'),
(7, (SELECT id FROM skills WHERE name = 'Responsive Design'), 'advanced'),
(7, (SELECT id FROM skills WHERE name = 'TypeScript'), 'intermediate'),
(7, (SELECT id FROM skills WHERE name = 'Git'), 'intermediate'),
(7, (SELECT id FROM skills WHERE name = 'UI Design'), 'intermediate');

-- Backend Developer
INSERT INTO career_skills (career_id, skill_id, required_level) VALUES
(8, (SELECT id FROM skills WHERE name = 'Node.js'), 'advanced'),
(8, (SELECT id FROM skills WHERE name = 'Python'), 'advanced'),
(8, (SELECT id FROM skills WHERE name = 'MySQL'), 'advanced'),
(8, (SELECT id FROM skills WHERE name = 'PostgreSQL'), 'intermediate'),
(8, (SELECT id FROM skills WHERE name = 'REST APIs'), 'expert'),
(8, (SELECT id FROM skills WHERE name = 'API Development'), 'advanced'),
(8, (SELECT id FROM skills WHERE name = 'Docker'), 'intermediate'),
(8, (SELECT id FROM skills WHERE name = 'Problem Solving'), 'advanced');

-- UI/UX Designer
INSERT INTO career_skills (career_id, skill_id, required_level) VALUES
(9, (SELECT id FROM skills WHERE name = 'UI Design'), 'expert'),
(9, (SELECT id FROM skills WHERE name = 'UX Design'), 'expert'),
(9, (SELECT id FROM skills WHERE name = 'Figma'), 'advanced'),
(9, (SELECT id FROM skills WHERE name = 'Wireframing'), 'advanced'),
(9, (SELECT id FROM skills WHERE name = 'Prototyping'), 'advanced'),
(9, (SELECT id FROM skills WHERE name = 'Communication'), 'advanced'),
(9, (SELECT id FROM skills WHERE name = 'Critical Thinking'), 'advanced');

-- Cybersecurity Analyst
INSERT INTO career_skills (career_id, skill_id, required_level) VALUES
(10, (SELECT id FROM skills WHERE name = 'Cybersecurity'), 'expert'),
(10, (SELECT id FROM skills WHERE name = 'Network Security'), 'advanced'),
(10, (SELECT id FROM skills WHERE name = 'Penetration Testing'), 'advanced'),
(10, (SELECT id FROM skills WHERE name = 'Linux'), 'advanced'),
(10, (SELECT id FROM skills WHERE name = 'Python'), 'intermediate'),
(10, (SELECT id FROM skills WHERE name = 'Security Auditing'), 'advanced'),
(10, (SELECT id FROM skills WHERE name = 'Problem Solving'), 'advanced'),
(10, (SELECT id FROM skills WHERE name = 'Critical Thinking'), 'advanced');
