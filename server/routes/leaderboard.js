const express = require('express');
const DailyLog = require('../models/DailyLog');

const router = express.Router();

function getCurrentMonthRangeIST() {
  const now = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  );
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);

  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  startOfNextMonth.setHours(0, 0, 0, 0);

  return { startOfMonth, startOfNextMonth };
}

router.get('/', async (req, res) => {
  try {
    const { startOfMonth, startOfNextMonth } = getCurrentMonthRangeIST();

    const results = await DailyLog.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lt: startOfNextMonth },
        },
      },
      {
        $group: {
          _id: '$userId',
          totalKwh: { $sum: '$kwhSaved' },
          totalRupees: { $sum: '$rupeesSaved' },
          totalCo2: { $sum: '$co2Saved' },
        },
      },
      { $sort: { totalKwh: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          name: '$user.name',
          college: '$user.college',
          locality: '$user.locality',
          totalKwh: 1,
          totalRupees: 1,
          totalCo2: 1,
        },
      },
    ]);

    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/map', async (req, res) => {
  try {
    const results = await DailyLog.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $group: {
          _id: '$user.locality',
          totalKwh: { $sum: '$kwhSaved' },
          totalCo2: { $sum: '$co2Saved' },
          users: { $addToSet: '$userId' },
        },
      },
      {
        $project: {
          _id: 0,
          locality: '$_id',
          totalKwh: 1,
          totalCo2: 1,
          userCount: { $size: '$users' },
        },
      },
    ]);

    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
