const mongoose = require("mongoose");

const tokenBlacklistSchema = mongoose.Schema({
  token: {
    type: String,
    required: [true, "Token is required"],
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "User reference is required"],
  },
  blacklistedAt: {
    type: Date,
    default: Date.now,
    expires: "1d",
  },
});

tokenBlacklistSchema.index({ token: 1 }, { unique: true });
tokenBlacklistSchema.index({ blacklistedAt: 1 }, { expireAfterSeconds: 86400 });

const tokenBlacklistModel = mongoose.models.tokenBlacklist || mongoose.model(
  "tokenBlacklist",
  tokenBlacklistSchema
);

module.exports = tokenBlacklistModel;
