import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

// mongoose.connection.on("connected", () => {
//   console.log("MongoDB Connected");
// });

// mongoose.connection.on("error", (err) => {
//   console.log(
//     "MongoDB connection error, please make sure the server is running: " + err
//   );
//   process.exit(1);
// });

async function db(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already Connected to DB");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URL!);
    connection.isConnected = db.connection.readyState;

    console.log("Connected to DB");
  } catch (error) {
    console.error("DB Connection Failed", error);
    process.exit(1);
  }
}

export default db;
