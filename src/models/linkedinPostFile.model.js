import mongoose, { Schema } from "mongoose";

const linkedinPostFileSchema = new Schema(
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

export const LinkedinPostFile = mongoose.model(
  "LinkedinPostFile",
  linkedinPostFileSchema
);
