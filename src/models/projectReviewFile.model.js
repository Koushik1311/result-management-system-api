import mongoose, { Schema } from "mongoose";

const projectReviewFileSchema = new Schema(
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

export const ProjectReviewFile = mongoose.model(
  "ProjectReviewFile",
  projectReviewFileSchema
);
