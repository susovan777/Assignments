import Asset from '../models/Asset.js';
import Purchase from '../models/Purchase.js';
import Transfer from '../models/Transfer.js';
import Assignment from '../models/Assignment.js';
import Expenditure from '../models/Expenditure.js';

// @desc    Get dashboard metrics
// @route   GET /api/dashboard
// @access  Private
export const getDashboardMetrics = async (req, res) => {
  try {
    const { baseId, equipmentType, startDate, endDate } = req.query;

    // Build query filter based on user role
    let baseFilter = {};

    if (req.user.role === 'base_commander' && req.user.assignedBase) {
      baseFilter.baseId = req.user.assignedBase;
    } else if (baseId) {
      baseFilter.baseId = baseId;
    }

    // Add equipment type filter
    let assetFilter = { ...baseFilter };
    if (equipmentType) {
      assetFilter.type = equipmentType;
    }

    // Date filter for transactions
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Get all assets
    const assets = await Asset.find(assetFilter).populate('baseId');

    // Calculate opening balance (sum of opening balances)
    const openingBalance = assets.reduce(
      (sum, asset) => sum + asset.openingBalance,
      0
    );

    // Calculate current balance
    const currentBalance = assets.reduce(
      (sum, asset) => sum + asset.currentBalance,
      0
    );

    // Get total purchases
    const purchases = await Purchase.find({ ...baseFilter, ...dateFilter });
    const totalPurchases = purchases.reduce((sum, p) => sum + p.quantity, 0);

    // Get transfers in and out
    const transfersIn = await Transfer.find({
      toBase: baseFilter.baseId,
      status: 'completed',
      ...dateFilter,
    });
    const totalTransfersIn = transfersIn.reduce(
      (sum, t) => sum + t.quantity,
      0
    );

    const transfersOut = await Transfer.find({
      fromBase: baseFilter.baseId,
      status: 'completed',
      ...dateFilter,
    });
    const totalTransfersOut = transfersOut.reduce(
      (sum, t) => sum + t.quantity,
      0
    );

    // Net movement
    const netMovement = totalPurchases + totalTransfersIn - totalTransfersOut;

    // Get assigned and expended
    const totalAssigned = assets.reduce(
      (sum, asset) => sum + asset.assigned,
      0
    );
    const totalExpended = assets.reduce(
      (sum, asset) => sum + asset.expended,
      0
    );

    // Closing balance calculation
    const closingBalance =
      openingBalance + netMovement - totalAssigned - totalExpended;

    res.status(200).json({
      success: true,
      data: {
        openingBalance,
        closingBalance,
        netMovement,
        purchases: totalPurchases,
        transfersIn: totalTransfersIn,
        transfersOut: totalTransfersOut,
        assigned: totalAssigned,
        expended: totalExpended,
        assetsCount: assets.length,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get movement details (for popup)
// @route   GET /api/dashboard/movements
// @access  Private
export const getMovementDetails = async (req, res) => {
  try {
    const { baseId, startDate, endDate } = req.query;

    let baseFilter = {};
    if (req.user.role === 'base_commander' && req.user.assignedBase) {
      baseFilter.baseId = req.user.assignedBase;
    } else if (baseId) {
      baseFilter.baseId = baseId;
    }

    const dateFilter = {};
    if (startDate || endDate) {
      const dateQuery = {};
      if (startDate) dateQuery.$gte = new Date(startDate);
      if (endDate) dateQuery.$lte = new Date(endDate);
      dateFilter.createdAt = dateQuery;
    }

    // Get detailed purchase data
    const purchases = await Purchase.find({ ...baseFilter, ...dateFilter })
      .populate('assetId')
      .populate('baseId')
      .populate('createdBy', 'username')
      .sort({ purchaseDate: -1 });

    // Get transfers in
    const transfersIn = await Transfer.find({
      toBase: baseFilter.baseId,
      status: 'completed',
      ...dateFilter,
    })
      .populate('assetId')
      .populate('fromBase')
      .populate('toBase')
      .populate('initiatedBy', 'username')
      .sort({ transferDate: -1 });

    // Get transfers out
    const transfersOut = await Transfer.find({
      fromBase: baseFilter.baseId,
      status: 'completed',
      ...dateFilter,
    })
      .populate('assetId')
      .populate('fromBase')
      .populate('toBase')
      .populate('initiatedBy', 'username')
      .sort({ transferDate: -1 });

    res.status(200).json({
      success: true,
      data: {
        purchases,
        transfersIn,
        transfersOut,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
