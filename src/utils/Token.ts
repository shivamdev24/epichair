import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

type DecodedToken = {
  id: string; 
  iat?: number; 
  exp?: number; 
};

export const getDataFromToken = (
  request: NextRequest
): string | { error: string } => {
  try {
   
    const token = request.cookies.get("token")?.value || "";

    if (!token) {
      return { error: "Authentication token is required." };
    }

    
    const decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET!
    ) as DecodedToken;
console.log(token);
    
    return decodedToken.id; 
  } catch (error) {
    console.error("Error getting data from token:", error);
    return { error: "Invalid token" };
  }
};





