import mongoose from "mongoose";
import dns from "node:dns";

// Configure public DNS servers to resolve MongoDB Atlas SRV records reliably
try {
  dns.setServers(["1.1.1.1", "1.0.0.1", "8.8.8.8", "8.8.4.4"]);
} catch (err) {
  // Ignore in restricted environments
}

// Known direct replica set URI for cluster-1.1odmq6b.mongodb.net (bypasses ISP SRV blocking)
const KNOWN_DIRECT_URI =
  "mongodb://satputesarang33_db_user:DAhmLp65kckNhE9i@ac-s48hpq8-shard-00-00.1odmq6b.mongodb.net:27017,ac-s48hpq8-shard-00-01.1odmq6b.mongodb.net:27017,ac-s48hpq8-shard-00-02.1odmq6b.mongodb.net:27017/ecommerce?ssl=true&replicaSet=atlas-11olfc-shard-0&authSource=admin&retryWrites=true&w=majority";

const resolveDirectUri = async (srvUri) => {
  try {
    const match = srvUri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/?]+)\/([^?]+)(\?.*)?/);
    if (!match) return null;
    const [, user, pass, host, db, query = ""] = match;

    const dnsPromises = dns.promises;
    dnsPromises.setServers(["1.1.1.1", "8.8.8.8", "1.0.0.1"]);
    const srvRecords = await dnsPromises.resolveSrv(`_mongodb._tcp.${host}`);
    if (!srvRecords || srvRecords.length === 0) return null;

    const hostList = srvRecords.map((r) => `${r.name}:${r.port}`).join(",");
    let txtParams = "ssl=true&authSource=admin";
    try {
      const txtRecords = await dnsPromises.resolveTxt(host);
      if (txtRecords.length > 0 && txtRecords[0].length > 0) {
        txtParams += `&${txtRecords[0][0]}`;
      }
    } catch {
      if (host.includes("1odmq6b")) {
        txtParams += "&replicaSet=atlas-11olfc-shard-0";
      }
    }
    const cleanQuery = query.replace(/^\?/, "");
    return `mongodb://${user}:${pass}@${hostList}/${db}?${txtParams}${cleanQuery ? `&${cleanQuery}` : ""}`;
  } catch {
    return null;
  }
};

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGODB;
  if (!mongoUri) {
    console.error("❌ MongoDB URI is not defined in environment variables (.env)");
    return null;
  }

  // Attempt 1: Try connecting with primary URI
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    return conn;
  } catch (initialError) {
    // If SRV lookup fails or times out, attempt direct replica set fallback
    const isSrv = mongoUri.startsWith("mongodb+srv://");
    if (isSrv) {
      try {
        const directUri = (await resolveDirectUri(mongoUri)) || KNOWN_DIRECT_URI;
        const conn = await mongoose.connect(directUri, {
          serverSelectionTimeoutMS: 8000,
        });
        return conn;
      } catch (fallbackError) {
        console.error("❌ MongoDB direct fallback failed:", fallbackError.message);
      }
    }

    console.error("❌ MongoDB connection failed:", initialError.message);
    return null;
  }
};

export default connectDB;
   