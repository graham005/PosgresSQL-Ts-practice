import { initializeTables } from "./config/database";
import { SalesService } from "./examples/querying &filtering";
import {
  Products,
  insertOneProduct,
  insertMultipleProducts,
  query,
} from "./examples/joins";
import {
  Sales,
  insertOneSales,
  insertMultipleSales,
  querySales,
} from "./examples/joins";
import {
  SalesWithProduct,
  JoinSalesWithProductDetails,
} from "./examples/joins";
import {
  updateOneProduct,
  deleteOneProduct,
  upsertProducts,
} from "./examples/modifying";
import {
  groupSalesByProduct,
  groupEmployeesByJob,
  groupOrdersByCustomer,
  groupProductsByCategory,
  groupEmployeesByHireYear,
} from "./examples/grouping";
import { runAllSetOperations } from "./examples/setOperations";

(async () => {
  try {
    await initializeTables();

    ///querying and  filtering
    const salesService = new SalesService();
    const sale = await salesService.createSales({
      sale_id: 1, // Providing a specific ID
      product_id: 1,
      quantity_sold: 5,
      sale_date: new Date(),
      total_price: 100.0,
    });

    console.log("Sale created:", sale);

    const allsales = await salesService.getAllSales();
    console.log("All sales:", allsales);

    const salesById = await salesService.getSalesById(1);
    console.log("Sale by ID:", salesById);

    const salesByHighestQuantity =
      await salesService.getSalesByHighestQuantity();
    console.log("Sales by highest quantity:", salesByHighestQuantity);

    ///? enock cubes

    //
  } catch (error) {
    console.error("Error initializing database:", error);
  }
})();

// !joins sheila
(async () => {
  try {
    // await initializeTables();

    const product_id = await insertOneProduct({
      product_id: 101,
      product_name: "Laptop",
      category: "Electronics",
      unit_price: 500.0,
    });
    console.log(`Product inserted with ID: ${product_id}`);

    const productToInsert: Products[] = [
      {
        product_id: 102,
        product_name: "Smartphone",
        category: "Electronics",
        unit_price: 300.0,
      },
      {
        product_id: 103,
        product_name: "Headphones",
        category: "Electronics",
        unit_price: 30.0,
      },
      {
        product_id: 104,
        product_name: "Keyboard",
        category: "Electronics",
        unit_price: 20.0,
      },
      {
        product_id: 105,
        product_name: "Mouse",
        category: "Electronics",
        unit_price: 15.0,
      },
    ];
    await insertMultipleProducts(productToInsert);

    const allProducts = await query();
    console.log("All products in database:", allProducts);
    console.table(allProducts);
  } catch (error) {
    console.error("Error in product operations:", error);
  }
})();

(async () => {
  try {
    // await initializeTables();

    const sales_id = await insertOneSales({
      product_id: 101,
      quantity_sold: 5,
      sale_date: new Date("2024-01-01"),
      total_price: 2500.0,
    });
    console.log(`Sales inserted with ID: ${sales_id}`);

    const salesToInsert: Sales[] = [
      {
        product_id: 102,
        quantity_sold: 3,
        sale_date: new Date("2024-01-02"),
        total_price: 900.0,
      },
      {
        product_id: 103,
        quantity_sold: 2,
        sale_date: new Date("2024-01-02"),
        total_price: 60.0,
      },
      {
        product_id: 104,
        quantity_sold: 4,
        sale_date: new Date("2024-01-02"),
        total_price: 80.0,
      },
      {
        product_id: 105,
        quantity_sold: 6,
        sale_date: new Date("2024-01-02"),
        total_price: 90.0,
      },
    ];
    await insertMultipleSales(salesToInsert);

    const allSales = await querySales();
    console.log("All sales in database:", allSales);
    console.table(allSales);
  } catch (error) {
    console.error("Error in sales operations:", error);
  }
})();

//modifying datahow
(async () => {
  try {
    await initializeTables();
    const product_id = await updateOneProduct({
      product_id: 105,
      product_name: "Laptop",
      category: "Electronics",
      unit_price: 3000.0,
    });
    console.log("update product");

    const deleteProduct = await deleteOneProduct({
      product_id: 103,
      product_name: "Laptop",
      category: "Electronics",
      unit_price: 3000.0,
    });
    console.log("delete product");

    const upsertData = await upsertProducts({
      product_id: 103,
      product_name: "Monitor",
      category: "Electronics",
      unit_price: 20000.0,
    });
  } catch (error) {
    console.log("error modifying data", error);
  }
})();

(async () => {
  try {
    await initializeTables();

    const salesWithProductDetails = await JoinSalesWithProductDetails();
    console.log("Sales with product details:", salesWithProductDetails);
    console.table(salesWithProductDetails);
  } catch (error) {
    console.error("Error in sales with product details operations:", error);
  }
})();

(async () => {
  try {
    await initializeTables();

    await runAllSetOperations();
  } catch (error) {
    console.error("Error in set operations:", error);
  }
})();
