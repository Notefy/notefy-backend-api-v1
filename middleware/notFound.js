const notFound = (rq, res) => res.status(404).send("Route doesnt exists");

module.exports = notFound;
