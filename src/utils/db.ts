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

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function db(): Promise<void> {
  // Check if already connected
  if (connection.isConnected) {
    console.log("Already Connected to DB");
    return;
  }

  // Ensure the MONGODB_URL environment variable is available
  const mongoURI = process.env.MONGODB_URL;
  if (!mongoURI) {
    throw new Error("MONGODB_URL is not defined in the environment variables");
  }

  try {
    // Connect to the MongoDB database
    // const db = await mongoose.connect(mongoURI);
    
   const db = await mongoose.connect(mongoURI);
    connection.isConnected = db.connection.readyState;
     console.log("Connected to MongoDB");

    console.log(`Connected to DB with readyState: ${connection.isConnected}`);
  } catch (error) {
    console.error("DB Connection Failed:", error);
    // Optionally exit the process in case of failure (good for CLI apps)
    process.exit(1);
  }
}

export default db;
