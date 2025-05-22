import db, { executeQuery } from "../config/database";

export interface TProduct {
  product_id: number;
  product_name: string;
  category: string;
  unit_price: number;
}

export const insertMultipleCustomers = async (
  products: TProduct[]
): Promise<void> => {
  const client = await db.getPool().connect();
  try {
    await client.query("BEGIN");

    for (const product of products) {
      await client.query(
        "INSERT INTO products (product_name, category, unit_price, stock_quantity) VALUES ($1,$2,$3,$4)",
        [product.product_name, product.category, product.unit_price]
      );
    }

    await client.query("COMMIT");
    console.log(`${products.length} products inserted successfully`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error inserting multiple products", err);
    throw err;
  } finally {
    client.release();
  }
};

export const groupingSet = async (): Promise<TProduct[]> => {
  try {
    const res = await executeQuery(
      "SELECT products.product_name, products.category, SUM(products.unit_price) FROM products GROUP BY GROUPING SETS (products.product_name, products.category)"
    );
    console.log(`Retrieved ${res.rowCount} products in grouping set`);
    return res.rows as TProduct[];
  } catch (err) {
    console.error("Error querying data => :", err);
    throw err;
  }
};

export const cube = async (): Promise<TProduct[]> => {
  try {
    const res = await executeQuery(
      "SELECT  products.product_name, products.category, SUM(products.unit_price) FROM  products GROUP BY  CUBE (products.product_name, products.category) ORDER BY  product_name, category"
    );
    console.log(`Retrieved ${res.rowCount} products in CUBE`);
    return res.rows as TProduct[];
  } catch (err) {
    console.error("Error querying data => :", err);
    throw err;
  }
};

export const rollup = async (): Promise<TProduct[]> => {
  try {
    const res = await executeQuery(
      "SELECT  products.product_name, products.category, SUM(products.unit_price) FROM  products GROUP BY ROLLUP (products.product_name, products.category) ORDER BY  product_name, category"
    );
    console.log(`Retrieved ${res.rowCount} products in RollUp`);
    return res.rows as TProduct[];
  } catch (err) {
    console.error("Error querying data => :", err);
    throw err;
  }
};
