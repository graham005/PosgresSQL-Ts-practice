import env from './env';
import {Pool, PoolConfig, QueryResult } from 'pg';

class Database {
    private pool: Pool;

    constructor() {
        const poolConfig: PoolConfig = {
            host: env.database.host,
            port: env.database.port,
            user: env.database.user,
            password: env.database.password,
            database: env.database.database,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
        };
        this.pool = new Pool(poolConfig);

        this.pool.on('connect', () => {
            console.log('Connected to PostgreSQL database');
        });

        this.pool.on('error', (err) => {
            console.log('Unexpected error on idle client', err)
            process.exit(-1)
        })
    }

    async executeQuery(text: string, params: any[] = []): Promise<QueryResult>{
        const client = await this.pool.connect();
        try {
            const start = Date.now();
            const result = await client.query(text, params);
            const duration = Date.now() - start;
            console.log(`Executed query: ${text} - Duration: ${duration}ms`)
            return result;
        } catch (error) {
            console.error('Database query error: ', error);
            throw error;
        } finally {
            client.release();
        }
    }

    async initializeTables(): Promise<void> {
        try {
            // Create users table 
            await this.executeQuery(`
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    fname VARCHAR(50) NOT NULL,
                    lname VARCHAR(50) NOT NULL,
                    age INT,
                    created_at TIMESTAMPZ DEFAULT NOW()
                )
            `);
            console.log('USers table created or already exists');

            //Create other tables HERE -> -> - >
            console.log('Database schema initialized successfully');
        } catch (err) {
            console.error('Error initializing database:', err);
            throw err;
        }
    }

    getPool(): Pool {
        return this.pool;
    }
}

const db = new Database();

// Export instance methods and the database object
export const executeQuery = (text: string, params: any[] = []) => db.executeQuery(text, params);
export const initializeTables = () => db.initializeTables();
export default db;