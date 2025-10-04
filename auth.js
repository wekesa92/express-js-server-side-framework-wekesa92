const auth = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (apiKey === "mysecretkey123") {
    next(); // user is authenticated
  } else {
    res.status(401).json({ message: "Unauthorized: Invalid API Key" });
  }
};

export default auth;
 
