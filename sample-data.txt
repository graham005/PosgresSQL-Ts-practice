2-- Insert sample data into Sales table

INSERT INTO Sales (sale_id, product_id, quantity_sold, sale_date, total_price) VALUES
(1, 101, 5, '2024-01-01', 2500.00),
(2, 102, 3, '2024-01-02', 900.00),
(3, 103, 2, '2024-01-02', 60.00),
(4, 104, 4, '2024-01-03', 80.00),
(5, 105, 6, '2024-01-03', 90.00);


3-- Insert sample data into Products table

INSERT INTO Products (product_id, product_name, category, unit_price) VALUES
(101, 'Laptop', 'Electronics', 500.00),
(102, 'Smartphone', 'Electronics', 300.00),
(103, 'Headphones', 'Electronics', 30.00),
(104, 'Keyboard', 'Electronics', 20.00),
(105, 'Mouse', 'Electronics', 15.00);

4-- Insert sample data into employees table

INSERT INTO employees VALUES 
(101, 'John', 'Smith', 'john.smith@company.com', '515-123-4567', '2020-06-15', 'IT_PROG', 9000.00),
(102, 'Sarah', 'Johnson', 'sarah.j@company.com', '515-123-4568', '2019-03-10', 'FI_ACCT', 8200.00),
(103, 'Michael', 'Williams', 'michael.w@company.com', '515-123-4569', '2021-09-22', 'SA_REP', 7500.00),
(104, 'Emily', 'Brown', 'emily.b@company.com', '515-123-4570', '2018-11-05', 'HR_REP', 6500.00),
(105, 'David', 'Jones', 'david.j@company.com', '515-123-4571', '2022-01-30', 'MK_MAN', 8800.00);


5-- Insert sample data into customer table 

(101, 'Robert', 'Taylor', 'robert.t@email.com', '212-555-1234', '123 Main St', 'New York', 'NY', '10001', '2022-01-15'),
(102, 'Jennifer', 'Anderson', 'jennifer.a@email.com', '213-555-2345', '456 Oak Ave', 'Los Angeles', 'CA', '90001', '2022-02-20'),
(103, 'Thomas', 'Wilson', 'thomas.w@email.com', '312-555-3456', '789 Pine Rd', 'Chicago', 'IL', '60007', '2022-03-10'),
(104, 'Lisa', 'Martinez', 'lisa.m@email.com', '305-555-4567', '321 Beach Blvd', 'Miami', 'FL', '33101', '2022-04-05'),
(105, 'William', 'Lee', 'william.l@email.com', '415-555-5678', '654 Hill St', 'San Francisco', 'CA', '94101', '2022-05-12'),
(106, 'Jessica', 'Garcia', 'jessica.g@email.com', '713-555-6789', '987 Lake View', 'Houston', 'TX', '77001', '2022-06-18'),
(107, 'Daniel', 'Davis', 'daniel.d@email.com', '602-555-7890', '147 Desert Way', 'Phoenix', 'AZ', '85001', '2022-07-22');


6-- Insert sample data into employee_skills table

INSERT INTO employee_skills VALUES
(101, 1, 'Expert', '2021-03-15'),
(101, 3, 'Advanced', '2020-11-20'),
(102, 2, 'Intermediate', '2022-01-10'),
(102, 4, 'Advanced', '2021-07-05'),
(103, 5, 'Beginner', NULL),
(103, 6, 'Intermediate', '2022-05-30'),
(104, 7, 'Advanced', '2021-09-12'),
(104, 8, 'Expert', '2020-12-01'),
(105, 9, 'Intermediate', '2022-02-18'),
(105, 10, 'Beginner', NULL);


7-- Insert sample data into skills table

INSERT INTO skills VALUES
(1, 'SQL Programming', 'Technical'),
(2, 'Financial Analysis', 'Business'),
(3, 'Java Development', 'Technical'),
(4, 'Budget Planning', 'Business'),
(5, 'Customer Relations', 'Soft Skills'),
(6, 'Sales Techniques', 'Business'),
(7, 'Conflict Resolution', 'Soft Skills'),
(8, 'Recruiting', 'HR'),
(9, 'Digital Marketing', 'Marketing'),
(10, 'Social Media', 'Marketing');


8-- Insert sample data into orders table

INSERT INTO orders VALUES
(1001, 101, '2023-01-15', 'Completed', 1250.50),
(1002, 102, '2023-01-16', 'Shipped', 899.99),
(1003, 103, '2023-01-17', 'Processing', 245.75),
(1004, 101, '2023-01-18', 'Completed', 1560.00),
(1005, 104, '2023-01-19', 'Cancelled', 430.25),
(1006, 105, '2023-01-20', 'Shipped', 720.40),
(1007, 102, '2023-01-21', 'Completed', 1895.30),
(1008, 103, '2023-01-22', 'Processing', 650.00);


