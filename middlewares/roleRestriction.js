const roleRestriction = (...roles) => {
  return (req, res, next) => {
    console.log(req.userAuth);
    if (!req.userAuth || !roles.includes(req.userAuth.role)) {
      throw new Error("You do not have permission to perform this action !");
    }
    next();
  };
};

module.exports = roleRestriction;
