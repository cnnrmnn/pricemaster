import { BadRequestError } from '../../errors';

export default function (schema) {
    return function (req, res, next) {
        const { error } = schema.validate(req.body);
        if (error) next(new BadRequestError(error.details[0].message));
        next();
    };
}
