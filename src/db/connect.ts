import { MongoClient, Db } from 'mongodb';

const connectionString = "mongodb://localhost:27017";
const client = new MongoClient(connectionString);
let db: Db;

export async function connect(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    await client.connect();
    console.log("Connected successfully to the database");
    db = client.db("sample_training");
    return db;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function closeConnection(): Promise<void> {
  await client.close();
}
