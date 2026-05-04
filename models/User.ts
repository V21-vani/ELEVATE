import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  cgpa: number;
  skillMatrix: {
    DSA: number;
    DBMS: number;
    OS: number;
    Aptitude: number;
  };
  sprintHistory: {
    date: Date;
    completed: number;
    total: number;
  }[];
  appliedCompanies: string[];
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  cgpa: { type: Number, required: true, min: 0, max: 10 },
  skillMatrix: {
    DSA:      { type: Number, default: 0, min: 0, max: 100 },
    DBMS:     { type: Number, default: 0, min: 0, max: 100 },
    OS:       { type: Number, default: 0, min: 0, max: 100 },
    Aptitude: { type: Number, default: 0, min: 0, max: 100 },
  },
  sprintHistory: [{
    date:      { type: Date, default: Date.now },
    completed: { type: Number, default: 0 },
    total:     { type: Number, default: 0 },
  }],
  appliedCompanies: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
