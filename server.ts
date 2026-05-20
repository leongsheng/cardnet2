import express from "express";
import path from "path";
import { MongoClient, ObjectId, Collection, ServerApiVersion } from "mongodb";
import { Contact, SystemConfig } from "./src/types";
import 'dotenv/config';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "5mb" })); // Increase limit for base64 avatars

let dbMode: "database" | "memory" = "memory";
let dbConnected = false;
let dbError: string | null = null;
let contactsCollection: Collection<Omit<Contact, "_id">> | null = null;

// Memory Fallback
let memoryContacts: any[] = [];

// Initialize MongoDB
let initPromise: Promise<void> | null = null;
async function initDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    dbError = "MONGODB_URI environment variable not found. Falling back to memory mode.";
    console.log(dbError);
    return;
  }

  try {
    dbMode = "database";
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    await client.connect();
    dbConnected = true;
    const db = client.db();
    contactsCollection = db.collection("contacts");
    console.log(`Connected to MongoDB: ${db.databaseName}`);
  } catch (err: any) {
    dbConnected = false;
    dbError = `MongoDB Connection Error: ${err.message}`;
    console.error(dbError);
    console.log("Falling back to memory mode.");
  }
}

initPromise = initDB();

// Wait for database initialization on every request
app.use(async (req, res, next) => {
  if (initPromise) {
    await initPromise;
  }
  next();
});

// API Routes
app.get("/api/config", (req, res) => {
  const config: SystemConfig = {
    configured: true,
    mode: dbMode,
    connected: dbConnected,
    dbName: dbConnected && contactsCollection ? "contacts" : "Memory Array",
    error: dbError,
  };
  res.json(config);
});

app.get("/api/contacts", async (req, res) => {
  if (dbConnected && contactsCollection) {
    try {
      const contacts = await contactsCollection.find().sort({ createdAt: -1 }).toArray();
      res.json(contacts);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  } else {
    res.json(memoryContacts);
  }
});

app.post("/api/contacts", async (req, res) => {
  const newContact = {
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (dbConnected && contactsCollection) {
    try {
      const result = await contactsCollection.insertOne(newContact);
      res.status(201).json({ ...newContact, _id: result.insertedId });
    } catch (err: any) {
      console.error("Insert Error", err);
      res.status(500).json({ error: "Failed to create contact: " + err.message });
    }
  } else {
    const memContact = { ...newContact, _id: new ObjectId().toString() };
    memoryContacts.unshift(memContact);
    res.status(201).json(memContact);
  }
});

app.get("/api/contacts/:id", async (req, res) => {
  const { id } = req.params;
  
  if (dbConnected && contactsCollection) {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    try {
      const contact = await contactsCollection.findOne({ _id: new ObjectId(id) });
      if (contact) {
        res.json(contact);
      } else {
        res.status(404).json({ error: "Contact not found" });
      }
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch contact" });
    }
  } else {
    const contact = memoryContacts.find(c => c._id === id);
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ error: "Contact not found" });
    }
  }
});

app.put("/api/contacts/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body, updatedAt: new Date().toISOString() };
  delete updateData._id;

  if (dbConnected && contactsCollection) {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    try {
      const result = await contactsCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: "after" }
      );
      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ error: "Contact not found" });
      }
    } catch (err: any) {
      console.error("Update Error", err);
      res.status(500).json({ error: "Failed to update contact: " + err.message });
    }
  } else {
    const index = memoryContacts.findIndex(c => c._id === id);
    if (index !== -1) {
      memoryContacts[index] = { ...memoryContacts[index], ...updateData };
      res.json(memoryContacts[index]);
    } else {
      res.status(404).json({ error: "Contact not found" });
    }
  }
});

app.delete("/api/contacts/:id", async (req, res) => {
  const { id } = req.params;

  if (dbConnected && contactsCollection) {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    try {
      const result = await contactsCollection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 1) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Contact not found" });
      }
    } catch (err) {
      res.status(500).json({ error: "Failed to delete contact" });
    }
  } else {
    const initialLength = memoryContacts.length;
    memoryContacts = memoryContacts.filter(c => c._id !== id);
    if (memoryContacts.length < initialLength) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Contact not found" });
    }
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bypass listen in Vercel Serverless Function
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => { // Fixed TypeScript issue by providing 0.0.0.0 as string
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
