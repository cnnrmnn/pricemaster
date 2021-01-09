import mongoose from "mongoose";

export default function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send({
            error: `${req.params.id} is not a valid ID`
        });
    next();
}
