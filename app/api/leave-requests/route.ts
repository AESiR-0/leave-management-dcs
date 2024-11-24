// pages/api/leave-requests.ts

import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dbName = "your-database-name"; // Replace with your database name
// app/api/leave-requests/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongo";

export async function GET() {
  const db = await connectToDatabase();
  const leaveRequests = await db.collection("leave_requests").find().toArray();
  return NextResponse.json(leaveRequests);
}

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { leaveCategory, startDate, endDate, numDays, reason } = req.body;

    // Validate request data
    if (!leaveCategory || !startDate || !endDate || !numDays || !reason) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      await client.connect();
      const db = client.db(dbName);
      const leaveRequestsCollection = db.collection("leave_requests");

      // Create a new leave request document
      const newLeaveRequest = {
        leaveCategory,
        startDate,
        endDate,
        numDays,
        reason,
        status: "pending",
        createdAt: new Date(),
      };

      const result = await leaveRequestsCollection.insertOne(newLeaveRequest);

      res.status(201).json({ message: "Leave request submitted successfully" });
    } catch (error) {
      console.error("Error saving leave request:", error);
      res.status(500).json({ message: "Failed to submit leave request" });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
