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

// ranking by salary cte
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
