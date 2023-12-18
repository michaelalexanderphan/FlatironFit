export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  return password.length >= 6;
};


export const validateYouTubeUrl = (url) => {
  const regExp = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
  return regExp.test(url);
};
