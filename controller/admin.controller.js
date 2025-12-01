import Verification from "../model/verification.model.js";
import Organizer from "../model/organizer.model.js";  // needed so mongoose registers model

export const organizerverification = async (req, res) => {
  try {
    const verifications = await Verification
      .find()
      .populate("organizer");

    res.status(200).json({
      success: true,
      data: verifications,
    });
  } catch (error) {
    console.error("Error fetching verifications:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



export const createverify = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "approved" | "rejected"

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updatedVerification = await verification.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedVerification) {
      return res.status(404).json({
        success: false,
        message: "Verification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Verification ${status} successfully`,
      data: updatedVerification,
    });
  } catch (error) {
    console.error("Error updating verification:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};