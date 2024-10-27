import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.routes.js";
// import fileRouter from "./routes/file.routes.js";
import assessmentFileRouter from "./routes/assessmentFile.routes.js";
import AttendenceFileRouter from "./routes/attendanceFile.routes.js";
import LinkedinFileRouter from "./routes/linkedinPostFile.routes.js";
import projectReviewFileRouter from "./routes/projectReviewFile.routes.js";
import projectSubmissionFileRouter from "./routes/projectSubmissionFile.routes.js";
import resultRouter from "./routes/result.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);
// app.use("/api/v1/files", fileRouter);
app.use("/api/v1/assessment-files", assessmentFileRouter);
app.use("/api/v1/attendence-files", AttendenceFileRouter);
app.use("/api/v1/linkedin-files", LinkedinFileRouter);
app.use("/api/v1/project-review-files", projectReviewFileRouter);
app.use("/api/v1/project-submission-files", projectSubmissionFileRouter);
app.use("/api/v1/results", resultRouter);

export { app };
