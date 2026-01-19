-- Complete seed data for experts with all new fields
-- Run this after migration_add_expert_fields.sql

-- First, let's create some test users if they don't exist
INSERT IGNORE INTO users (name, email, password_hash, is_admin, created_at) VALUES
('John Smith', 'john.expert@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxF6q4Hm2', FALSE, NOW()),
('Sarah Johnson', 'sarah.expert@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxF6q4Hm2', FALSE, NOW()),
('Michael Chen', 'michael.expert@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxF6q4Hm2', FALSE, NOW()),
('Emily Davis', 'emily.expert@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxF6q4Hm2', FALSE, NOW()),
('David Wilson', 'david.expert@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxF6q4Hm2', FALSE, NOW());

-- Insert expert profiles with all fields
INSERT INTO experts (
    user_id, 
    bio, 
    resume_url, 
    certificate_urls, 
    rate_per_hour, 
    status,
    linkedin_url,
    github_url,
    portfolio_url,
    other_documents,
    specialization,
    years_of_experience,
    email_for_communication,
    created_at
) VALUES
(
    (SELECT id FROM users WHERE email = 'john.expert@example.com'),
    'Senior Software Engineer with 10+ years of experience in full-stack development. Specialized in React, Node.js, and cloud architecture. Passionate about mentoring and helping developers grow their careers.',
    'https://drive.google.com/file/d/sample-resume-1',
    '["https://certificates.com/aws-certified", "https://certificates.com/react-expert"]',
    1500.00,
    'approved',
    'https://linkedin.com/in/johnsmith',
    'https://github.com/johnsmith',
    'https://johnsmith.dev',
    '["https://docs.com/project1", "https://docs.com/project2"]',
    'Full-Stack Development',
    10,
    'john.expert@example.com',
    NOW()
),
(
    (SELECT id FROM users WHERE email = 'sarah.expert@example.com'),
    'Data Science expert with expertise in Machine Learning and AI. PhD in Computer Science. Helped 100+ professionals transition into data science careers.',
    'https://drive.google.com/file/d/sample-resume-2',
    '["https://certificates.com/ml-specialist", "https://certificates.com/tensorflow-cert"]',
    2000.00,
    'approved',
    'https://linkedin.com/in/sarahjohnson',
    'https://github.com/sarahjohnson',
    'https://sarahjohnson.ai',
    '["https://docs.com/research-paper"]',
    'Data Science & Machine Learning',
    12,
    'sarah.expert@example.com',
    NOW()
),
(
    (SELECT id FROM users WHERE email = 'michael.expert@example.com'),
    'Product Manager with experience at top tech companies. Expert in product strategy, user research, and agile methodologies. Love helping aspiring PMs break into the field.',
    'https://drive.google.com/file/d/sample-resume-3',
    '["https://certificates.com/product-management", "https://certificates.com/scrum-master"]',
    1800.00,
    'approved',
    'https://linkedin.com/in/michaelchen',
    NULL,
    'https://michaelchen.pm',
    '[]',
    'Product Management',
    8,
    'michael.expert@example.com',
    NOW()
),
(
    (SELECT id FROM users WHERE email = 'emily.expert@example.com'),
    'UX/UI Designer with a passion for creating beautiful and functional user experiences. 7 years of experience working with startups and enterprises. Specialized in design systems and accessibility.',
    'https://drive.google.com/file/d/sample-resume-4',
    '["https://certificates.com/ux-design", "https://certificates.com/figma-expert"]',
    1200.00,
    'approved',
    'https://linkedin.com/in/emilydavis',
    NULL,
    'https://emilydavis.design',
    '["https://behance.net/emilydavis"]',
    'UX/UI Design',
    7,
    'emily.expert@example.com',
    NOW()
),
(
    (SELECT id FROM users WHERE email = 'david.expert@example.com'),
    'DevOps Engineer specializing in cloud infrastructure, CI/CD, and Kubernetes. Certified AWS Solutions Architect. Help teams build scalable and reliable systems.',
    'https://drive.google.com/file/d/sample-resume-5',
    '["https://certificates.com/aws-solutions-architect", "https://certificates.com/kubernetes-admin"]',
    1600.00,
    'approved',
    'https://linkedin.com/in/davidwilson',
    'https://github.com/davidwilson',
    NULL,
    '[]',
    'DevOps & Cloud Architecture',
    9,
    'david.expert@example.com',
    NOW()
);

-- Add one pending expert for testing admin approval
INSERT INTO users (name, email, password_hash, is_admin, created_at) VALUES
('Pending Expert', 'pending.expert@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxF6q4Hm2', FALSE, NOW());

INSERT INTO experts (
    user_id, 
    bio, 
    resume_url, 
    certificate_urls, 
    rate_per_hour, 
    status,
    linkedin_url,
    github_url,
    portfolio_url,
    other_documents,
    specialization,
    years_of_experience,
    email_for_communication,
    created_at
) VALUES
(
    (SELECT id FROM users WHERE email = 'pending.expert@example.com'),
    'Cybersecurity expert with 6 years of experience in penetration testing and security audits. Looking to help others learn about security best practices.',
    'https://drive.google.com/file/d/sample-resume-pending',
    '["https://certificates.com/cissp", "https://certificates.com/ceh"]',
    1400.00,
    'pending',
    'https://linkedin.com/in/pendingexpert',
    'https://github.com/pendingexpert',
    'https://pendingexpert.security',
    '["https://docs.com/security-audit"]',
    'Cybersecurity',
    6,
    'pending.expert@example.com',
    NOW()
);
