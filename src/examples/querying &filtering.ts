import db from "../config/database";

interface Sales {
  sale_id?: number;
  product_id: number;
  quantity_sold: number;
  sale_date: Date;
  total_price: number;
}

export class SalesService {
  async createSales(sale: Sales): Promise<Sales> {
    // If sale_id is not provided, generate one (for example, using a timestamp or random number)
    if (!sale.sale_id) {
      // For simplicity, we'll use a random number between 1 and 10000
      sale.sale_id = Math.floor(Math.random() * 10000) + 1;
    }

    const result = await db.executeQuery(
      "INSERT INTO sales (sale_id, product_id, quantity_sold, sale_date, total_price) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        sale.sale_id,
        sale.product_id,
        sale.quantity_sold,
        sale.sale_date,
        sale.total_price,
      ]
    );
    return result.rows[0];
  }
  async getSalesById(id: number): Promise<Sales | null> {
    const result = await db.executeQuery(
      "SELECT * FROM sales WHERE sale_id = $1",
      [id]
    );
    return result.rows[0] || null;
  }

  async getAllSales(): Promise<Sales[]> {
    const result = await db.executeQuery("SELECT * FROM sales");
    return result.rows;
  }
  async deleteSalesById(id: number): Promise<void> {
    await db.executeQuery("DELETE FROM sales WHERE sale_id = $1", [id]);
  }
  async getSalesByHighestQuantity(): Promise<Sales[]> {
    const result = await db.executeQuery(
      "SELECT * FROM sales WHERE quantity_sold = (SELECT MAX(quantity_sold) FROM sales)"
    );
    return result.rows;
  }

  // sales for a given month in ascending order
  async getSalesByMonth(month: number): Promise<Sales[]> {
    const result = await db.executeQuery(
      "SELECT * FROM sales WHERE EXTRACT(MONTH FROM sale_date) = $1 ORDER BY sale_date ASC",
      [month]
    );
    return result.rows;
  }

  // sales for the most sold product on product table using JOIN
  async getMostSoldProduct(): Promise<Sales[]> {
    const result = await db.executeQuery(
      "SELECT p.product_id, p.product_name, SUM(s.quantity_sold) AS total_sold FROM sales s JOIN products p ON s.product_id = p.product_id GROUP BY p.product_id, p.product_name ORDER BY total_sold DESC LIMIT 1"
    );
    return result.rows;
  }

  //get sales where total price is greater than a certain amount(10000)
  async getSalesByTotalPrice(): Promise<Sales[]> {
    const result = await db.executeQuery(
      "SELECT * FROM sales WHERE total_price > $1",
      [10000]
    );
    return result.rows;
  }
}
