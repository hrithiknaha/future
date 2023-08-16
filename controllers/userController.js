const User = require("../models/User");

const userController = {
    getUserDetails: async (req, res, next) => {
        try {
            const { username } = req.params;

            const user = await User.findOne({ username }).populate("books").select("-password");

            if (!user)
                return res.status(200).json({
                    success: false,
                    status_message: "The resource you requested could not be found.",
                });

            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    },
};

module.exports = userController;
