import { initializeTables } from "./config/database";
import { SalesService } from "./examples/querying &filtering";
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

    // joins

    // grouping

    //
  } catch (error) {
    console.error("Error initializing database:", error);
  }
})();
