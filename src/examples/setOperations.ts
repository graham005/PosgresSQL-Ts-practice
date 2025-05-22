import { executeQuery } from "../config/database";

/**
 * This file demonstrates SQL set operations (UNION, INTERSECT, EXCEPT)
 * using the tables defined in the database
 */

// Interface definitions
interface Employee {
  employee_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  hire_date: Date;
  job_id: string;
  salary: number;
}

interface Customer {
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  registration_date: Date;
}

interface Product {
  product_id: number;
  product_name: string;
  category: string;
  unit_price: number;
  stock_quantity?: number;
}

interface Sale {
  sale_id: number;
  product_id: number;
  quantity_sold: number;
  sale_date: Date;
  total_price: number;
}

interface Order {
  order_id: number;
  customer_id: number;
  order_date: Date;
  status: string;
  total_amount: number;
}

interface Skill {
  skill_id: number;
  skill_name: string;
  skill_category: string;
}

interface EmployeeSkill {
  employee_id: number;
  skill_id: number;
  proficiency_level: string;
  certification_date: Date | null;
}

/**
 * UNION Operation: Combines results of two or more SELECT statements
 * (removing duplicates)
 */

// Find all people (both employees and customers) with their emails
export const findAllPeopleWithEmails = async (): Promise<
  { first_name: string; last_name: string; email: string; source: string }[]
> => {
  try {
    const query = `
            SELECT first_name, last_name, email, 'Employee' AS source
            FROM employees
            UNION
            SELECT first_name, last_name, email, 'Customer' AS source
            FROM customers
            ORDER BY last_name, first_name
        `;

    const result = await executeQuery(query);
    console.log(
      `Retrieved ${result.rows.length} people (employees and customers)`
    );
    return result.rows;
  } catch (err) {
    console.error("Error performing UNION operation:", err);
    throw err;
  }
};

// Find all products and their sources (from sales and orders)
export const findProductSalesSources = async (): Promise<
  { product_id: number; source: string; transaction_date: Date }[]
> => {
  try {
    const query = `
            SELECT product_id, 'Direct Sale' AS source, sale_date AS transaction_date
            FROM sales
            UNION ALL
            SELECT p.product_id, 'Order' AS source, o.order_date AS transaction_date
            FROM products p
            JOIN orders o ON p.product_id = ANY (
                -- Subquery to simulate products in orders
                -- In a real scenario, you'd have an order_items table
                SELECT ARRAY[product_id] 
                FROM sales 
                WHERE sale_id % 2 = 0
            )
            ORDER BY transaction_date DESC
        `;

    const result = await executeQuery(query);
    console.log(
      `Retrieved ${result.rows.length} product transactions from different sources`
    );
    return result.rows;
  } catch (err) {
    console.error("Error performing UNION ALL operation:", err);
    throw err;
  }
};

/**
 * INTERSECT Operation: Returns only rows that appear in both result sets
 */

// Find employees who are also customers (based on matching email)
export const findEmployeesWhoAreCustomers = async (): Promise<
  { first_name: string; last_name: string; email: string }[]
> => {
  try {
    const query = `
            SELECT first_name, last_name, email
            FROM employees
            INTERSECT
            SELECT first_name, last_name, email
            FROM customers
            ORDER BY last_name, first_name
        `;

    const result = await executeQuery(query);
    console.log(
      `Retrieved ${result.rows.length} people who are both employees and customers`
    );
    return result.rows;
  } catch (err) {
    console.error("Error performing INTERSECT operation:", err);
    throw err;
  }
};

// Find skills that are shared by IT and Finance employees
export const findSharedSkills = async (): Promise<
  { skill_name: string; skill_category: string }[]
> => {
  try {
    const query = `
            SELECT s.skill_name, s.skill_category
            FROM employee_skills es
            JOIN employees e ON es.employee_id = e.employee_id
            JOIN skills s ON es.skill_id = s.skill_id
            WHERE e.job_id = 'IT_PROG'
            
            INTERSECT
            
            SELECT s.skill_name, s.skill_category
            FROM employee_skills es
            JOIN employees e ON es.employee_id = e.employee_id
            JOIN skills s ON es.skill_id = s.skill_id
            WHERE e.job_id = 'FI_ACCT'
            
            ORDER BY skill_category, skill_name
        `;

    const result = await executeQuery(query);
    console.log(
      `Retrieved ${result.rows.length} skills shared by IT and Finance employees`
    );
    return result.rows;
  } catch (err) {
    console.error("Error performing INTERSECT operation for skills:", err);
    throw err;
  }
};

/**
 * EXCEPT Operation: Returns rows in first result set but not in second
 */

// Find employees who are not customers
export const findEmployeesNotCustomers = async (): Promise<
  { first_name: string; last_name: string; email: string }[]
> => {
  try {
    const query = `
            SELECT first_name, last_name, email
            FROM employees
            EXCEPT
            SELECT first_name, last_name, email
            FROM customers
            ORDER BY last_name, first_name
        `;

    const result = await executeQuery(query);
    console.log(
      `Retrieved ${result.rows.length} employees who are not customers`
    );
    return result.rows;
  } catch (err) {
    console.error("Error performing EXCEPT operation:", err);
    throw err;
  }
};

// Find products that have never been sold
export const findProductsNeverSold = async (): Promise<Product[]> => {
  try {
    const query = `
            SELECT product_id, product_name, category, unit_price
            FROM products
            EXCEPT
            SELECT p.product_id, p.product_name, p.category, p.unit_price
            FROM products p
            JOIN sales s ON p.product_id = s.product_id
            ORDER BY product_name
        `;

    const result = await executeQuery(query);
    console.log(
      `Retrieved ${result.rows.length} products that have never been sold`
    );
    return result.rows;
  } catch (err) {
    console.error("Error performing EXCEPT operation for products:", err);
    throw err;
  }
};

/**
 * Combined set operations (more complex queries)
 */

// Find people who are either employees or customers but not both
export const findExclusivePeople = async (): Promise<
  { first_name: string; last_name: string; email: string; source: string }[]
> => {
  try {
    const query = `
            -- All people (employees and customers)
            (SELECT first_name, last_name, email, 'Employee' AS source
            FROM employees
            UNION
            SELECT first_name, last_name, email, 'Customer' AS source
            FROM customers)
            
            EXCEPT
            
            -- People who are both employees and customers
            (SELECT e.first_name, e.last_name, e.email, 'Both' AS source
            FROM employees e
            INNER JOIN customers c
            ON e.email = c.email)
            
            ORDER BY last_name, first_name
        `;

    const result = await executeQuery(query);
    console.log(
      `Retrieved ${result.rows.length} people who are exclusively employees or customers`
    );
    return result.rows;
  } catch (err) {
    console.error("Error performing combined set operation:", err);
    throw err;
  }
};

// Find skills that are unique to IT employees (not possessed by any other job role)
export const findUniqueITSkills = async (): Promise<
  { skill_name: string; skill_category: string }[]
> => {
  try {
    const query = `
            -- Skills possessed by IT employees
            SELECT s.skill_name, s.skill_category
            FROM employee_skills es
            JOIN employees e ON es.employee_id = e.employee_id
            JOIN skills s ON es.skill_id = s.skill_id
            WHERE e.job_id = 'IT_PROG'
            
            EXCEPT
            
            -- Skills possessed by non-IT employees
            SELECT s.skill_name, s.skill_category
            FROM employee_skills es
            JOIN employees e ON es.employee_id = e.employee_id
            JOIN skills s ON es.skill_id = s.skill_id
            WHERE e.job_id != 'IT_PROG'
            
            ORDER BY skill_category, skill_name
        `;

    const result = await executeQuery(query);
    console.log(
      `Retrieved ${result.rows.length} skills unique to IT employees`
    );
    return result.rows;
  } catch (err) {
    console.error("Error performing set operation for unique IT skills:", err);
    throw err;
  }
};

// Run all set operation examples
export const runAllSetOperations = async (): Promise<void> => {
  try {
    console.log("\n=== Running UNION operations ===");
    await findAllPeopleWithEmails();
    await findProductSalesSources();

    console.log("\n=== Running INTERSECT operations ===");
    await findEmployeesWhoAreCustomers();
    await findSharedSkills();

    console.log("\n=== Running EXCEPT operations ===");
    await findEmployeesNotCustomers();
    await findProductsNeverSold();

    console.log("\n=== Running Combined operations ===");
    await findExclusivePeople();
    await findUniqueITSkills();

    console.log("\n=== All set operations completed successfully ===");
  } catch (err) {
    console.error("Error running set operations:", err);
  }
};

// export default {
//   findAllPeopleWithEmails,
//   findProductSalesSources,
//   findEmployeesWhoAreCustomers,
//   findSharedSkills,
//   findEmployeesNotCustomers,
//   findProductsNeverSold,
//   findExclusivePeople,
//   findUniqueITSkills,
//   runAllSetOperations,
// };
