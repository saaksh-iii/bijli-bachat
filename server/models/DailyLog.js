const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  actionId: String,
  actionLabel: String,
  kwhSaved: Number,
  rupeesSaved: Number,
  co2Saved: Number,
  date: {
    type: Date,
    default: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
    },
  },
});

dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyLog', dailyLogSchema);
