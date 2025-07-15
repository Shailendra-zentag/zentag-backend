import mongoose from 'mongoose';
import shortid from 'shortid';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  userId: { type: String, default: shortid.generate, unique: true },
  password: { type: String, required: true },
  isBillingAdmin: { type: String, default: "false" },
  photo: { type: String, default: "" },
  role: { type: String, default: "user" },
  features: { type: [String], default: [] },
  permissions: { type: [String], default: [] },
  timezoneRegion: { type: String },
  sports: { type: [String], default: [] },
  streamProcessLimit: { type: Number, default: 1 },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
