import mongoose, { Schema } from "mongoose";

const fileSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
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

export const File = mongoose.model("File", fileSchema);
