export const getReturnAmount = (ratio) => {
  return ratio.split(":")[1];
};

export const totalAmtToBePaid = (stakeAmount, returnAmount) => {
  return stakeAmount * returnAmount;
};

export const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
