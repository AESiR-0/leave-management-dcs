import { MongoClient, ObjectId } from "mongodb";

export type LeaveCategory =
  | "Sick Leave"
  | "Casual Leave"
  | "Annual Leave"
  | "Emergency Leave";
export type LeaveStatus = "pending" | "approved" | "rejected";

export interface ILeaveRequest {
  _id: ObjectId;
  user: ObjectId; // Reference to User (typically a student)
  leaveCategory: LeaveCategory;
  leaveFrom: Date;
  leaveTo: Date;
  contactDuringLeave: string;
  reason: string;
  status: LeaveStatus;
  approvedBy?: ObjectId; // Reference to User (e.g., HOD, Faculty) who approved/rejected the leave
  createdAt: Date;
  updatedAt: Date;
}

export class LeaveRequestModel {
  private client: MongoClient;
  private dbName: string;

  constructor(client: MongoClient, dbName: string) {
    this.client = client;
    this.dbName = dbName;
  }

  // Get the leaveRequests collection
  private getCollection() {
    const db = this.client.db(this.dbName);
    return db.collection<ILeaveRequest>("leaveRequests");
  }

  // Create a new leave request
  async createLeaveRequest(
    leaveRequest: Omit<ILeaveRequest, "_id" | "createdAt" | "updatedAt">
  ): Promise<ILeaveRequest> {
    const collection = this.getCollection();
    const result = await collection.insertOne({
      ...leaveRequest,
      createdAt: new Date(),
      updatedAt: new Date(),
      _id: new ObjectId(),
    });
    return {
      _id: result.insertedId,
      ...leaveRequest,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // Find leave requests for a particular user
  async findLeaveRequestsByUser(userId: ObjectId): Promise<ILeaveRequest[]> {
    const collection = this.getCollection();
    return await collection.find({ user: userId }).toArray();
  }

  // Find leave request by status
  async findLeaveRequestsByStatus(
    status: LeaveStatus
  ): Promise<ILeaveRequest[]> {
    const collection = this.getCollection();
    return await collection.find({ status }).toArray();
  }

  // Update leave request status
  async updateLeaveRequestStatus(
    id: ObjectId,
    status: LeaveStatus,
    approvedBy?: ObjectId
  ): Promise<ILeaveRequest | null> {
    const collection = this.getCollection();
    const update: Partial<ILeaveRequest> = { status, updatedAt: new Date() };
    if (approvedBy) update.approvedBy = approvedBy;
    await collection.updateOne({ _id: id }, { $set: update });
    return await collection.findOne({ _id: id });
  }

  // Delete a leave request
  async deleteLeaveRequest(id: ObjectId): Promise<void> {
    const collection = this.getCollection();
    await collection.deleteOne({ _id: id });
  }
}
