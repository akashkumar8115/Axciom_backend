const Notification = require('../models/Notification');
const User = require('../models/User');
const nodemailer = require('nodemailer');

exports.sendNotification = async (req, res) => {
    try {
        const { userId, type, message } = req.body;
        const notification = new Notification({
            user: userId,
            type,
            message
        });

        const user = await User.findById(userId);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: `Library Notification - ${type}`,
            text: message
        });

        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
