import db, { executeQuery } from "../config/database";

// User interface defining the structure of user data
export interface Products {
  product_id?: number;
  product_name: string;
  category: string;
  unit_price: number;
}

// Insert a single user into the database
export const insertOneProduct = async (
  Product: Products
): Promise<number | undefined> => {
  try {
    const res = await executeQuery(
      "INSERT INTO users (product_name, category, unit_price) VALUES ($1, $2, $3, $4) RETURNING id",
      [Product.product_name, Product.category, Product.unit_price]
    );
    const ProductsId = res.rows[0]?.id;
    console.log(`product inserted with ID: ${ProductsId}`);
    return ProductsId;
  } catch (err) {
    console.error("Error inserting data:", err);
    throw err;
  }
};

// Insert multiple users into the database
export const insertMultipleProducts = async (
  Product: Products[]
): Promise<void> => {
  const client = await db.getPool().connect();
  try {
    // Begin transaction
    await client.query("BEGIN");

    // Insert each user
    for (const product of Product) {
      await client.query(
        "INSERT INTO users (product_name, category, unit_price) VALUES ($1, $2, $3, $4)",
        [product.product_name, product.category, product.unit_price]
      );
    }

    // Commit transaction
    await client.query("COMMIT");
    console.log(`${Product.length} products inserted successfully`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error inserting multiple products:", err);
    throw err;
  } finally {
    client.release();
  }
};

// Query all users from the database
export const query = async (): Promise<Products[]> => {
  try {
    const res = await executeQuery("SELECT * FROM products");
    console.log(`Retrieved ${res.rows.length} products`);
    return res.rows as Products[];
  } catch (err) {
    console.error("Error querying data:", err);
    throw err;
  }
};

// delete all users from the database
export const deleteAllUsers = async (): Promise<void> => {
  try {
    const res = await executeQuery("DELETE FROM users");
    console.log(`Deleted ${res.rowCount} users`);
  } catch (err) {
    console.error("Error deleting data:", err);
    throw err;
  }
};
export interface Sales {
  sale_id?: number;
  product_id: number;
  quantity_sold: number;
  sale_date: Date;
  total_price: number;
}
export const insertOneSales = async (
  sales: Sales
): Promise<number | undefined> => {
  try {
    const res = await executeQuery(
      "INSERT INTO sales (product_id, quantity_sold, sale_date, total_price) VALUES ($1, $2, $3, $4) RETURNING sale_id",
      [
        sales.product_id,
        sales.quantity_sold,
        sales.sale_date,
        sales.total_price,
      ]
    );
    const salesId = res.rows[0]?.id;
    console.log(`Sales inserted with ID: ${salesId}`);
    return salesId;
  } catch (err) {
    console.error("Error inserting data:", err);
    throw err;
  }
};
export const insertMultipleSales = async (sales: Sales[]): Promise<void> => {
  const client = await db.getPool().connect();
  try {
    await client.query("BEGIN");

    for (const sale of sales) {
      await client.query(
        "INSERT INTO sales (product_id, quantity_sold, sale_date, total_price) VALUES ($1, $2, $3, $4)",
        [sale.product_id, sale.quantity_sold, sale.sale_date, sale.total_price]
      );
    }

    // Commit transaction
    await client.query("COMMIT");
    console.log(`${sales.length} sales inserted successfully`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error inserting multiple sales:", err);
    throw err;
  } finally {
    client.release();
  }
};
export const querySales = async (): Promise<Sales[]> => {
  try {
    const res = await executeQuery("SELECT * FROM sales");
    console.log(`Retrieved ${res.rows.length} sales`);
    return res.rows as Sales[];
  } catch (err) {
    console.error("Error querying data:", err);
    throw err;
  }
};
export const deleteAllSales = async (): Promise<void> => {
  try {
    const res = await executeQuery("DELETE FROM sales");
    console.log(`Deleted ${res.rowCount} sales`);
  } catch (err) {
    console.error("Error deleting data:", err);
    throw err;
  }
};
export interface SalesWithProduct {
  sale_id: number;
  product_id: number;
  quantity_sold: number;
  sale_date: Date;
  total_price: number;
  product_name: string;
  category: string;
  unit_price: number;
}

export const JoinSalesWithProductDetails = async (): Promise<
  SalesWithProduct[]
> => {
  try {
    const res = await executeQuery(`
            SELECT s.sale_id, s.product_id, s.quantity_sold, s.sale_date, s.total_price,
                   p.product_name, p.category, p.unit_price
            FROM sales s
            JOIN products p ON s.product_id = p.product_id
        `);
    console.log(`Retrieved ${res.rows.length} sales with product details`);
    return res.rows as SalesWithProduct[];
  } catch (err) {
    console.error("Error joining sales and products:", err);
    throw err;
  }
};
