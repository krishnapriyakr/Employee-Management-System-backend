import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IEmployee extends Document {
  // Personal Information
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    gender: 'male' | 'female' | 'other';
    profileImage?: string;
  };
  
  // Employment Information
  employmentInfo: {
    employeeId: string;
    department: string;
    position: string;
    salary: number;
    joiningDate: Date;
    status: 'active' | 'inactive' | 'on-leave';
  };
  
  // Address Information
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  
  // Emergency Contact
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  
  // System Fields
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<IEmployee>(
  {
    personalInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      phone: { type: String, required: true },
      dateOfBirth: { type: Date, required: true },
      gender: { type: String, enum: ['male', 'female', 'other'], required: true },
      profileImage: { type: String }
    },
    employmentInfo: {
      employeeId: { type: String, required: true, unique: true },
      department: { type: String, required: true },
      position: { type: String, required: true },
      salary: { type: Number, required: true },
      joiningDate: { type: Date, required: true },
      status: { type: String, enum: ['active', 'inactive', 'on-leave'], default: 'active' }
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      pincode: { type: String, required: true }
    },
    emergencyContact: {
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      phone: { type: String, required: true }
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  {
    timestamps: true
  }
);

// Auto-generate employeeId before saving
employeeSchema.pre('save', async function (next) {
  if (!this.isNew) return next();
  
  const count = await mongoose.model('Employee').countDocuments();
  this.employmentInfo.employeeId = `EMP${String(count + 1).padStart(3, '0')}`;
  next();
});

export default mongoose.model<IEmployee>('Employee', employeeSchema);