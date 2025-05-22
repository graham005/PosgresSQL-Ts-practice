import db from "../config/database";// Adjust the import path as necessary
//grouping sales by products with custom filtering
const groupSalesByProduct =async (startDate?:Date , EndDate?:Date)=>{
    try{ 
        let query = `
            SELECT p.product_name, 
                   SUM(s.quantity_sold) AS total_quantity_sold, 
                   SUM(s.total_price) AS total_sales
            FROM Sales s
            JOIN Products p ON s.product_id = p.product_id
        `;
        //filters for dat range
        if (startDate&&EndDate) {
            query +=
            "WHERE s.sale_date BETWEEN $1 AND $2";
            query +='GROUP BY p.product_name ORDER BY total_sales DESC';
             const params = startDate && EndDate ? [startDate, EndDate] : [];
            const result = await executeQuery(query, params);
            console.log('Sales grouped by product:', result.rows);
        }
    } catch (err) {
        console.error("Error in grouping sales by product:", err);
    }
};
//Group Employees by Job Role with Optional Salary Filter
const groupEmployeesByJob = async (minSalary?: number, maxSalary?: number) => {
    try {
        let query = `
            SELECT job_id, COUNT(employee_id) AS total_employees, SUM(salary) AS total_salary, AVG(salary) AS avg_salary FROM employees`;
             // Add salary filters if provided
        if (minSalary || maxSalary) {
            query += `
                WHERE salary >= $1 AND salary <= $2
            `;
        }

        query += `
            GROUP BY job_id
            ORDER BY total_salary DESC;
        `;
         const params = minSalary && maxSalary ? [minSalary, maxSalary] : [];
        const result = await executeQuery(query, params);
        console.log('Employees grouped by job:', result.rows);
    } catch (err) {
        console.error("Error in grouping employees by job:", err);
    }
};
// Group Orders by Customer with Custom Sorting and Pagination
const groupOrdersByCustomer = async (limit: number = 10, offset: number = 0) => {
    try {
        const query = `
            SELECT c.first_name, 
                   c.last_name, 
                   COUNT(o.order_id) AS total_orders, 
                   SUM(o.total_amount) AS total_spent
            FROM orders o
            JOIN customers c ON o.customer_id = c.customer_id
            GROUP BY c.customer_id
            ORDER BY total_spent DESC
             LIMIT $1 OFFSET $2;
        `;
        
        const result = await executeQuery(query, [limit, offset]);
        console.log('Orders grouped by customer:', result.rows);
    } catch (err) {
        console.error("Error in grouping orders by customer:", err);
    }
};
// Group Products by Category with Custom Sorting
const groupProductsByCategory = async (sortBy: 'total_sales' | 'total_quantity_sold' = 'total_sales') => {
    try {
        const query = `
            SELECT category, 
                   SUM(s.quantity_sold) AS total_quantity_sold, 
                   SUM(s.total_price) AS total_sales FROM Sales s JOIN Products p ON s.product_id = p.product_id GROUP BY category ORDER BY ${sortBy} DESC;`;
        
        const result = await executeQuery(query);
        console.log('Products grouped by category:', result.rows);
    } catch (err) {
        console.error("Error in grouping products by category:", err);
    }
};
//Group Employees by Hire Year with Dynamic Sorting
const groupEmployeesByHireYear = async (sortBy: 'hire_year' | 'total_employees' = 'hire_year') => {
    try {
        const query = `
            SELECT EXTRACT(YEAR FROM hire_date) AS hire_year, 
                   COUNT(employee_id) AS total_employees
            FROM employees
            GROUP BY hire_year
            ORDER BY ${sortBy} DESC;
        `;
        
        const result = await executeQuery(query);
        console.log('Employees grouped by hire year:', result.rows);
    } catch (err) {
        console.error("Error in grouping employees by hire year:", err);
    }
};

// Run all group queries
const runAllGroupQueries = async () => {
    // Sample usage with dynamic filters and pagination
    await groupSalesByProduct(new Date('2024-01-01'), new Date('2024-12-31')); // Filter by date range
    await groupEmployeesByJob(5000, 10000); 
    await groupOrdersByCustomer(5, 0); // Limit to 5 results
    await groupProductsByCategory('total_quantity_sold'); // Sort by quantity sold
    await groupEmployeesByHireYear('total_employees'); // Sort by number of employees
};
runAllGroupQueries();
export { groupSalesByProduct, groupEmployeesByJob, groupOrdersByCustomer, groupProductsByCategory, groupEmployeesByHireYear };
// executiion  queries
    async function executeQuery(query: string, params?: any[]): Promise<{ rows: any[] }> {

        return { rows: [] }; // Replace with actual query result
    }

    //export this file to index.ts
export default { groupSalesByProduct, groupEmployeesByJob, groupOrdersByCustomer, groupProductsByCategory, groupEmployeesByHireYear };

   