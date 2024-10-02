import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

type DecodedToken = {
  id: string; // Customize based on the shape of your token's payload
  iat?: number; // Issued At (automatically added by jwt)
  exp?: number; // Expiration (automatically added by jwt)
};

export const getDataFromToken = (
  request: NextRequest
): string | { error: string } => {
  try {
    // Extract token from cookies
    const token = request.cookies.get("token")?.value || "";

    if (!token) {
      return { error: "Authentication token is required." };
    }

    // Verify the token
    const decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET!
    ) as DecodedToken;

    // Return the decoded user ID or other data as needed
    return decodedToken.id; // Adjust based on your payload structure
  } catch (error) {
    console.error("Error getting data from token:", error);
    return { error: "Invalid token" };
  }
};
