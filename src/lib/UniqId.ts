const chars = [
  ...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
];

const randomStr = (strLength: number) => {
  return [...Array(strLength)]
    .map(() => chars[Math.trunc(Math.random() * chars.length)])
    .join('');
};
export const uId = (options = { prefix: '' }) => {
  const now = String(Date.now());
  const middlePos = Math.ceil(now.length / 2);
  let output = `${now.substr(0, middlePos)}-${randomStr(6)}-${now.substr(
    middlePos,
  )}`;
  // We add a 3-letter CODE in front of the id to make it more recognizable
  if (options?.prefix) {
    output = `${options?.prefix}-${output}`;
  }
  return output;
};
