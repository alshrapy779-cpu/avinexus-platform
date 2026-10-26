import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    required: true,
    enum: [
      'صاحب مزرعة', 'دكتور بيطري', 'صاحب مكتب', 'صاحب مصنع', 
      'عميل استشاري', 'دكتور استشاري', 'مدير', 'محاسب', 
      'عامل', 'متقدم لوظيفة', 'مشتري', 'أخرى'
    ]
  },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model<IUser>('User', UserSchema);
