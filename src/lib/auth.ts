import { NextRequest } from "next/server";
import { verifyToken } from "./jwt";

export const getUserIdFromReq = (req: NextRequest): string => {
  let token = req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    const cookie = req.headers.get("cookie");
    token = cookie
      ?.split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];
  }

  if (!token) throw new Error("Authorization header missing");

  return verifyToken(token);
};
