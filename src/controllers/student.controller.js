import axios from "axios";
import { Student } from "../models/student.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AttendanceFile } from "../models/attendanceFile.model.js";
import * as XLSX from "xlsx";
import { ProjectReviewFile } from "../models/projectReviewFile.model.js";
import { AssessmentFile } from "../models/assessmentFile.model.js";
import { ProjectSubmissionFile } from "../models/projectSubmissionFile.model.js";
import { LinkedinPostFile } from "../models/linkedinPostFile.model.js";

const getAllStudentResults = asyncHandler(async (req, res) => {
  const studentResults = await Student.find();

  return res
    .status(200)
    .json(
      new ApiResponse(200, studentResults, "Result retrieved successfully")
    );
});

const getStudentResultsByStudentId = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const studentResults = await Student.findOne({
    studentId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, studentResults, "Result found"));
});

// Attendance Marks
const saveAttendanceMarks = asyncHandler(async (req, res) => {
  const { fileId } = req.body;

  if (!fileId) {
    throw new ApiError(400, "id field is required");
  }

  const file = await AttendanceFile.findById(fileId);

  if (!file) {
    throw new ApiError(404, "File not found");
  }

  const response = await axios.get(file.fileUrl, {
    responseType: "arraybuffer",
  });
  const data = response.data;

  const workbook = XLSX.read(data, { type: "buffer" });
  const sheetNames = workbook.SheetNames;
  const sheet = workbook.Sheets[sheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(sheet);

  // Helper function to handle multiple attendance mark columns
  const extractAttendanceMarks = (entry) => {
    return Object.keys(entry)
      .filter((key) => key.startsWith("Attendance Marks"))
      .map((key) => entry[key])
      .filter((mark) => typeof mark === "number");
  };

  const savePromises = jsonData.map(async (entry) => {
    if (!entry["Student ID"]) {
      throw new Error("Student ID is mandatory");
    }

    // Extract attendance marks from the Excel entry
    const newAttendanceMarks = extractAttendanceMarks(entry);

    // Find student by Student ID
    let student = await Student.findOne({ studentId: entry["Student ID"] });

    if (student) {
      // Append the new marks to existing attendanceMarks
      student.attendanceMarks =
        student.attendanceMarks.concat(newAttendanceMarks);
      student.updatedAt = Date.now();
    } else {
      // If student doesn't exist, create a new student with attendanceMarks
      student = new Student({
        studentId: entry["Student ID"],
        name: entry["Student Name"],
        attendanceMarks: newAttendanceMarks,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    // Save or update the student
    await student.save();
  });

  const savedAttendenceMarks = await Promise.all(savePromises);
  await AttendanceFile.updateOne(
    { _id: fileId },
    { $set: { isExtracted: true } }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        savedAttendenceMarks,
        "Attendence marks saved successfully"
      )
    );
});

// Project Review Marks
const saveProjectReviewMarks = asyncHandler(async (req, res) => {
  const { fileId } = req.body;

  if (!fileId) {
    throw new ApiError(400, "fileId field is required");
  }

  const file = await ProjectReviewFile.findById(fileId);

  if (!file) {
    throw new ApiError(404, "File not found");
  }

  const response = await axios.get(file.fileUrl, {
    responseType: "arraybuffer",
  });
  const data = response.data;

  const workbook = XLSX.read(data, { type: "buffer" });
  const sheetNames = workbook.SheetNames;
  const sheet = workbook.Sheets[sheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(sheet);

  // Helper function to handle multiple project review mark columns
  const extractProjectReviewMarks = (entry) => {
    return Object.keys(entry)
      .filter((key) => key.startsWith("Project Review Marks"))
      .map((key) => entry[key])
      .filter((mark) => typeof mark === "number");
  };

  const savePromises = jsonData.map(async (entry) => {
    if (!entry["Student ID"]) {
      throw new Error("Student ID is mandatory");
    }

    // Extract project review marks from the Excel entry
    const newProjectReviewMarks = extractProjectReviewMarks(entry);

    // Find student by Student ID
    let student = await Student.findOne({ studentId: entry["Student ID"] });

    if (student) {
      // Append the new marks to existing projectReviewMarks
      student.projectReviewMarks = student.projectReviewMarks.concat(
        newProjectReviewMarks
      );
      student.updatedAt = Date.now();
    } else {
      // If student doesn't exist, create a new student with projectReviewMarks
      student = new Student({
        studentId: entry["Student ID"],
        name: entry["Student Name"],
        projectReviewMarks: newProjectReviewMarks,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    // Save or update the student
    await student.save();
  });

  const savedProjectReviewMarks = await Promise.all(savePromises);
  await ProjectReviewFile.updateOne(
    { _id: fileId },
    { $set: { isExtracted: true } }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        savedProjectReviewMarks,
        "Project review marks saved successfully"
      )
    );
});

// Assessment Marks
const saveAssessmentMarks = asyncHandler(async (req, res) => {
  const { fileId } = req.body;

  if (!fileId) {
    throw new ApiError(400, "fileId field is required");
  }

  const file = await AssessmentFile.findById(fileId);

  if (!file) {
    throw new ApiError(404, "File not found");
  }

  const response = await axios.get(file.fileUrl, {
    responseType: "arraybuffer",
  });
  const data = response.data;

  const workbook = XLSX.read(data, { type: "buffer" });
  const sheetNames = workbook.SheetNames;
  const sheet = workbook.Sheets[sheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(sheet);

  // Helper function to handle multiple assessment marks columns
  const extractAssessmentMarks = (entry) => {
    return Object.keys(entry)
      .filter((key) => key.startsWith("Assessment Marks"))
      .map((key) => entry[key])
      .filter((mark) => typeof mark === "number");
  };

  const savePromises = jsonData.map(async (entry) => {
    if (!entry["Student ID"]) {
      throw new Error("Student ID is mandatory");
    }

    // Extract assessment marks from the Excel entry
    const newAssessmentMarks = extractAssessmentMarks(entry);

    // Find student by Student ID
    let student = await Student.findOne({ studentId: entry["Student ID"] });

    if (student) {
      // Append the new marks to existing assessmentMarks
      student.assessmentMarks =
        student.assessmentMarks.concat(newAssessmentMarks);
      student.updatedAt = Date.now();
    } else {
      // If student doesn't exist, create a new student with assessmentMarks
      student = new Student({
        studentId: entry["Student ID"],
        name: entry["Student Name"],
        assessmentMarks: newAssessmentMarks,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    // Save or update the student
    await student.save();
  });

  const savedAssessmentMarks = await Promise.all(savePromises);
  await AssessmentFile.updateOne(
    { _id: fileId },
    { $set: { isExtracted: true } }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        savedAssessmentMarks,
        "Assessment marks saved successfully"
      )
    );
});

// Project Submission Marks
const saveProjectSubmissionMarks = asyncHandler(async (req, res) => {
  const { fileId } = req.body;

  if (!fileId) {
    throw new ApiError(400, "fileId field is required");
  }

  const file = await ProjectSubmissionFile.findById(fileId);

  if (!file) {
    throw new ApiError(404, "File not found");
  }

  const response = await axios.get(file.fileUrl, {
    responseType: "arraybuffer",
  });
  const data = response.data;

  const workbook = XLSX.read(data, { type: "buffer" });
  const sheetNames = workbook.SheetNames;
  const sheet = workbook.Sheets[sheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(sheet);

  // Helper function to handle multiple project submission marks columns
  const extractProjectSubmissionMarks = (entry) => {
    return Object.keys(entry)
      .filter((key) => key.startsWith("Project Submission Marks"))
      .map((key) => entry[key])
      .filter((mark) => typeof mark === "number");
  };

  const savePromises = jsonData.map(async (entry) => {
    if (!entry["Student ID"]) {
      throw new Error("Student ID is mandatory");
    }

    // Extract project submission marks from the Excel entry
    const newProjectSubmissionMarks = extractProjectSubmissionMarks(entry);

    // Find student by Student ID
    let student = await Student.findOne({ studentId: entry["Student ID"] });

    if (student) {
      // Append the new marks to existing projectSubmissionMarks
      student.projectSubmissionMarks = student.projectSubmissionMarks.concat(
        newProjectSubmissionMarks
      );
      student.updatedAt = Date.now();
    } else {
      // If student doesn't exist, create a new student with projectSubmissionMarks
      student = new Student({
        studentId: entry["Student ID"],
        name: entry["Student Name"],
        projectSubmissionMarks: newProjectSubmissionMarks,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    // Save or update the student
    await student.save();
  });

  const savedProjectSubmissionMarks = await Promise.all(savePromises);
  await ProjectSubmissionFile.updateOne(
    { _id: fileId },
    { $set: { isExtracted: true } }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        savedProjectSubmissionMarks,
        "Project submission marks saved successfully"
      )
    );
});

// LinkedIn Post Marks
const saveLinkedInPostMarks = asyncHandler(async (req, res) => {
  const { fileId } = req.body;

  if (!fileId) {
    throw new ApiError(400, "fileId field is required");
  }

  const file = await LinkedinPostFile.findById(fileId);

  if (!file) {
    throw new ApiError(404, "File not found");
  }

  const response = await axios.get(file.fileUrl, {
    responseType: "arraybuffer",
  });
  const data = response.data;

  const workbook = XLSX.read(data, { type: "buffer" });
  const sheetNames = workbook.SheetNames;
  const sheet = workbook.Sheets[sheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(sheet);

  // Helper function to handle multiple LinkedIn post marks columns
  const extractLinkedInPostMarks = (entry) => {
    return Object.keys(entry)
      .filter((key) => key.startsWith("LinkedIn Post Marks"))
      .map((key) => entry[key])
      .filter((mark) => typeof mark === "number");
  };

  const savePromises = jsonData.map(async (entry) => {
    if (!entry["Student ID"]) {
      throw new Error("Student ID is mandatory");
    }

    // Extract LinkedIn post marks from the Excel entry
    const newLinkedInPostMarks = extractLinkedInPostMarks(entry);

    // Find student by Student ID
    let student = await Student.findOne({ studentId: entry["Student ID"] });

    if (student) {
      // Append the new marks to existing linkedInPostMarks
      student.linkedInPostMarks =
        student.linkedInPostMarks.concat(newLinkedInPostMarks);
      student.updatedAt = Date.now();
    } else {
      // If student doesn't exist, create a new student with linkedInPostMarks
      student = new Student({
        studentId: entry["Student ID"],
        name: entry["Student Name"],
        linkedInPostMarks: newLinkedInPostMarks,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    // Save or update the student
    await student.save();
  });

  const savedLinkedInPostMarks = await Promise.all(savePromises);
  await LinkedinPostFile.updateOne(
    { _id: fileId },
    { $set: { isExtracted: true } }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        savedLinkedInPostMarks,
        "LinkedIn post marks saved successfully"
      )
    );
});

export {
  getAllStudentResults,
  getStudentResultsByStudentId,
  saveAttendanceMarks,
  saveProjectReviewMarks,
  saveAssessmentMarks,
  saveProjectSubmissionMarks,
  saveLinkedInPostMarks,
};
