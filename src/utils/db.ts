// import mongoose from "mongoose";
// // mongoose.set("debug", true);

// type ConnectionObject = {
//   isConnected?: number;
// };

// const connection: ConnectionObject = {};



// async function db(): Promise<void> {
//   if (connection.isConnected) {
//     console.log("Already Connected to DB");
//     return;
//   }

//   try {
//     const db = await mongoose.connect(process.env.MONGODB_URL!);
//     connection.isConnected = db.connection.readyState;

//     console.log("Connected to DB");
//   } catch (error) {
//     console.error("DB Connection Failed", error);
//     process.exit(1);
//   }
// }

// export default db;



import mongoose from "mongoose";

let isConnected: number | undefined; // Global variable to track connection status

async function db(): Promise<void> {
  // If already connected, reuse the connection
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    // Connect to MongoDB
    const db = await mongoose.connect(process.env.MONGODB_URL!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connection.readyState; // 1 = connected
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Database connection failed:", error);
    // Don't terminate the process; throw an error instead
    throw new Error("Database connection failed");
  }
}

export default db;
