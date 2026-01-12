import Transfer from '../models/Transfer.js';
import Asset from '../models/Asset.js';

// @desc    Create new transfer
// @route   POST /api/transfers
// @access  Private
export const createTransfer = async (req, res) => {
  try {
    const { assetId, fromBase, toBase, quantity, transferDate, notes } =
      req.body;

    // Validation
    if (!assetId || !fromBase || !toBase || !quantity) {
      return res.status(400).json({
        message: 'Please provide assetId, fromBase, toBase, and quantity',
      });
    }

    if (fromBase === toBase) {
      return res
        .status(400)
        .json({ message: 'Cannot transfer to the same base' });
    }

    // Check if asset exists in source base
    const sourceAsset = await Asset.findOne({ _id: assetId, baseId: fromBase });
    if (!sourceAsset) {
      return res
        .status(404)
        .json({ message: 'Asset not found in source base' });
    }

    // Check if sufficient quantity available
    if (sourceAsset.currentBalance < quantity) {
      return res.status(400).json({
        message: `Insufficient quantity. Available: ${sourceAsset.currentBalance}`,
      });
    }

    // Create transfer record
    const transfer = await Transfer.create({
      assetId,
      fromBase,
      toBase,
      quantity,
      transferDate: transferDate || Date.now(),
      status: 'completed',
      initiatedBy: req.user._id,
      approvedBy: req.user._id,
      notes,
    });

    // Update source base asset
    sourceAsset.currentBalance -= quantity;
    await sourceAsset.save();

    // Check if asset exists in destination base
    let destAsset = await Asset.findOne({
      name: sourceAsset.name,
      baseId: toBase,
    });

    if (destAsset) {
      // Asset exists, update balance
      destAsset.currentBalance += quantity;
      await destAsset.save();
    } else {
      // Create new asset entry for destination base
      destAsset = await Asset.create({
        name: sourceAsset.name,
        type: sourceAsset.type,
        baseId: toBase,
        openingBalance: 0,
        currentBalance: quantity,
        assigned: 0,
        expended: 0,
      });
    }

    const populatedTransfer = await Transfer.findById(transfer._id)
      .populate('assetId')
      .populate('fromBase')
      .populate('toBase')
      .populate('initiatedBy', 'username');

    res.status(201).json({
      success: true,
      data: populatedTransfer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all transfers
// @route   GET /api/transfers
// @access  Private
export const getTransfers = async (req, res) => {
  try {
    const { baseId, status, startDate, endDate } = req.query;

    // Build filter
    let filter = {};

    // Role-based filtering
    if (req.user.role === 'base_commander' && req.user.assignedBase) {
      filter.$or = [
        { fromBase: req.user.assignedBase },
        { toBase: req.user.assignedBase },
      ];
    } else if (baseId) {
      filter.$or = [{ fromBase: baseId }, { toBase: baseId }];
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Date filter
    if (startDate || endDate) {
      filter.transferDate = {};
      if (startDate) filter.transferDate.$gte = new Date(startDate);
      if (endDate) filter.transferDate.$lte = new Date(endDate);
    }

    const transfers = await Transfer.find(filter)
      .populate('assetId')
      .populate('fromBase')
      .populate('toBase')
      .populate('initiatedBy', 'username')
      .populate('approvedBy', 'username')
      .sort({ transferDate: -1 });

    res.status(200).json({
      success: true,
      count: transfers.length,
      data: transfers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single transfer
// @route   GET /api/transfers/:id
// @access  Private
export const getTransfer = async (req, res) => {
  try {
    const transfer = await Transfer.findById(req.params.id)
      .populate('assetId')
      .populate('fromBase')
      .populate('toBase')
      .populate('initiatedBy', 'username')
      .populate('approvedBy', 'username');

    if (!transfer) {
      return res.status(404).json({ message: 'Transfer not found' });
    }

    res.status(200).json({
      success: true,
      data: transfer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
