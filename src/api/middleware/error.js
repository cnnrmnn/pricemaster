export default function (err, req, res, next) {
    if (!err.statusCode) err.statusCode = 500;
    return res.status(err.statusCode).send({ error: err.toString() });
}
