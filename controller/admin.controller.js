import Verification from "../model/verification.model.js";
import Auth from "../model/auth.model.js";
import organizer from "../model/organizer.model.js";
import verification from "../model/verification.model.js";

export const organizerverification = async (req, res) => {
  try {
    const verifications = await Verification.find()
      .populate({
        path: "organizer",   // auth user ID stored here
        select: "username email phone role", 
      });

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
export const count = async (req, res) => {
  try {
    // Total Travelers
    const totalTravelers = await Auth.countDocuments({ role: "Traveler" });

    // Total Verified Organizers
    const verifiedOrganizers = await Verification.countDocuments({ status: "approved" });

    // Total Trips
    const totalTrips = await organizer.countDocuments();

    // Pending Verification (Organizers)
    const pendingVerification = await Verification.countDocuments({ status: "pending" });

    res.status(200).json({
      success: true,
      data: {
        totalTravelers,
        verifiedOrganizers,
        totalTrips,
        pendingVerification
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const monthlyGrowth = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    let growthData = [];

    for (let month = 0; month < 12; month++) {
      // Start & end of the month
      const start = new Date(currentYear, month, 1);
      const end = new Date(currentYear, month + 1, 1);

      // Count registered travelers per month
      const users = await Auth.countDocuments({
        role: "Traveler",
        createdAt: { $gte: start, $lt: end }
      });

      // Count trips created per month
      const trips = await organizer.countDocuments({
        createdAt: { $gte: start, $lt: end }
      });

      growthData.push({
        month: start.toLocaleString("en-US", { month: "short" }),
        users,
        trips
      });
    }

    res.status(200).json({
      success: true,
      data: growthData
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const getVerificationStats = async (req, res) => {
  try {
    const approved = await verification.countDocuments({ status: "approved" });
    const pending = await verification.countDocuments({ status: "pending" });
    const rejected = await verification.countDocuments({ status: "rejected" });

    return res.status(200).json({
      success: true,
      data: {
        approved,
        pending,
        rejected
      }
    });
  } catch (error) {
    console.error("Verification stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching verification stats",
      error: error.message
    });
  }
};