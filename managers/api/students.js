const express = require("express");
const { body, param } = require("express-validator");
const router = express.Router();
const {Student, School, Classroom} = require("../../libs/globalImports.js");

const rbac = require("../../mws/__rbac.js");
const handleValidationErrors = require("../../mws/__validationErrors.js");

const ResponseDispatcher = require("../response_dispatcher/ResponseDispatcher.manager.js");
const dispatcher = new ResponseDispatcher();

// List all students in a school
router.get(
  "/:school_id",
  rbac(["schooladmin", "superadmin"]),
  [param("school_id").isMongoId().withMessage("Invalid school ID")],
  handleValidationErrors,
  async (req, res) => {
    try {
      const students = await Student.find({ school_id: req.params.school_id });
      return dispatcher.dispatch(res, {
        ok: true,
        code: 200,
        data: students,
        message: "Students retrieved successfully",
      });
    } catch (error) {
      return dispatcher.dispatch(res, {
        ok: false,
        code: 500,
        message: "Internal server error",
        errors: [error.message],
      });
    }
  }
);

// Enroll a new student
router.post(
  "/:school_id",
  rbac(["schooladmin"]),
  [
    param("school_id").isMongoId().withMessage("Invalid school ID"),
    body("name").isString().isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("phone").isString().isLength({ min: 10, max: 10 }).withMessage("Phone must be a 10-digit number"),
    body("classroom_id").optional().isMongoId().withMessage("Invalid classroom ID"),
    body("enrollmentDate").optional().isISO8601().withMessage("Invalid enrollment date"),
    body("status").optional().isIn(["active", "inactive"]).withMessage("Status must be 'active' or 'inactive'"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, email, phone, classroom_id, enrollmentDate, status } = req.body;

      const school = await School.findById(req.params.school_id);
      if (!school) {
        return dispatcher.dispatch(res, {
          ok: false,
          code: 404,
          message: "School not found",
        });
      }

      if (classroom_id) {
        const classroom = await Classroom.findById(classroom_id);
        if (!classroom) {
          return dispatcher.dispatch(res, {
            ok: false,
            code: 404,
            message: "Classroom not found",
          });
        }
        if (classroom.school_id.toString() !== req.params.school_id) {
          return dispatcher.dispatch(res, {
            ok: false,
            code: 400,
            message: "Classroom does not belong to this school",
          });
        }
      }

      const student = new Student({
        name,
        email,
        phone,
        school_id: req.params.school_id,
        classroom_id: classroom_id || null,
        enrollmentDate: enrollmentDate || Date.now(),
        status: status || "active",
      });

      await student.save();

      return dispatcher.dispatch(res, {
        ok: true,
        code: 201,
        data: student,
        message: "Student enrolled successfully",
      });
    } catch (error) {
      if (error.code === 11000) {
        return dispatcher.dispatch(res, {
          ok: false,
          code: 400,
          message: "Email already exists",
        });
      }

      return dispatcher.dispatch(res, {
        ok: false,
        code: 500,
        message: "Internal server error",
        errors: [error.message],
      });
    }
  }
);

// Get details of a specific student
router.get(
  "/details/:id",
  rbac(["schooladmin", "superadmin"]),
  [param("id").isMongoId().withMessage("Invalid student ID")],
  handleValidationErrors,
  async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      if (!student) {
        return dispatcher.dispatch(res, {
          ok: false,
          code: 404,
          message: "Student not found",
        });
      }
      return dispatcher.dispatch(res, {
        ok: true,
        code: 200,
        data: student,
        message: "Student retrieved successfully",
      });
    } catch (error) {
      return dispatcher.dispatch(res, {
        ok: false,
        code: 500,
        message: "Internal server error",
        errors: [error.message],
      });
    }
  }
);

// Update student profile
router.put(
  "/:id",
  rbac(["schooladmin"]),
  [
    param("id").isMongoId().withMessage("Invalid student ID"),
    body("name").optional().isString().isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
    body("email").optional().isEmail().withMessage("Invalid email address"),
    body("phone").optional().isString().isLength({ min: 10, max: 10 }).withMessage("Phone must be a 10-digit number"),
    body("classroom_id").optional().isMongoId().withMessage("Invalid classroom ID"),
    body("enrollmentDate").optional().isISO8601().withMessage("Invalid enrollment date"),
    body("status").optional().isIn(["active", "inactive"]).withMessage("Status must be 'active' or 'inactive'"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      if (!student) {
        return dispatcher.dispatch(res, {
          ok: false,
          code: 404,
          message: "Student not found",
        });
      }

      const { name, email, phone, classroom_id, enrollmentDate, status } = req.body;

      if (classroom_id) {
        const classroom = await Classroom.findById(classroom_id);
        if (!classroom) {
          return dispatcher.dispatch(res, {
            ok: false,
            code: 404,
            message: "Classroom not found",
          });
        }
        if (classroom.school_id.toString() !== student.school_id.toString()) {
          return dispatcher.dispatch(res, {
            ok: false,
            code: 400,
            message: "Classroom does not belong to the same school as the student",
          });
        }
      }

      student.name = name || student.name;
      student.email = email || student.email;
      student.phone = phone || student.phone;
      student.classroom_id = classroom_id || student.classroom_id;
      student.enrollmentDate = enrollmentDate || student.enrollmentDate;
      student.status = status || student.status;

      await student.save();

      return dispatcher.dispatch(res, {
        ok: true,
        code: 200,
        data: student,
        message: "Student profile updated successfully",
      });
    } catch (error) {
      if (error.code === 11000) {
        return dispatcher.dispatch(res, {
          ok: false,
          code: 400,
          message: "Email already exists",
        });
      }
      return dispatcher.dispatch(res, {
        ok: false,
        code: 500,
        message: "Internal server error",
        errors: [error.message],
      });
    }
  }
);

// Mark a student as inactive
router.delete(
  "/:id",
  rbac(["schooladmin"]),
  [param("id").isMongoId().withMessage("Invalid student ID")],
  handleValidationErrors,
  async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      if (!student) {
        return dispatcher.dispatch(res, {
          ok: false,
          code: 404,
          message: "Student not found",
        });
      }
      student.status = "inactive";
      await student.save();

      return dispatcher.dispatch(res, {
        ok: true,
        code: 200,
        message: "Student marked as inactive",
      });
    } catch (error) {
      return dispatcher.dispatch(res, {
        ok: false,
        code: 500,
        message: "Internal server error",
        errors: [error.message],
      });
    }
  }
);

module.exports = router;
