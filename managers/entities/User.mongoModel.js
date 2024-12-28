const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["superadmin", "school-admin"],
      required: true,
    },
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      validate: {
        validator: function (value) {
          // Only validate `school_id` if the role is "school-admin"
          return this.role === "school-admin" ? !!value : true;
        },
        message: "school_id is required for school-admin users.",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
