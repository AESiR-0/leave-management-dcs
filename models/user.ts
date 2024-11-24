import { MongoClient, ObjectId } from "mongodb";

export type UserRole = "admin" | "student" | "hod" | "faculty" | "lab_staff";

export interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  contact: string;
  role: UserRole;
  course?: string; // Only for students
  semester?: number; // Only for students
  leaveRequests: ObjectId[]; // Reference to LeaveRequest
  createdAt: Date;
}

export class UserModel {
  private client: MongoClient;
  private dbName: string;

  constructor(client: MongoClient, dbName: string) {
    this.client = client;
    this.dbName = dbName;
  }

  // Get the users collection
  private getCollection() {
    const db = this.client.db(this.dbName);
    return db.collection<IUser>("users");
  }

  // Create a new user
  async createUser(user: Omit<IUser, "_id" | "createdAt">): Promise<IUser> {
    const collection = this.getCollection();
    const result = await collection.insertOne({
      ...user,
      createdAt: new Date(),
      _id: new ObjectId(),
    });
    return { _id: result.insertedId, ...user, createdAt: new Date() };
  }

  // Find a user by email
  async findUserByEmail(email: string): Promise<IUser | null> {
    const collection = this.getCollection();
    return await collection.findOne({ email });
  }

  // Get all users
  async getAllUsers(): Promise<IUser[]> {
    const collection = this.getCollection();
    return await collection.find().toArray();
  }

  // Update user information
  async updateUser(
    id: ObjectId,
    updates: Partial<IUser>
  ): Promise<IUser | null> {
    const collection = this.getCollection();
    await collection.updateOne({ _id: id }, { $set: updates });
    return await collection.findOne({ _id: id });
  }

  // Delete a user
  async deleteUser(id: ObjectId): Promise<void> {
    const collection = this.getCollection();
    await collection.deleteOne({ _id: id });
  }
}
