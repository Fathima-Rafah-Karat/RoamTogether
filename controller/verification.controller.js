import verification from "../model/verification.model.js";

export const Verification = async (req, res) => {
  try {
    const organizerId = req.user?._id; 

    if (!organizerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Organizer not found",
      });
    }
        const existing = await verification.findOne({ organizer: organizerId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted verification",
        status: existing.status,
      });
    }

    const { govtIdType } = req.body;

    const photo = req.files?.photo?.[0]?.path || null;
    const govtIdPhoto = req.files?.govtIdPhoto?.[0]?.path || null;

    // Validate fields
    if (!govtIdType || !photo || !govtIdPhoto) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const verificate = await verification.create({
      organizer: organizerId,
      photo,
      govtIdType,
      govtIdPhoto,
      status:"pending"
    });

    res.status(200).json({
      success: true,
      message: "Verification submitted successfully",
      data: verificate,
    });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const viewVerification = async (req, res, next) => {
  try {
    // Fetch all verifications and include organizer ID
    const verifications = await verification.find().select("organizer photo govtIdType govtIdPhoto status");

    res.status(200).json({
      success: true,
      data: verifications,
    });
  } catch (error) {
    next(error);
  }
};

export const status = async (req, res) => {
  const { organizerId } = req.params;

  try {
    // Find verification by organizerId
    const verifications = await verification.findOne({ organizer: organizerId });

    if (!verifications) {
      return res.status(404).json({
        success: false,
        message: "Verification not found for this organizer",
      });
    }

    res.status(200).json({
      success: true,
      status: verifications.status,  // approved / rejected / pending
      data: verifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

























// export const Verification = async (req, res) => {
//   try {
//     const organizerId = req.user?._id;

//     if (!organizerId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized: Organizer not found",
//       });
//     }

//     const { govtIdType } = req.body;

//     const photo = req.files?.photo?.[0]?.path || null;
//     const govtIdPhoto = req.files?.govtIdPhoto?.[0]?.path || null;

//     if (!govtIdType || !photo || !govtIdPhoto) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     // Check existing verification
//     const existing = await verification.findOne({ organizer: organizerId });

//     // Allow resubmit ONLY if rejected
//     if (existing) {
//       if (existing.status === "pending") {
//         return res.status(400).json({
//           success: false,
//           message: "Your verification is under review",
//           status: "pending",
//         });
//       }

//       if (existing.status === "approved") {
//         return res.status(400).json({
//           success: false,
//           message: "Your verification is already approved",
//           status: "approved",
//         });
//       }

//       // If rejected → allow resubmit (update instead of create)
//       if (existing.status === "rejected") {
//         existing.photo = photo;
//         existing.govtIdType = govtIdType;
//         existing.govtIdPhoto = govtIdPhoto;
//         existing.status = "pending";
//         await existing.save();

//         return res.status(200).json({
//           success: true,
//           message: "Verification resubmitted successfully",
//           data: existing,
//         });
//       }
//     }

//     // Fresh submission
//     const verificate = await verification.create({
//       organizer: organizerId,
//       photo,
//       govtIdType,
//       govtIdPhoto,
//       status: "pending",
//     });

//     res.status(200).json({
//       success: true,
//       message: "Verification submitted successfully",
//       data: verificate,
//     });
//   } catch (error) {
//     console.error("Verification Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };
