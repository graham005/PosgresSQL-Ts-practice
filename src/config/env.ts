import dotenv from 'dotenv';
import path from 'path';

// Load environment variable from .env file
const result = dotenv.config({
    path: path.resolve(process.cwd(), '.env')
});

if (result.error) {
    console.error('Error loading .env file:', result.error);
}

export default {
    database: {
        host: process.env.PGHOST,
        port: parseInt(process.env.PGPORT || '5432', 10 ),
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
    }
};