const express = require('express');
const protect = require('../middleware/authMiddleware');
const DailyLog = require('../models/DailyLog');
const ACTIONS = require('../data/actions');

const router = express.Router();

function getTodayIST() {
  const today = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  );
  today.setHours(0, 0, 0, 0);
  return today;
}

function calculateStreak(logs) {
  if (logs.length === 0) {
    return 0;
  }

  const logDates = new Set(
    logs.map((log) => {
      const date = new Date(log.date);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
  );

  let streak = 0;
  const checkDate = getTodayIST();

  while (logDates.has(checkDate.getTime())) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}

router.get('/actions', (req, res) => {
  return res.status(200).json(ACTIONS);
});

router.post('/', protect, async (req, res) => {
  try {
    const { actionId } = req.body;

    const action = ACTIONS.find((item) => item.id === actionId);
    if (!action) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const today = getTodayIST();

    const existingLog = await DailyLog.findOne({
      userId: req.userId,
      date: today,
    });

    if (existingLog) {
      return res.status(400).json({ message: 'You have already logged today' });
    }

    const { kwhSaved } = action;
    const rupeesSaved = kwhSaved * 6.5;
    const co2Saved = kwhSaved * 0.82;

    const log = await DailyLog.create({
      userId: req.userId,
      actionId: action.id,
      actionLabel: action.label,
      kwhSaved,
      rupeesSaved,
      co2Saved,
      date: today,
    });

    return res.status(201).json(log);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    const logs = await DailyLog.find({ userId: req.userId }).sort({ date: -1 });
    const streak = calculateStreak(logs);

    return res.status(200).json({ logs, streak });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
