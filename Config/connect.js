const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI)
        console.log('MongoDB connected successfully');
        // Cleanup: remove any lingering unique index on `email` that may cause
        // E11000 duplicate key errors when email is omitted (null). This can
        // happen if an older schema created a unique index for email.
        try {
            const db = mongoose.connection.db;
            const coll = db.collection('users');
            const indexes = await coll.indexes();
            for (const idx of indexes) {
                if (idx.key && idx.key.email) {
                    try {
                        await coll.dropIndex('email_1');
                        console.log('Dropped unique index email_1 on users collection');
                    } catch (dropErr) {
                        console.warn('Could not drop email_1 index:', dropErr.message);
                    }
                    break;
                }
            }
        } catch (idxErr) {
            console.warn('Index check skipped or failed:', idxErr.message);
        }
    }catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
}
module.exports = connectDb;