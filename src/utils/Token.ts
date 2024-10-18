// import jwt, { JwtPayload } from "jsonwebtoken";
// import { NextRequest, NextResponse } from "next/server";

// export const verifyToken = (request: NextRequest) => {
  
//   const authHeader = request.headers.get("Authorization");
//   let token: string | null = null;
//   if (!authHeader) {
//     throw new Error("Authorization token is required.");
//   }

//   // Check Authorization header first
//   if (authHeader && authHeader.startsWith("Bearer ")) {
//     token = authHeader.split(" ")[1];
//   } else {
//     token = request.cookies.get("token")?.value || null;
//   }
  
 

//   if (!token) {
//     console.warn("No authorization token found.");
//     return null;
//   }

//   try {
//     // Verify the token and decode it
//     const decoded = jwt.verify(
//       token,
//       process.env.TOKEN_SECRET || "default_secret_key"
//     ) as JwtPayload;

//     // Check if the decoded token contains an ID
//     if (decoded && decoded.id) {
//       return decoded as JwtPayload;
//     } else {
//       throw new Error("Invalid token payload.");
//     }
//   } catch (error) {
//     console.error("Token verification error:", { cause: error });

//     // If the token is expired or invalid, clear the cookie
//     if ((error as Error).name === "TokenExpiredError") {
//       // Set the token cookie to empty to clear it
//       return NextResponse.json(
//         {
//           message: "token error",
//         },
//         {
//           status: 401,
//           headers: {
//             "Set-Cookie": "token=; Max-Age=0; HttpOnly; Secure; SameSite=Lax",
//           },
//         }
//       );
//     }

//     return null;
//   }
// };



import jwt, { JwtPayload, JsonWebTokenError } from "jsonwebtoken";
import { NextRequest } from "next/server";

export const verifyToken = (request: NextRequest): JwtPayload => {
  const authHeader = request.headers.get("Authorization");
  let token: string | null = null;

  // Extract token from Authorization header or cookies
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    token = request.cookies.get("token")?.value || null;
  }

  if (!token) {
    throw new Error("Authorization token is required.");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.TOKEN_SECRET || "default_secret_key"
    );

    // Ensure the decoded token is of the expected type
    if (typeof decoded === "object" && decoded !== null) {
      return decoded as JwtPayload;
    } else {
      throw new Error("Invalid token payload.");
    }
  } catch (error) {
    // Handle specific JWT errors
    if (error instanceof JsonWebTokenError) {
      throw new Error("Invalid token: " + error.message);
    }

    throw new Error("Token verification failed: " + error);
  }
};
