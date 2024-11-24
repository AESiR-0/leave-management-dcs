// app/api/leave-requests/bulk/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from ""@/lib/mongo"";

export async function PATCH(req: Request) {
  const { selectedRequests, status } = await req.json();

  const db = await connectToDatabase();
  const result = await db
    .collection("leave_requests")
    .updateMany(
      { _id: { $in: selectedRequests.map((id: string) => new ObjectId(id)) } },
      { $set: { status } }
    );

  if (result.modifiedCount > 0) {
    return NextResponse.json({ message: "Bulk action applied successfully" });
  } else {
    return NextResponse.json(
      { message: "Failed to apply bulk action" },
      { status: 400 }
    );
  }
}
