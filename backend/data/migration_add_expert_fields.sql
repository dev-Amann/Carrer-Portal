-- Migration to add new fields to experts table
-- Run this after the initial schema.sql

ALTER TABLE experts 
ADD COLUMN linkedin_url VARCHAR(500) AFTER status,
ADD COLUMN github_url VARCHAR(500) AFTER linkedin_url,
ADD COLUMN portfolio_url VARCHAR(500) AFTER github_url,
ADD COLUMN other_documents JSON AFTER portfolio_url,
ADD COLUMN specialization VARCHAR(255) AFTER other_documents,
ADD COLUMN years_of_experience INT AFTER specialization,
ADD COLUMN email_for_communication VARCHAR(255) AFTER years_of_experience;

-- Add index on email_for_communication for faster lookups
CREATE INDEX idx_expert_email ON experts(email_for_communication);
