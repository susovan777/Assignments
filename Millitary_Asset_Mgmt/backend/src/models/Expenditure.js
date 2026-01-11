import mongoose from 'mongoose';

const expenditureSchema = new mongoose.Schema(
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
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: 1,
    },
    expenditureDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
    },
    recordedBy: {
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
expenditureSchema.index({ baseId: 1, expenditureDate: -1 });
expenditureSchema.index({ assetId: 1, expenditureDate: -1 });

const Expenditure = mongoose.model('Expenditure', expenditureSchema);

export default Expenditure;
