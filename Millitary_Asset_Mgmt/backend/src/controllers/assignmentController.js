import Asset from '../models/Asset.js';
import Assignment from '../models/Assignment.js';
import Expenditure from '../models/Expenditure.js';

// @desc    Create new assignment
// @route   POST /api/assignments
// @access  Private
export const createAssignment = async (req, res) => {
  try {
    const {
      assetId,
      baseId,
      personnelName,
      personnelId,
      quantity,
      assignmentDate,
    } = req.body;

    // Validation
    if (!assetId || !baseId || !personnelName || !personnelId || !quantity) {
      return res.status(400).json({
        message: 'Please provide all required fields',
      });
    }

    // Check asset availability
    const asset = await Asset.findOne({ _id: assetId, baseId });
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found in this base' });
    }

    const availableQty = asset.currentBalance - asset.assigned;
    if (availableQty < quantity) {
      return res.status(400).json({
        message: `Insufficient quantity. Available: ${availableQty}`,
      });
    }

    // Create assignment
    const assignment = await Assignment.create({
      assetId,
      baseId,
      personnelName,
      personnelId,
      quantity,
      assignmentDate: assignmentDate || Date.now(),
      status: 'active',
      assignedBy: req.user._id,
    });

    // Update asset assigned count
    asset.assigned += quantity;
    await asset.save();

    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('assetId')
      .populate('baseId')
      .populate('assignedBy', 'username');

    res.status(201).json({
      success: true,
      data: populatedAssignment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private
export const getAssignments = async (req, res) => {
  try {
    const { baseId, status, startDate, endDate } = req.query;

    // Build filter
    let filter = {};

    // Role-based filtering
    if (req.user.role === 'base_commander' && req.user.assignedBase) {
      filter.baseId = req.user.assignedBase;
    } else if (baseId) {
      filter.baseId = baseId;
    }

    if (status) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.assignmentDate = {};
      if (startDate) filter.assignmentDate.$gte = new Date(startDate);
      if (endDate) filter.assignmentDate.$lte = new Date(endDate);
    }

    const assignments = await Assignment.find(filter)
      .populate('assetId')
      .populate('baseId')
      .populate('assignedBy', 'username')
      .sort({ assignmentDate: -1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Return assignment
// @route   PUT /api/assignments/:id/return
// @access  Private
export const returnAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.status === 'returned') {
      return res.status(400).json({ message: 'Assignment already returned' });
    }

    // Update assignment
    assignment.status = 'returned';
    assignment.returnDate = Date.now();
    await assignment.save();

    // Update asset
    const asset = await Asset.findById(assignment.assetId);
    asset.assigned -= assignment.quantity;
    asset.currentBalance += assignment.quantity;
    await asset.save();

    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('assetId')
      .populate('baseId')
      .populate('assignedBy', 'username');

    res.status(200).json({
      success: true,
      data: populatedAssignment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create expenditure
// @route   POST /api/expenditures
// @access  Private
export const createExpenditure = async (req, res) => {
  try {
    const { assetId, baseId, quantity, reason, expenditureDate } = req.body;

    // Validation
    if (!assetId || !baseId || !quantity || !reason) {
      return res.status(400).json({
        message: 'Please provide all required fields',
      });
    }

    // Check asset availability
    const asset = await Asset.findOne({ _id: assetId, baseId });
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found in this base' });
    }

    if (asset.currentBalance < quantity) {
      return res.status(400).json({
        message: `Insufficient quantity. Available: ${asset.currentBalance}`,
      });
    }

    // Create expenditure
    const expenditure = await Expenditure.create({
      assetId,
      baseId,
      quantity,
      reason,
      expenditureDate: expenditureDate || Date.now(),
      recordedBy: req.user._id,
    });

    // Update asset
    asset.currentBalance -= quantity;
    asset.expended += quantity;
    await asset.save();

    const populatedExpenditure = await Expenditure.findById(expenditure._id)
      .populate('assetId')
      .populate('baseId')
      .populate('recordedBy', 'username');

    res.status(201).json({
      success: true,
      data: populatedExpenditure,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all expenditures
// @route   GET /api/expenditures
// @access  Private
export const getExpenditures = async (req, res) => {
  try {
    const { baseId, startDate, endDate } = req.query;

    let filter = {};

    if (req.user.role === 'base_commander' && req.user.assignedBase) {
      filter.baseId = req.user.assignedBase;
    } else if (baseId) {
      filter.baseId = baseId;
    }

    if (startDate || endDate) {
      filter.expenditureDate = {};
      if (startDate) filter.expenditureDate.$gte = new Date(startDate);
      if (endDate) filter.expenditureDate.$lte = new Date(endDate);
    }

    const expenditures = await Expenditure.find(filter)
      .populate('assetId')
      .populate('baseId')
      .populate('recordedBy', 'username')
      .sort({ expenditureDate: -1 });

    res.status(200).json({
      success: true,
      count: expenditures.length,
      data: expenditures,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
