import { v4 as uuidv4 } from "uuid";
export const createTokenHistory = (): string => {
  return uuidv4();
};
