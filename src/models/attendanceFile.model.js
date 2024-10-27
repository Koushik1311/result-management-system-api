import mongoose, { Schema } from "mongoose";

const attendanceFileSchema = new Schema(
  {
    fileUrl: {
      type: String,
      required: true,
    },
    isExtracted: {
      type: Boolean,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const AttendanceFile = mongoose.model(
  "AttendanceFile",
  attendanceFileSchema
);
