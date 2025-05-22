import { executeQuery } from "../config/database";

// Interfaces 
interface Product {
  product_id: number;
  product_name: string;
  category: string;
  unit_price: number;
}

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

interface Sale {
  sale_id: number;
  product_id: number;
  quantity_sold: number;
  sale_date: Date;
  total_price: number;
}

interface EmployeeSkill {
  employee_id: number;
  skill_id: number;
  proficiency_level: string;
  certification_date: Date | null;
}

interface Skill {
  skill_id: number;
  skill_name: string;
  skill_category: string;
}

/**
 * Get products that have generated total sales above 2000
 */
export const getHighRevenueProducts = async (): Promise<Product[]> => {
  try {
    const query = `
      SELECT product_id, product_name, category, unit_price
      FROM products
      WHERE product_id IN (
        SELECT product_id
        FROM sales
        GROUP BY product_id
        HAVING SUM(total_price) > 2000
      )
      ORDER BY product_name;
    `;
    const result = await executeQuery(query);
    console.log(`Found ${result.rows.length} high revenue products`);
    return result.rows;
  } catch (error) {
    console.error("Error fetching high revenue products:", error);
    throw error;
  }
};

/**
 * Retrieve employees who hold 'Expert' level skills
 */
export const getEmployeesWithExpertise = async (): Promise<Employee[]> => {
  try {
    const query = `
      SELECT employee_id, first_name, last_name, email, phone_number, hire_date, job_id, salary
      FROM employees
      WHERE employee_id IN (
        SELECT employee_id FROM employee_skills WHERE proficiency_level = 'Expert'
      )
      ORDER BY last_name, first_name;
    `;
    const result = await executeQuery(query);
    console.log(`Found ${result.rows.length} employees with expert skills`);
    return result.rows;
  } catch (error) {
    console.error("Error fetching employees with expert skills:", error);
    throw error;
  }
};

/**
 * Find customers who have placed orders exceeding a total amount of 1500
 */
export const getPremiumCustomers = async (): Promise<Customer[]> => {
  try {
    const query = `
      SELECT customer_id, first_name, last_name, email, phone, address, city, state, zip_code, registration_date
      FROM customers
      WHERE customer_id IN (
        SELECT customer_id FROM orders GROUP BY customer_id HAVING SUM(total_amount) > 1500
      )
      ORDER BY last_name, first_name;
    `;
    const result = await executeQuery(query);
    console.log(`Found ${result.rows.length} premium customers`);
    return result.rows;
  } catch (error) {
    console.error("Error fetching premium customers:", error);
    throw error;
  }
};

/**
 * Select sales where the quantity sold is greater than the average quantity sold
 */
export const getAboveAverageSales = async (): Promise<Sale[]> => {
  try {
    const query = `
      SELECT sale_id, product_id, quantity_sold, sale_date, total_price
      FROM sales
      WHERE quantity_sold > (
        SELECT AVG(quantity_sold)::numeric FROM sales
      )
      ORDER BY sale_date DESC;
    `;
    const result = await executeQuery(query);
    console.log(`Found ${result.rows.length} sales above average quantity`);
    return result.rows;
  } catch (error) {
    console.error("Error fetching above average sales:", error);
    throw error;
  }
};

/**
 * Find employees who have skills in the 'Business' category
 */
export const getBusinessSkilledEmployees = async (): Promise<Employee[]> => {
  try {
    const query = `
      SELECT e.employee_id, e.first_name, e.last_name, e.email, e.phone_number, e.hire_date, e.job_id, e.salary
      FROM employees e
      WHERE employee_id IN (
        SELECT es.employee_id
        FROM employee_skills es
        JOIN skills s ON es.skill_id = s.skill_id
        WHERE s.skill_category = 'Business'
      )
      ORDER BY e.last_name, e.first_name;
    `;
    const result = await executeQuery(query);
    console.log(`Found ${result.rows.length} employees skilled in Business`);
    return result.rows;
  } catch (error) {
    console.error("Error fetching business skilled employees:", error);
    throw error;
  }
};

/**
 * Run all subquery examples
 */
export const runSubqueryExamples = async (): Promise<void> => {
  try {
    console.log("\n-- Getting High Revenue Products --");
    await getHighRevenueProducts();

    console.log("\n-- Getting Employees With Expertise --");
    await getEmployeesWithExpertise();

    console.log("\n-- Getting Premium Customers --");
    await getPremiumCustomers();

    console.log("\n-- Getting Above Average Sales --");
    await getAboveAverageSales();

    console.log("\n-- Getting Business Skilled Employees --");
    await getBusinessSkilledEmployees();

    console.log("\n-- All subquery examples executed successfully --");
  } catch (error) {
    console.error("Error executing subquery examples:", error);
  }
};

export default {queueMicrotask, getHighRevenueProducts, getEmployeesWithExpertise, getPremiumCustomers, getAboveAverageSales, getBusinessSkilledEmployees, runSubqueryExamples};