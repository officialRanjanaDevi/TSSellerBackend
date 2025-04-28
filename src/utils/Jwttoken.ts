//Create Token and saving in cookie

export const sendToken = (seller, statusCode, res) => {
  const token = seller.getJWTToken();

  res.status(statusCode).json({
    success: true,
    seller,
    token,
  });
};
