const express = require("express");
const router = express.Router();
const Classroom = require("../entities/Classroom.mongoModel.js");
const School = require("../entities/School.mongoModel.js");
const rbac = require("../../mws/__rbac.js");

const ResponseDispatcher = require("../response_dispatcher/responseDispatcher.manager.js");
const dispatcher = new ResponseDispatcher();

// List all classrooms in a school (school-admins)
router.get("/:school_id", rbac(["schooladmin", "superadmin"]), async (req, res) => {
  try {
    const classrooms = await Classroom.find({ school_id: req.params.school_id });
    return dispatcher.dispatch(res, {
      ok: true,
      code: 200,
      data: classrooms,
      message: "Classrooms retrieved successfully",
    });
  } catch (error) {
    return dispatcher.dispatch(res, {
      ok: false,
      code: 500,
      message: "Internal server error",
      errors: [error.message],
    });
  }
});

// Add a new classroom (schooladmins & superadmins)
router.post("/:school_id", rbac(["schooladmin", "superadmin"]), async (req, res) => {
    try {
      const { name, capacity, resources } = req.body;
      const school = await School.findById(req.params.school_id);
  
      if (!school) {
        return dispatcher.dispatch(res, {
          ok: false,
          code: 404,
          message: "School not found",
        });
      }
  
      if (!name || !capacity) {
        return dispatcher.dispatch(res, {
          ok: false,
          code: 400,
          message: "Classroom name and capacity are required",
        });
      }
  
      // Check if classroom name already exists in the school
      const existingClassroom = await Classroom.findOne({
        name,
        school_id: req.params.school_id,
      });
  
      if (existingClassroom) {
        return dispatcher.dispatch(res, {
          ok: false,
          code: 409, // Conflict
          message: "A classroom with the same name already exists in this school",
        });
      }
  
      const classroom = new Classroom({
        name,
        school_id: req.params.school_id,
        capacity,
        resources: resources || [],
      });
      await classroom.save();
  
      return dispatcher.dispatch(res, {
        ok: true,
        code: 201,
        data: classroom,
        message: "Classroom created successfully",
      });
    } catch (error) {
      return dispatcher.dispatch(res, {
        ok: false,
        code: 500,
        message: "Internal server error",
        errors: [error.message],
      });
    }
});

// Get details of a specific classroom
router.get("/:id/details", rbac(["schooladmin", "superadmin"]), async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      return dispatcher.dispatch(res, {
        ok: false,
        code: 404,
        message: "Classroom not found",
      });
    }

    return dispatcher.dispatch(res, {
      ok: true,
      code: 200,
      data: classroom,
      message: "Classroom retrieved successfully",
    });
  } catch (error) {
    return dispatcher.dispatch(res, {
      ok: false,
      code: 500,
      message: "Internal server error",
      errors: [error.message],
    });
  }
});

// Update classroom details (schooladmins)
router.put("/:id/update", rbac(["schooladmin", "superadmin"]), async (req, res) => {
  try {
    const { name, capacity, resources } = req.body;

    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
      return dispatcher.dispatch(res, {
        ok: false,
        code: 404,
        message: "Classroom not found",
      });
    }

    classroom.name = name || classroom.name;
    classroom.capacity = capacity || classroom.capacity;
    
    if (resources && Array.isArray(resources)) {
        const uniqueResources = [...new Set([...classroom.resources, ...resources])];
        classroom.resources = uniqueResources;
    }  

    await classroom.save();

    return dispatcher.dispatch(res, {
      ok: true,
      code: 200,
      data: classroom,
      message: "Classroom updated successfully",
    });
  } catch (error) {
    return dispatcher.dispatch(res, {
      ok: false,
      code: 500,
      message: "Internal server error",
      errors: [error.message],
    });
  }
});

// Remove a classroom (schooladmins)
router.delete("/:id", rbac(["schooladmin", "superadmin"]), async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      return dispatcher.dispatch(res, {
        ok: false,
        code: 404,
        message: "Classroom not found",
      });
    }

    await Classroom.findByIdAndDelete(req.params.id);
    return dispatcher.dispatch(res, {
      ok: true,
      code: 200,
      message: "Classroom deleted successfully",
    });
  } catch (error) {
    return dispatcher.dispatch(res, {
      ok: false,
      code: 500,
      message: "Internal server error",
      errors: [error.message],
    });
  }
});

module.exports = router;
