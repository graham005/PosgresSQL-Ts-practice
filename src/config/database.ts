import env from "./env";
import { Pool, PoolConfig, QueryResult } from "pg";

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

    this.pool.on("connect", () => {
      console.log("Connected to PostgreSQL database");
    });

    this.pool.on("error", (err) => {
      console.log("Unexpected error on idle client", err);
      process.exit(-1);
    });
  }

  async executeQuery(text: string, params: any[] = []): Promise<QueryResult> {
    const client = await this.pool.connect();
    try {
      const start = Date.now();
      const result = await client.query(text, params);
      const duration = Date.now() - start;
      console.log(`Executed query: ${text} - Duration: ${duration}ms`);
      return result;
    } catch (error) {
      console.error("Database query error: ", error);
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
                    created_at TIMESTAMP DEFAULT NOW()
                )
            `);
      console.log("Users table created or already exists"); // Create products table first (since it's referenced by Sales)
      await this.executeQuery(`
                CREATE TABLE IF NOT EXISTS Products (
                    product_id INT PRIMARY KEY,
                    product_name VARCHAR(100),
                    category VARCHAR(50),
                    unit_price DECIMAL(10, 2),
                    stock_quantity INT
                )
            `);
      console.log("Product table created or already exists");

      // Create sales table
      await this.executeQuery(`
                CREATE TABLE IF NOT EXISTS Sales (
                    sale_id INT PRIMARY KEY,
                    product_id INT,
                    quantity_sold INT,
                    sale_date DATE,
                    total_price DECIMAL(10, 2),
                    FOREIGN KEY (product_id) REFERENCES Products(product_id)
                )
            `);
      console.log("Sales table created or already exists"); // Create products table
      await this.executeQuery(`
                CREATE TABLE IF NOT EXISTS Products (
                    product_id INT PRIMARY KEY,
                    product_name VARCHAR(100),
                    category VARCHAR(50),
                    unit_price DECIMAL(10, 2),
                )
            `);
      console.log("Product table created or already exists"); // Create employees table
      await this.executeQuery(`
                CREATE TABLE IF NOT EXISTS employees (
                    employee_id INT PRIMARY KEY,
                    first_name VARCHAR(50),
                    last_name VARCHAR(50),
                    email VARCHAR(100),
                    phone_number VARCHAR(20),
                    hire_date DATE,
                    job_id VARCHAR(10),
                    salary DECIMAL(10,2)
                )
            `);
      console.log("Employees table created or already exists");

      // Create customers table
      await this.executeQuery(`
                CREATE TABLE IF NOT EXISTS customers (
                    customer_id INT PRIMARY KEY,
                    first_name VARCHAR(50),
                    last_name VARCHAR(50),
                    email VARCHAR(100),
                    phone VARCHAR(20),
                    address VARCHAR(100),
                    city VARCHAR(50),
                    state VARCHAR(50),
                    zip_code VARCHAR(20),
                    registration_date DATE
                )
            `);
      console.log("Customers table created or already exists"); // Create skills table first (since it's referenced by employee_skills)
      await this.executeQuery(`
                CREATE TABLE IF NOT EXISTS skills (
                    skill_id INT PRIMARY KEY,
                    skill_name VARCHAR(50),
                    skill_category VARCHAR(50)
                )
            `);
      console.log("Skills table created or already exists");

      // Create employee_skills table
      await this.executeQuery(`
                CREATE TABLE IF NOT EXISTS employee_skills (
                    employee_id INT,
                    skill_id INT,
                    proficiency_level VARCHAR(20),
                    certification_date DATE NULL,
                    PRIMARY KEY (employee_id, skill_id),
                    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
                    FOREIGN KEY (skill_id) REFERENCES skills(skill_id)
                )
            `);
      console.log("Skills table created or already exists"); // Create orders table
      await this.executeQuery(`
                CREATE TABLE IF NOT EXISTS orders (
                    order_id INT PRIMARY KEY,
                    customer_id INT,
                    order_date DATE,
                    status VARCHAR(20),
                    total_amount DECIMAL(12,2),
                    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
                )
            `);
      console.log("Orders table created or already exists");

      //Create other tables HERE -> -> - >
      console.log("Database schema initialized successfully");
    } catch (err) {
      console.error("Error initializing database:", err);
      throw err;
    }
  }

  getPool(): Pool {
    return this.pool;
  }
}

const db = new Database();

// Export instance methods and the database object
export const executeQuery = (text: string, params: any[] = []) =>
  db.executeQuery(text, params);
export const initializeTables = () => db.initializeTables();
export default db;
