-- init-db.sql
-- Create extensions if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create additional roles if needed
-- CREATE ROLE clinic_readonly WITH LOGIN PASSWORD 'readonly_password';
-- CREATE ROLE clinic_write WITH LOGIN PASSWORD 'write_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE clinic_db TO clinic_user;