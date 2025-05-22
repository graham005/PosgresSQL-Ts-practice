import { executeQuery } from "../config/database";

interface TEmployees {
  employee_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  hire_date: Date;
  job_id: string;
  salary: number;
}

interface TCustomers {
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

interface TOrders {
  order_id: number;
  customer_id: number;
  order_date: Date;
  status: string;
  total_amount: number;
}

interface TProducts {
  product_id: number;
  product_name: string;
  category: string;
  unit_price: number;
  stock_quantity: number;
}

interface TSales {
  sale_id: number;
  product_id: number;
  quantity_sold: number;
  sale_date: Date;
  total_price: number;
}

interface TSkills {
  skill_id: number;
  skill_name: string;
  skill_category: string;
}

interface TEmployeeSkills {
  employee_id: number;
  skill_id: number;
  proficiency_level: string;
  certification_date: Date | null;
}

//get all employees earning over average salary
export const employeesOverAvgSal = async (): Promise<TEmployees[]> => {
  try {
    const res = await executeQuery(
      `WITH avg_salary AS (
                SELECT AVG (salary) AS avg_sal FROM employees
            ) 
            SELECT first_name, last_name, salary 
            FROM employees, avg_salary 
            WHERE salary > avg_salary.avg_sal`
    );
    console.log(
      `Retrieved ${res.rowCount} employees earning over average salary`
    );
    return res.rows as TEmployees[];
  } catch (err) {
    console.error("Error encountered while querying => :", err);
    throw err;
  }
};

//cte update where we increase the salary of all users
export const increaseSalary = async (): Promise<TEmployees[]> => {
  try {
    await executeQuery(
      `WITH avg_sal AS (
                SELECT AVG(salary) AS avg_salary FROM employees
            ),
            lowSalary_employees AS (
                SELECT employee_id, salary*1.20 AS new_salary 
                FROM employees, avg_sal 
                WHERE salary <= avg_sal.avg_salary) 
            UPDATE employees 
            SET salary = lowSalary_employees.new_salary 
            FROM lowSalary_employees 
            WHERE employees.employee_id = lowSalary_employees.employee_id`
    );

    const res = await executeQuery("SELECT * FROM employees");
    return res.rows as TEmployees[];
  } catch (err) {
    console.error("Error encountered while querying => :", err);
    throw err;
  }
};


export const rankingBySalary = async (): Promise<TEmployees[]> => {
  try {
    const res = await executeQuery(
      `WITH ranked_employees AS (
                SELECT first_name, last_name, salary,
                RANK() OVER (ORDER BY salary DESC)
                AS rank
                FROM employees
            )
            SELECT * FROM ranked_employees;`
    );
    return res.rows as TEmployees[];
  } catch (err) {
    console.error("Error encountered while querying => :", err);
    throw err;
  }
};

// 1. High-value customer orders with CTE (using customers and orders tables)
export const getHighValueCustomers = async (
  threshold: number = 10000
): Promise<TCustomers[]> => {
  try {
    const res = await executeQuery(
      `WITH high_value_customers AS (
                SELECT c.customer_id, c.first_name, c.last_name, c.email, 
                       COUNT(o.order_id) AS total_orders, 
                       SUM(o.total_amount) AS total_spent
                FROM customers c
                JOIN orders o ON c.customer_id = o.customer_id
                GROUP BY c.customer_id, c.first_name, c.last_name, c.email
                HAVING SUM(o.total_amount) > $1
            )
            SELECT c.*, hvc.total_orders, hvc.total_spent
            FROM customers c
            JOIN high_value_customers hvc ON c.customer_id = hvc.customer_id
            ORDER BY hvc.total_spent DESC;`,
      [threshold]
    );
    console.log(
      `Retrieved ${res.rowCount} high-value customers spending over $${threshold}`
    );
    return res.rows as TCustomers[];
  } catch (err) {
    console.error("Error retrieving high-value customers:", err);
    throw err;
  }
};

// 2. Product inventory management with CTE UPDATE (using products table)
export const updateProductInventory = async (
  categoryToUpdate: string,
  increasePercentage: number = 15
): Promise<TProducts[]> => {
  try {
    // First update the products with CTE
    await executeQuery(
      `WITH low_stock_products AS (
                SELECT product_id, stock_quantity, 
                       ROUND(stock_quantity * (1 + $1/100)) AS new_stock
                FROM Products
                WHERE category = $2 AND stock_quantity < 50
            )
            UPDATE Products
            SET stock_quantity = lsp.new_stock
            FROM low_stock_products lsp
            WHERE Products.product_id = lsp.product_id;`,
      [increasePercentage, categoryToUpdate]
    );

    // Then retrieve the updated products
    const res = await executeQuery(
      `SELECT * FROM Products WHERE category = $1 ORDER BY stock_quantity;`,
      [categoryToUpdate]
    );
    console.log(
      `Updated inventory for ${res.rowCount} products in the ${categoryToUpdate} category`
    );
    return res.rows as TProducts[];
  } catch (err) {
    console.error("Error updating product inventory:", err);
    throw err;
  }
};

// 3. Employee skill certification with CTE INSERT (using employees and skills tables)
export const certifyEmployeeSkills = async (
  skillCategory: string,
  proficiencyLevel: string
): Promise<TEmployeeSkills[]> => {
  try {
    // Insert new certifications for qualified employees using CTE
    await executeQuery(
      `WITH qualified_employees AS (
                SELECT e.employee_id, s.skill_id
                FROM employees e
                CROSS JOIN skills s
                LEFT JOIN employee_skills es 
                    ON e.employee_id = es.employee_id AND s.skill_id = es.skill_id
                WHERE s.skill_category = $1
                AND es.employee_id IS NULL
                AND e.hire_date < CURRENT_DATE - INTERVAL '1 year'
            )
            INSERT INTO employee_skills (employee_id, skill_id, proficiency_level, certification_date)
            SELECT qe.employee_id, qe.skill_id, $2, CURRENT_DATE
            FROM qualified_employees qe;`,
      [skillCategory, proficiencyLevel]
    );

    // Fetch newly certified skills
    const res = await executeQuery(
      `SELECT es.* 
            FROM employee_skills es
            JOIN skills s ON es.skill_id = s.skill_id
            WHERE s.skill_category = $1 AND es.proficiency_level = $2
            AND es.certification_date = CURRENT_DATE;`,
      [skillCategory, proficiencyLevel]
    );

    console.log(`Added ${res.rowCount} new skill certifications for employees`);
    return res.rows as TEmployeeSkills[];
  } catch (err) {
    console.error("Error certifying employee skills:", err);
    throw err;
  }
};

// 4. Delete underperforming products with CTE (using products and sales tables)
export const removeUnderperformingProducts = async (
  minSales: number = 5
): Promise<number> => {
  try {
    const res = await executeQuery(
      `WITH product_performance AS (
                SELECT p.product_id, p.product_name, p.category,
                       COALESCE(SUM(s.quantity_sold), 0) AS total_units_sold
                FROM Products p
                LEFT JOIN Sales s ON p.product_id = s.product_id
                GROUP BY p.product_id, p.product_name, p.category
                HAVING COALESCE(SUM(s.quantity_sold), 0) < $1
            )
            DELETE FROM Products
            WHERE product_id IN (
                SELECT product_id FROM product_performance
            )
            RETURNING product_id;`,
      [minSales]
    );

    const deletedCount = res.rowCount || 0;
    console.log(
      `Removed ${deletedCount} underperforming products with less than ${minSales} units sold`
    );
    return deletedCount;
  } catch (err) {
    console.error("Error removing underperforming products:", err);
    throw err;
  }
};

// Main function to run all CTE examples
export const runAllCTEExamples = async () => {
  console.log("=== Running CTE Examples ===");

  // Run the existing examples
  console.log("\n1. Employees earning over average salary:");
  await employeesOverAvgSal();

  console.log("\n2. Increasing salary of employees below average:");
  await increaseSalary();

  console.log("\n3. Employee salary rankings:");
  const rankedEmployees = await rankingBySalary();
  console.log(
    `Top ranked employee by salary: ${rankedEmployees[0]?.first_name} ${rankedEmployees[0]?.last_name}`
  );

  // Run the new examples
  console.log("\n4. High value customers:");
  await getHighValueCustomers(8000);

  console.log("\n5. Updating product inventory for low-stock items:");
  await updateProductInventory("Electronics", 20);

  console.log("\n6. Certifying employees with new skills:");
  await certifyEmployeeSkills("Technical", "Intermediate");

  console.log("\n7. Removing underperforming products:");
  await removeUnderperformingProducts(10);

  console.log("\n=== Completed CTE Examples ===");
};
