// app/api/leave-requests/[id]/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { status } = await req.json();

  const db = await connectToDatabase();
  const result = await db
    .collection("leave_requests")
    .updateOne({ _id: new ObjectId(id) }, { $set: { status } });

  if (result.modifiedCount > 0) {
    return NextResponse.json({ message: "Status updated successfully" });
  } else {
    return NextResponse.json(
      { message: "Failed to update status" },
      { status: 400 }
    );
  }
}
