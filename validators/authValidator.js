export const validateEmail = (email) => {
  if (!email) {
    throw new ApiError({
      message: "No Email Provided",
      statusCode: 400,
      errorCode: "INVALID_EMAIL",
    });
  }
  if (!/^[\x00-\x7F]+$/.test(email)) {
    throw new ApiError({
      message: "Email contains invalid characters",
      statusCode: 400,
      errorCode: "INVALID_EMAIL",
    });
  }
};
