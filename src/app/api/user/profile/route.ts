import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import db from "@/utils/db";
import jwt, { JwtPayload } from "jsonwebtoken";

db();

const verifyToken = (request: NextRequest) => {
  const authHeader = request.headers.get("Authorization");
  let token: string | null = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
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

    if (typeof decoded !== "string") {
      return decoded as JwtPayload; 
      throw new Error("Invalid token payload.");
    }
  } catch (error) {
    throw new Error("Invalid token.", { cause: error });
  }
};

// Retrieve user information by email
// export async function GET(request: NextRequest) {

//   const userId = verifyToken(request);

//   if (!userId) {
//     return NextResponse.json(
//       {
//         message: "Authorization Is Required",
//       },
//       { status: 401 }
//     );
//   }
//   if (userId) {
//     return NextResponse.json(
//       {
//         message: "Authorization Is Required", userId
//       },
//       { status: 401 }
//     );
//   }


//   const { searchParams } = request.nextUrl;
//   const email = searchParams.get({userId.email});

//   if (!email) {
//     return NextResponse.json(
//       { message: "Email is required." },
//       { status: 400 }
//     );
//   }

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return NextResponse.json({ message: "User not found." }, { status: 404 });
//     }

//     return NextResponse.json(
//       {
//         user: {
//           email: user.email,
//           name: user.username,
//           role: user.role,
//           isVerified: user.isVerified,
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error retrieving user:", error);
//     return NextResponse.json(
//       { message: "Error retrieving user", error },
//       { status: 500 }
//     );
//   }
// }


export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request);

    if (!decoded) {
      return NextResponse.json(
        {
          message: "Authorization is required",
        },
        { status: 401 }
      );
    }

    const email = decoded.email?.toLowerCase(); // Convert email to lowercase

    if (!email) {
      return NextResponse.json(
        { message: "Email is required.", email },
        { status: 400 }
      );
    }

    // Validate email address format
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return NextResponse.json(
        { message: "Invalid email address format." },
        { status: 400 }
      );
    }

    // Query the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: `User  with email ${email} not found.` , user},
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        user: {
          email: user.email,
          name: user.username,
         
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving user:", error);
    return NextResponse.json(
      {
        message: "Error retrieving user",
      },
      { status: 500 }
    );
  }
}



// Delete user account
export async function DELETE(request: NextRequest) {
  try {
    const userId = verifyToken(request);

    if (!userId) {
      return NextResponse.json(
        {
          message: "Authorization Is Required",
        },
        { status: 401 }
      );
    }

    const { searchParams } = request.nextUrl;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    const user = await User.findOneAndDelete({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User account deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Error deleting user", error },
      { status: 500 }
    );
  }
}



// export async function PUT(request: NextRequest) {
//   try {
//     const userId = verifyToken(request); 

//     if(!userId){
//       return NextResponse.json(
//         {
//           message: "Authorization Is Required",
//         },
//         { status: 401 }
//       );
//     }


//      const decoded = verifyToken(request);

//      if (!decoded) {
//        return NextResponse.json(
//          {
//            message: "Authorization is required",
//          },
//          { status: 401 }
//        );
//      }

//      const email = decoded.email?.toLowerCase(); // Convert email to lowercase

    

//      // Validate email address format
//      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
//        return NextResponse.json(
//          { message: "Invalid email address format." },
//          { status: 400 }
//        );
//      }

//     const { name, } = await request.json(); 

//     if (!email) {
//       return NextResponse.json(
//         { message: "Email is required." },
//         { status: 400 }
//       );
//     }

//     const user = await User.findById(userId); // Find the user by ID

//     if (!user) {
//       return NextResponse.json({ message: "User not found." }, { status: 404 });
//     }

//     user.username = name;

//     await user.save(); 

//     return NextResponse.json(
//       {
//         message: "User information updated successfully.",
//         user: {
//           name: user,
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error updating user:", error);
//     return NextResponse.json(
//       { message: "Error updating user",  error },
//       { status: 500 }
//     );
//   }
// }




export async function PUT(request: NextRequest) {
  try {
    const decoded = verifyToken(request);

    if (!decoded) {
      return NextResponse.json(
        {
          message: "Authorization is required",
        },
        { status: 401 }
      );
    }

    const userId = decoded.id; // Extract user ID from decoded token
    const email = decoded.email?.toLowerCase(); // Extract email from decoded token

    // Validate user ID and email
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return NextResponse.json(
        { message: "Invalid email address format." },
        { status: 400 }
      );
    }

    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { message: "Name is required." },
        { status: 400 }
      );
    }

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Update user information
    user.username = name;

    await user.save();

    return NextResponse.json(
      {
        message: "User information updated successfully.",
        user: {
          email: user.email,
          name: user.username,
          role: user.role,
          isVerified: user.isVerified,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Error updating user", error },
      { status: 500 }
    );
  }
}

