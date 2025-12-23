import Message from "../model/message.model.js";

/* =========================
   SAVE MESSAGE (API)
========================= */
export const saveMessage = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Message text is required",
      });
    }

    // Sender comes from auth middleware
    const sender = req.user.name || req.user.email;

    const message = await Message.create({
      tripId,
      sender,
      text,
    });

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET MESSAGES BY TRIP
========================= */
export const getMessagesByTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    const messages = await Message.find({ tripId }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};