import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Database already connected");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

    // console.log(db)

    connection.isConnected = db.connections[0].readyState;

    // console.log(db.connections)

    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connection faild", error);
    process.exit(1);
  }
}

export default dbConnect;

