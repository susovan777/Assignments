import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Asset name is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Asset type is required'],
      enum: ['vehicle', 'weapon', 'ammunition', 'equipment'],
      trim: true,
    },
    baseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Base',
      required: [true, 'Base ID is required'],
    },
    openingBalance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    currentBalance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    assigned: {
      type: Number,
      default: 0,
      min: 0,
    },
    expended: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
assetSchema.index({ baseId: 1, type: 1 });

const Asset = mongoose.model('Asset', assetSchema);

export default Asset;
