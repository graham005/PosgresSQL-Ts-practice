import db, { executeQuery } from "../config/database";

export interface Products{
    product_id?: number;
    product_name: string;
    category: string;
    unit_price: number;

}
export const updateOneProduct = async (Product:Products): Promise<number| undefined> =>{
    try{
        const res =await executeQuery(
            'UPDATE Products SET unit_price = 3000.00 WHERE product_id =105 RETURNING id',
             [Product.product_name, Product.category,Product.unit_price]
        );
          const ProductsId = res.rows[0]?.id;
        console.log(`product updated with ID: ${ProductsId}`);
        return ProductsId;
    } catch (err) {
        console.error('Error updating data:', err);
        throw err;
    }
    }
export const deleteOneProduct = async (Product:Products):Promise<number|undefined> => {
    try{
        const res = await executeQuery(
            'DELETE FROM Products WHERE product_id=103 RETURNING id',
            [Product.product_name, Product.category, Product.unit_price]
        );
        const deletedId = res.rows[0]?.id;
        console.log(`Deleted product with ID: ${deletedId}`);
        return deletedId;
    }catch (err) {
        console.error('Error deleting data:', err);
        throw err;
    }
}
export const upsertProducts = async (Product:Products):Promise<number|undefined> =>{
    try{
        const res =await executeQuery(
             'INSERT INTO Products (product_name, category, unit_price) VALUES ($1, $2, $3, $4) ON CONFLICT (product_id) DO UPDATE SET unit_price =EXCLUDED.unit_price RETURNING id',
             [Product.product_name, Product.category,Product.unit_price]
        );
        const upsertId = res.rows[0]?.id;
           console.log(`upsert product with ID: ${upsertId}`);
        return upsertId;
    }catch (err) {
        console.error('Error upserting data:', err);
        throw err;
    }
    }
