import Verification from "../model/verification.model.js";
// Admin: get all organizer verifications
export const organizerverification = async (req, res) => {
  try {
    // Fetch all verification records from the database
    const verifications = await Verification.find();

    // Send response
    res.status(200).json({
      success: true,
      data: verifications,
      message: "Organizer verifications fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching verifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch organizer verifications",
      error: error.message,
    });
  }
};

export const createverify = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // expected: "approved" or "rejected"

  try {
    // Validate status
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'approved' or 'rejected'.",
      });
    }

    // Find the verification by ID and update status
    const verification = await Verification.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: "Verification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Verification ${status} successfully`,
      data: verification,
    });
  } catch (error) {
    console.error("Error updating verification:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
export const status = async (req, res) => {
  const { organizerId } = req.params; // organizer ID from the URL

  try {
    // Find verification by organizerId
    const verification = await Verification.findOne({ organizerId });

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: "Verification not found for this organizer",
      });
    }

    res.status(200).json({
      success: true,
      status: verification.status, // approved / rejected / pending
      data: verification, // full verification document (optional)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};