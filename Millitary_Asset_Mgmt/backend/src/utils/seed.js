import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Base from '../models/Base.js';
import Asset from '../models/Asset.js';
import Purchase from '../models/Purchase.js';
import Transfer from '../models/Transfer.js';
import Assignment from '../models/Assignment.js';
import Expenditure from '../models/Expenditure.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI_LOCAL);
    console.log('MongoDB Connected');

    // Clear existing data
    await User.deleteMany();
    await Base.deleteMany();
    await Asset.deleteMany();
    await Purchase.deleteMany();
    await Transfer.deleteMany();
    await Assignment.deleteMany();
    await Expenditure.deleteMany();

    console.log('Existing data cleared');

    // Create Bases
    const base1 = await Base.create({
      name: 'Fort Alpha',
      location: 'Northern Region',
    });

    const base2 = await Base.create({
      name: 'Fort Bravo',
      location: 'Southern Region',
    });

    const base3 = await Base.create({
      name: 'Fort Charlie',
      location: 'Eastern Region',
    });

    console.log('Bases created');

    // Create Users
    const admin = await User.create({
      username: 'admin',
      email: 'admin@military.gov',
      password: 'admin123',
      role: 'admin',
    });

    const commander1 = await User.create({
      username: 'commander_alpha',
      email: 'commander.alpha@military.gov',
      password: 'password123',
      role: 'base_commander',
      assignedBase: base1._id,
    });

    const commander2 = await User.create({
      username: 'commander_bravo',
      email: 'commander.bravo@military.gov',
      password: 'password123',
      role: 'base_commander',
      assignedBase: base2._id,
    });

    const logistics = await User.create({
      username: 'logistics_officer',
      email: 'logistics@military.gov',
      password: 'password123',
      role: 'logistics_officer',
      assignedBase: base1._id,
    });

    // Update base commanders
    base1.commander = commander1._id;
    base2.commander = commander2._id;
    await base1.save();
    await base2.save();

    console.log('Users created');

    // Create Assets
    const asset1 = await Asset.create({
      name: 'M4 Carbine',
      type: 'weapon',
      baseId: base1._id,
      openingBalance: 100,
      currentBalance: 100,
    });

    const asset2 = await Asset.create({
      name: 'Humvee',
      type: 'vehicle',
      baseId: base1._id,
      openingBalance: 20,
      currentBalance: 20,
    });

    const asset3 = await Asset.create({
      name: '5.56mm Ammunition',
      type: 'ammunition',
      baseId: base1._id,
      openingBalance: 10000,
      currentBalance: 10000,
    });

    const asset4 = await Asset.create({
      name: 'M4 Carbine',
      type: 'weapon',
      baseId: base2._id,
      openingBalance: 80,
      currentBalance: 80,
    });

    const asset5 = await Asset.create({
      name: 'Radio Equipment',
      type: 'equipment',
      baseId: base2._id,
      openingBalance: 50,
      currentBalance: 50,
    });

    console.log('Assets created');

    // Create Sample Purchases
    await Purchase.create({
      assetId: asset1._id,
      baseId: base1._id,
      quantity: 50,
      purchaseDate: new Date('2025-01-05'),
      createdBy: logistics._id,
      notes: 'Quarterly procurement',
    });

    await Purchase.create({
      assetId: asset3._id,
      baseId: base1._id,
      quantity: 5000,
      purchaseDate: new Date('2025-01-08'),
      createdBy: logistics._id,
      notes: 'Training ammunition',
    });

    // Update asset balances
    asset1.currentBalance += 50;
    asset3.currentBalance += 5000;
    await asset1.save();
    await asset3.save();

    console.log('Purchases created');

    // Create Sample Transfer
    const transfer = await Transfer.create({
      assetId: asset1._id,
      fromBase: base1._id,
      toBase: base2._id,
      quantity: 20,
      transferDate: new Date('2025-01-09'),
      status: 'completed',
      initiatedBy: commander1._id,
      approvedBy: admin._id,
      notes: 'Equipment redistribution',
    });

    // Update balances for transfer
    asset1.currentBalance -= 20;
    await asset1.save();
    asset4.currentBalance += 20;
    await asset4.save();

    console.log('Transfers created');

    // Create Sample Assignment
    const assignment = await Assignment.create({
      assetId: asset1._id,
      baseId: base1._id,
      personnelName: 'Sgt. John Smith',
      personnelId: 'MIL-12345',
      quantity: 2,
      assignmentDate: new Date('2025-01-10'),
      status: 'active',
      assignedBy: commander1._id,
    });

    asset1.assigned += 2;
    await asset1.save();

    console.log('Assignments created');

    // Create Sample Expenditure
    await Expenditure.create({
      assetId: asset3._id,
      baseId: base1._id,
      quantity: 500,
      expenditureDate: new Date('2025-01-10'),
      reason: 'Training exercise',
      recordedBy: commander1._id,
    });

    asset3.currentBalance -= 500;
    asset3.expended += 500;
    await asset3.save();

    console.log('Expenditures created');

    console.log('\n=== SEED DATA CREATED SUCCESSFULLY ===');
    console.log('\nTest Credentials:');
    console.log('Admin: admin@military.gov / admin123');
    console.log(
      'Commander (Alpha): commander.alpha@military.gov / password123'
    );
    console.log(
      'Commander (Bravo): commander.bravo@military.gov / password123'
    );
    console.log('Logistics Officer: logistics@military.gov / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
