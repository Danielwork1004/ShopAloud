export const safelyParse = (str: string) => {
  let data = null;
  try {
    data = JSON.parse(str);
  } catch (error) {
    return null;
  }
  return data;
};
