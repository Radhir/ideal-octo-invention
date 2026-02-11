ALTER TABLE job_cards_jobcard ALTER COLUMN assigned_technician DROP NOT NULL;
ALTER TABLE job_cards_jobcard ALTER COLUMN service_advisor DROP NOT NULL;
UPDATE job_cards_jobcard SET assigned_technician = NULL, service_advisor = NULL;
