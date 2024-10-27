import mongoose, { Schema } from "mongoose";

const assessmentFileSchema = new Schema(
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

export const AssessmentFile = mongoose.model(
  "AssessmentFile",
  assessmentFileSchema
);
