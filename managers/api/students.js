const express = require("express");
const router = express.Router();
const Student = require("../entities/Student.mongoModel.js");
const School = require("../entities/School.mongoModel.js");
const Classroom = require("../entities/Classroom.mongoModel.js");
const rbac = require("../../mws/__rbac.js");

const ResponseDispatcher = require("../response_dispatcher/responseDispatcher.manager.js");
const dispatcher = new ResponseDispatcher();

// List all students in a school (Accessible by school admins and super admins)
router.get("/:school_id", rbac(["schooladmin", "superadmin"]), async (req, res) => {
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

// Enroll a new student (Accessible by school admins)
router.post("/:school_id", rbac(["schooladmin"]), async (req, res) => {
  try {
    const { name, email, phone, classroom_id, enrollmentDate, status } = req.body;

    // Check if the school exists
    const school = await School.findById(req.params.school_id);
    if (!school) {
      return dispatcher.dispatch(res, {
        ok: false,
        code: 404,
        message: "School not found",
      });
    }

    // Check if the classroom exists and belongs to the specified school
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

    // Create and save the student
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
      // Handle unique constraint error (duplicate email)
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
});

// Get details of a specific student (Accessible by school admins and super admins)
router.get("/details/:id", rbac(["schooladmin", "superadmin"]), async (req, res) => {
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

// Update student profile (Accessible by school admins)
router.put("/:id", rbac(["schooladmin"]), async (req, res) => {
  try {
    const { name, email, phone, classroom_id, enrollmentDate, status } = req.body;

    // Find the student by ID
    const student = await Student.findById(req.params.id);
    if (!student) {
      return dispatcher.dispatch(res, {
        ok: false,
        code: 404,
        message: "Student not found",
      });
    }

    // Validate classroom if provided
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

    // Update student fields
    student.name = name || student.name;
    student.email = email || student.email;
    student.phone = phone || student.phone;
    student.classroom_id = classroom_id || student.classroom_id;
    if(enrollmentDate) student.enrollmentDate = enrollmentDate || student.enrollmentDate;
    if(status) student.status = status || student.status;

    await student.save();

    return dispatcher.dispatch(res, {
      ok: true,
      code: 200,
      data: student,
      message: "Student profile updated successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      // Handle unique constraint error (duplicate email)
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
});

// Mark a student as inactive (Accessible by school admins)
router.delete("/:id", rbac(["schooladmin"]), async (req, res) => {
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
