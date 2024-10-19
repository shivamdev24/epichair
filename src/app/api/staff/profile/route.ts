import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import db from "@/utils/db";
import { verifyToken } from "@/utils/Token";
import { DeleteImage, UploadImage } from "@/lib/upload-Image";

db();





export async function GET(request: NextRequest) {
  try {

      const decoded = verifyToken(request);
      // const decoded = TokenPayLoad.id;

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
        { message: `User  with email ${email} not found.`, user },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        // user: {
        //   id: user._id,
        //   email: user.email,
        //   name: user.username,
        //   image_url: user.image_url,
        //   public_id: user.public_id,
        //   OtpExpiry: user.otpExpiry,
        //   role: user.role,
        // },
        user,
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
    //  const userId = TokenPayLoad.id;

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
//     const decoded = verifyToken(request);

//     if (!decoded) {
//       return NextResponse.json(
//         {
//           message: "Authorization is required",
//         },
//         { status: 401 }
//       );
//     }

//     const userId = decoded.id; // Extract user ID from decoded token
//     const email = decoded.email?.toLowerCase(); // Extract email from decoded token

//     // Validate user ID and email
//     if (!userId) {
//       return NextResponse.json(
//         { message: "User ID is required." },
//         { status: 400 }
//       );
//     }

//     if (!email) {
//       return NextResponse.json(
//         { message: "Email is required." },
//         { status: 400 }
//       );
//     }

//     if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
//       return NextResponse.json(
//         { message: "Invalid email address format." },
//         { status: 400 }
//       );
//     }

//     const { name } = await request.json();

//     if (!name) {
//       return NextResponse.json(
//         { message: "Name is required." },
//         { status: 400 }
//       );
//     }

//     // Find the user by ID
//     const user = await User.findById(userId);

//     if (!user) {
//       return NextResponse.json({ message: "User not found." }, { status: 404 });
//     }

//     // Update user information
//     user.username = name;

//     await user.save();

//     return NextResponse.json(
//       {
//         message: "User information updated successfully.",
//         user,
//         // user: {
//         //   email: user.email,
//         //   name: user.username,
//         //   role: user.role,
//         //   isVerified: user.isVerified,
//         // },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error updating user:", error);
//     return NextResponse.json(
//       { message: "Error updating user", error },
//       { status: 500 }
//     );
//   }
// }



interface ImageUploadResponse {
  secure_url: string;
  public_id: string;
}

export async function PATCH(request: NextRequest) {
  try {
    // Verify token and extract user data
    const decoded = verifyToken(request);
    // const decoded = TokenPayLoad.id;
    

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


    console.log(userId)

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

    // Validate email format
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return NextResponse.json(
        { message: "Invalid email address format." },
        { status: 400 }
      );
    }
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Parse form data for image and other inputs
    const formData = await request.formData();
    const image = formData.get("image") as unknown as File;
    const name = formData.get("name") as string; // Ensure name comes from formData, not JSON

    // Validate image
    if (image) {
      const fileSize = image.size;
      const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB file size limit
      if (fileSize > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            error: `File size too large. Got ${fileSize}. Maximum is ${MAX_FILE_SIZE}.`,
          },
          { status: 413 }
        );
      }

      // Check if user has an existing image and delete it if necessary
      if (user.public_id) {
        console.log("Deleting existing image with public_id:", user.public_id);
        await DeleteImage(user.public_id);
      }

      // Upload new image to Cloudinary
      const data = (await UploadImage(
        image,
        "EpicHair-userprofile-gallery"
      )) as ImageUploadResponse;

      if (!data) {
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }

      // Update user's image_url and public_id with new image data
      user.image_url = data.secure_url;
      user.public_id = data.public_id;
    }


    // Validate name
    if (name) {
     
      user.username = name; // Update the name
    }

    // Find user by ID
    

    

    // Save updated user details
    await user.save();

    return NextResponse.json(
      {
        message: "User information updated successfully.",
        // user: {
        //   email: user.email,
        //   name: user.username,
        //   image_url: user.image_url,
        // },
        user,
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


