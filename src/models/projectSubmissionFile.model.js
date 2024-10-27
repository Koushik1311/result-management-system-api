import mongoose, { Schema } from "mongoose";

const projectSubmissionFileSchema = new Schema(
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

export const ProjectSubmissionFile = mongoose.model(
  "ProjectSubmissionFile",
  projectSubmissionFileSchema
);
