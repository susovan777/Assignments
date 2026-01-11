import Purchase from '../models/Purchase.js';
import Asset from '../models/Asset.js';

// @desc    Create new purchase
// @route   POST /api/purchases
// @access  Private (Admin, Base Commander, Logistics Officer)
export const createPurchase = async (req, res) => {
  try {
    const { assetId, baseId, quantity, purchaseDate, notes } = req.body;

    // Validation
    if (!assetId || !baseId || !quantity) {
      return res
        .status(400)
        .json({ message: 'Please provide assetId, baseId, and quantity' });
    }

    // Check if asset exists
    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    // Create purchase
    const purchase = await Purchase.create({
      assetId,
      baseId,
      quantity,
      purchaseDate: purchaseDate || Date.now(),
      createdBy: req.user._id,
      notes,
    });

    // Update asset current balance
    asset.currentBalance += quantity;
    await asset.save();

    const populatedPurchase = await Purchase.findById(purchase._id)
      .populate('assetId')
      .populate('baseId')
      .populate('createdBy', 'username');

    res.status(201).json({
      success: true,
      data: populatedPurchase,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all purchases
// @route   GET /api/purchases
// @access  Private
export const getPurchases = async (req, res) => {
  try {
    const { baseId, equipmentType, startDate, endDate } = req.query;

    // Build filter
    let filter = {};

    // Role-based filtering
    if (req.user.role === 'base_commander' && req.user.assignedBase) {
      filter.baseId = req.user.assignedBase;
    } else if (baseId) {
      filter.baseId = baseId;
    }

    // Date filter
    if (startDate || endDate) {
      filter.purchaseDate = {};
      if (startDate) filter.purchaseDate.$gte = new Date(startDate);
      if (endDate) filter.purchaseDate.$lte = new Date(endDate);
    }

    let purchases = await Purchase.find(filter)
      .populate('assetId')
      .populate('baseId')
      .populate('createdBy', 'username')
      .sort({ purchaseDate: -1 });

    // Filter by equipment type if provided
    if (equipmentType) {
      purchases = purchases.filter(
        (p) => p.assetId && p.assetId.type === equipmentType
      );
    }

    res.status(200).json({
      success: true,
      count: purchases.length,
      data: purchases,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single purchase
// @route   GET /api/purchases/:id
// @access  Private
export const getPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate('assetId')
      .populate('baseId')
      .populate('createdBy', 'username');

    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    res.status(200).json({
      success: true,
      data: purchase,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
