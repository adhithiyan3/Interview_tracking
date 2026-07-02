module.exports = function (req, res, next) {
  // Bypassed for personal single-user mode
  req.user = { id: '000000000000000000000001' };
  next();
};
