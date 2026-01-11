import mongoose from 'mongoose';

const baseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Base name is required'],
      unique: true,
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    commander: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Base = mongoose.model('Base', baseSchema);

export default Base;
