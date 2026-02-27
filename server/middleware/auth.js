const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'लगइन आवश्यक छ'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'stn-secret-key');
    req.user = decoded;
    next();

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'अवैध टोकन'
    });
  }
};