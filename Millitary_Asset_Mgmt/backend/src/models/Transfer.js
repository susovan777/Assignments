import mongoose from 'mongoose';

const transferSchema = new mongoose.Schema(
  {
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: [true, 'Asset ID is required'],
    },
    fromBase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Base',
      required: [true, 'Source base is required'],
    },
    toBase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Base',
      required: [true, 'Destination base is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: 1,
    },
    transferDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'rejected'],
      default: 'completed',
    },
    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for filtering
transferSchema.index({ fromBase: 1, transferDate: -1 });
transferSchema.index({ toBase: 1, transferDate: -1 });
transferSchema.index({ status: 1 });

const Transfer = mongoose.model('Transfer', transferSchema);

export default Transfer;
