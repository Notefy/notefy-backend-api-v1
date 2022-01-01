const routeNotFound = (req, res) => res.status(404).send("Route doesnt exists");

module.exports = routeNotFound;
