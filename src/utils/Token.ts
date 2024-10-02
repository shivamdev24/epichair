
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
  try {
    // Extract token from cookies
    const token = request.cookies.get("token")?.value || "";

    if (!token) {
      return { error: "Authentication token is required." };
    }

    // Verify the token
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);

    // Return the decoded user ID or other data as needed
    return decodedToken.id; // This should be an ID or user data
  } catch (error) {
    console.error("Error getting data from token:", error);
    return { error: "Invalid token" };
  }
};
