const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    admin_ids: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    capacity: {
      type: Number,
      required: true,
    },
    resources: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("School", schoolSchema);
