const isAuthorizedUser = (context) => {
  if (!context.jwtUser) {
    throw new Error('User is unauthorized');
  }
};

export default isAuthorizedUser;
