const express = require("express");
const router = express.Router();
const School = require("../entities/School.mongoModel.js");
const User = require("../entities/User.mongoModel.js"); // Assuming User model exists
const rbac = require("../../mws/__rbac.js");

const ResponseDispatcher = require("../response_dispatcher/responseDispatcher.manager.js");
const dispatcher = new ResponseDispatcher();

// List all schools (accessible by superadmins only)
router.get("/", rbac(["superadmin"]), async (req, res) => {
  try {
    const schools = await School.find().populate("admin_ids", "name email");
    return dispatcher.dispatch(res, {
      ok: true,
      code: 200,
      data: schools,
      message: "Schools retrieved successfully",
    });
  } 
  catch (error) {
    return dispatcher.dispatch(res, {
      ok: false,
      code: 500,
      message: "Internal server error",
      errors: [error.message],
    });
  }
});

// Create a new school (accessible by superadmins only)
router.post("/create", rbac(["superadmin"]), async (req, res) => {
  try {
    const { name, address, phone, admin_id, capacity, resources } = req.body;

    if (!name || !address || !phone || !capacity) {
      return dispatcher.dispatch(res, {
        ok: false,
        code: 400,
        message: "All fields are required (name, address, phone, capacity)",
      });
    }

    if(admin_id){
      // Validate the admin ID
      const adminExists = await User.findById(admin_id);
      if (!adminExists) {
        return dispatcher.dispatch(res, {
          ok: false,
          code: 404,
          message: "Admin user not found",
        });
      }
    }
    
    const school = new School({ name, address, phone, admin_id, capacity, resources });
    await school.save();

    return dispatcher.dispatch(res, {
      ok: true,
      code: 201,
      data: school,
      message: "School created successfully",
    });
  } 
  catch (error) {
    return dispatcher.dispatch(res, {
      ok: false,
      code: 500,
      message: "Internal server error",
      errors: [error.message],
    });
  }
});

// Get details of a specific school (accessible by authenticated users)
router.get("/:id", rbac(["superadmin", "schooladmin"]), async (req, res) => {
  try {
    const school = await School.findById(req.params.id).populate("admin_ids", "name email");

    if (!school) {
      return dispatcher.dispatch(res, {
        ok: false,
        code: 404,
        message: "School not found",
      });
    }

    return dispatcher.dispatch(res, {
      ok: true,
      code: 200,
      data: school,
      message: "School retrieved successfully",
    });
  } 
  catch (error) {
    return dispatcher.dispatch(res, {
      ok: false,
      code: 500,
      message: "Internal server error",
      errors: [error.message],
    });
  }
});

// Update school details (accessible by superadmins only)
router.put("/:id", rbac(["superadmin"]), async (req, res) => {
  try {
    const { name, address, phone, capacity, resources, new_admin_id } = req.body;

    const school = await School.findById(req.params.id);
    if (!school) {
      return dispatcher.dispatch(res, {
        ok: false,
        code: 404,
        message: "School not found",
      });
    }

    // Optional updates
    if (name) school.name = name;
    if (address) school.address = address;
    if (phone) school.phone = phone;
    if (capacity) school.capacity = capacity;
    if (resources) school.resources = resources;

    // Add a new admin ID if provided
    if (new_admin_id) {
      const adminExists = await User.findById(new_admin_id);
      if (!adminExists) {
        return dispatcher.dispatch(res, {
          ok: false,
          code: 404,
          message: "Admin user not found",
        });
      }

      // Check if the admin ID already exists in the array
      if (!school.admin_ids.includes(new_admin_id)) {
        school.admin_ids.push(new_admin_id);
      } else {
        return dispatcher.dispatch(res, {
          ok: false,
          code: 400,
          message: "Admin ID already exists in the school.",
        });
      }
    }

    await school.save();

    return dispatcher.dispatch(res, {
      ok: true,
      code: 200,
      data: school,
      message: "School updated successfully",
    });
  } 
  catch (error) {
    return dispatcher.dispatch(res, {
      ok: false,
      code: 500,
      message: "Internal server error",
      errors: [error.message],
    });
  }
});


// Delete a school (accessible by superadmins only)
router.delete("/:id", rbac(["superadmin"]), async (req, res) => {
  try {
    const school = await School.findById(req.params.id);

    if (!school) {
      return dispatcher.dispatch(res, {
        ok: false,
        code: 404,
        message: "School not found",
      });
    }

    await School.findByIdAndDelete(req.params.id);

    return dispatcher.dispatch(res, {
      ok: true,
      code: 200,
      message: "School deleted successfully",
    });
  } 
  catch (error) {
    return dispatcher.dispatch(res, {
      ok: false,
      code: 500,
      message: "Internal server error",
      errors: [error.message],
    });
  }
});

module.exports = router;
