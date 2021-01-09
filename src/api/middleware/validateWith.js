export default function (schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error)
            return res.status(400).send({
                error: error.details[0].message
            });
        next();
    };
}
