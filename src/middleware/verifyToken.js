import jwt from "jsonwebtoken";

export default async function verifyToken(req, res, next){
  const headers = req.headers;
  const token = headers.Authorization || headers.authorization;

  if (token) {
    if (token.startsWith("Barrer ")) {
      const authToken = token.split(" ")[1];
      jwt.verify(authToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          res.status(403).json("Invalid Token");
        } else {
          req.user = user;
          next();
        }
      });
    } else {
      return res.status(401).json("You are not authenticated");
    }
  } else {
    return res.status(401).json("You are not authenticated");
  }
};

