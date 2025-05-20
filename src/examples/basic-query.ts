import db, { executeQuery } from "../config/database";

export interface TUser {
    id?: number;
    fname: string;
    lname: string;
    age: number;
    created_at?: Date;
}

// Insert a single user into the database
export const insertOneUser = async (user: TUser): Promise<number | undefined> => {
    try {
        const res = await executeQuery(
            'INSERT INTO users (fname, lname, age) VALUES ($1, $2, $3) RETURNING id',
            [user.fname, user.lname, user.age]
        );
        const userId = res.rows[0]?.id;
        console.log(`User inserted with ID: ${userId}`);
        return userId;
    } catch (err) {
        console.error('Error inserting data:', err);
        throw err;
    }
}

// Insert multiple users into the database
export const insertMultipleUsers = async (users: TUser[]) : Promise<void> => {
    // For multiple Users Use Transaction
    const client = await db.getPool().connect();
    try {
        // Begin transaction
        await client.query('BEGIN');

        // Insert each user
        for (const user of users) {
            await client.query(
                'INSERT INTO users (fname, lname, age) VALUES($1, $2, $3)',
                [user.fname, user.lname, user.age]
            );
        }

        // Commit transaction
        await client.query('COMMIT');
        console.log(`${users.length} users inserted successfully`);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error inserting multiple users:', err);
        throw err; 
    } finally {
        client.release();
    }
}

// Query all users from the database
export const query = async (): Promise<TUser[]> => {
    try {
        const res = await executeQuery('SELECT * FROM users');
        console.log(`Retrieved ${res.rows.length} users`);
        return res.rows as TUser[];
    } catch (err) {
        console.error('Error querying data:', err);
        throw err;
    }
};

// delete all users from database
export const deleteAllUsers = async (): Promise<void> => {
    try {
        const res = await executeQuery('DELETE FROM users');
        console.log(`Deleted ${res.rowCount} users`)
    } catch (err) {
        console.error('Error deleting data:', err)
        throw err;
    }
}