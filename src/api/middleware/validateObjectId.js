import mongoose from 'mongoose';
import { BadRequestError } from '../../errors';

export default function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        next(new BadRequestError(`${req.params.id} is not a valid ID`));
    next();
}
