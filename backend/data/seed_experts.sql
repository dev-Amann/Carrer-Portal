-- Seed data for experts
-- Run this after creating some users to populate the database with sample experts

-- First, create some expert users
INSERT INTO users (name, email, password_hash, is_admin) VALUES
('Dr. Priya Sharma', 'priya.sharma@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzS7NU/QyG', FALSE),
('Arjun Patel', 'arjun.patel@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzS7NU/QyG', FALSE),
('Neha Gupta', 'neha.gupta@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzS7NU/QyG', FALSE),
('Rajesh Kumar', 'rajesh.kumar@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzS7NU/QyG', FALSE),
('Aisha Khan', 'aisha.khan@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzS7NU/QyG', FALSE),
('Vikram Singh', 'vikram.singh@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzS7NU/QyG', FALSE);

-- Create expert profiles for these users
INSERT INTO experts (user_id, bio, resume_url, certificate_urls, rate_per_hour, status) VALUES
(
    (SELECT id FROM users WHERE email = 'priya.sharma@example.com'),
    'Senior Software Architect with 15+ years of experience in building scalable enterprise applications.',
    'https://example.com/resume/priya.pdf',
    '["AWS Solutions Architect Professional", "Google Cloud Professional Architect", "Certified Kubernetes Administrator"]',
    5000,
    'approved'
),
(
    (SELECT id FROM users WHERE email = 'arjun.patel@example.com'),
    'Full Stack Developer and Tech Lead with expertise in modern web technologies.',
    'https://example.com/resume/arjun.pdf',
    '["Meta React Professional", "Node.js Certified Developer", "AWS Developer Associate"]',
    3500,
    'approved'
),
(
    (SELECT id FROM users WHERE email = 'neha.gupta@example.com'),
    'Data Science Lead with a PhD in Machine Learning. Specialized in NLP and computer vision.',
    'https://example.com/resume/neha.pdf',
    '["TensorFlow Developer Certificate", "AWS Machine Learning Specialty", "Deep Learning Specialization"]',
    4500,
    'approved'
),
(
    (SELECT id FROM users WHERE email = 'rajesh.kumar@example.com'),
    'Mobile Development Expert with extensive experience in iOS and Android development.',
    'https://example.com/resume/rajesh.pdf',
    '["Google Flutter Certified", "Apple iOS Developer", "React Native Specialist"]',
    4000,
    'approved'
),
(
    (SELECT id FROM users WHERE email = 'aisha.khan@example.com'),
    'DevOps Engineer and Cloud Security Specialist with expertise in CI/CD and infrastructure automation.',
    'https://example.com/resume/aisha.pdf',
    '["Certified Kubernetes Security Specialist", "AWS Security Specialty", "HashiCorp Terraform Associate"]',
    4200,
    'approved'
),
(
    (SELECT id FROM users WHERE email = 'vikram.singh@example.com'),
    'Product Manager turned Tech Consultant. Helps professionals transition into product management roles.',
    'https://example.com/resume/vikram.pdf',
    '["Certified Scrum Product Owner", "Product Management Certificate - Stanford", "Pragmatic Marketing Certified"]',
    3800,
    'approved'
);
