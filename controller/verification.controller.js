import VerificationModel from "../model/verification.model.js";

// Submit verification
export const Verification = async (req, res, next) => {
  try {
    const organizerId = req.user?._id; // get organizer ID from logged-in user
    if (!organizerId) {
      return res.status(401).json({ success: false, message: "Organizer ID is missing. Please login." });
    }

    const { govtIdType } = req.body;

    const photo = req.files?.photo ? req.files.photo[0].path : null;
    const govtIdPhoto = req.files?.govtIdPhoto ? req.files.govtIdPhoto[0].path : null;

    if (!govtIdType || !photo || !govtIdPhoto) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const verification = await VerificationModel.create({
      organizer: organizerId,
      govtIdType,
      photo,
      govtIdPhoto,
      status: "pending",
    });

    res.status(200).json({
      success: true,
      message: "Verification submitted successfully",
      data: verification,
    });
  } catch (error) {
    next(error);
  }
};

// View verification for logged-in organizer
export const viewVerification = async (req, res, next) => {
  try {
    const organizerId = req.user?._id;
    if (!organizerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const verifications = await VerificationModel.find({ organizer: organizerId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: verifications.length,
      data: verifications,
    });
  } catch (error) {
    next(error);
  }
};
