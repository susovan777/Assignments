import mongoose from 'mongoose';

const urlsetSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    urls: [{ type: String }],
  },
  { timestamps: true }
);

const UrlSet = mongoose.model('UrlSet', urlsetSchema);

export default UrlSet;
