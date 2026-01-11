import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: [true, 'Asset ID is required'],
    },
    baseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Base',
      required: [true, 'Base ID is required'],
    },
    personnelName: {
      type: String,
      required: [true, 'Personnel name is required'],
      trim: true,
    },
    personnelId: {
      type: String,
      required: [true, 'Personnel ID is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: 1,
    },
    assignmentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'returned'],
      default: 'active',
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
assignmentSchema.index({ baseId: 1, status: 1 });
assignmentSchema.index({ assetId: 1, assignmentDate: -1 });

const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment;
