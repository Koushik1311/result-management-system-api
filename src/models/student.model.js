import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema({
    studentId: { 
      type: String, 
      required: true,
      trim: true,
      index: true,
      unique: true 
    },
    name: { 
      type: String, 
      required: true 
    },
    
    attendanceMarks: [{
      type: Number,
      default: 0
    }],
    projectReviewMarks: [{
      type: Number,
      default: 0
    }],
    assessmentMarks: [{
      type: Number,
      default: 0
    }],
    projectSubmissionMarks: [{
      type: Number,
      default: 0
    }],
    linkedInPostMarks: [{
      type: Number,
      default: 0
    }],
    totalMarks: { 
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  });

  studentSchema.pre('save', function(next) {
    
    this.totalMarks = 
      this.attendanceMarks.reduce((sum, mark) => sum + mark, 0) +
      this.projectReviewMarks.reduce((sum, mark) => sum + mark, 0) +
      this.assessmentMarks.reduce((sum, mark) => sum + mark, 0) +
      this.projectSubmissionMarks.reduce((sum, mark) => sum + mark, 0) +
      this.linkedInPostMarks.reduce((sum, mark) => sum + mark, 0);
    next();
  });
  
  export const Student = mongoose.model('Student', studentSchema);