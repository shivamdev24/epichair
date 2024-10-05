import { NextRequest, NextResponse } from "next/server";
import Service from "@/models/Service";
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

    if (typeof decoded !== "string" && (decoded as JwtPayload).id) {
      return (decoded as JwtPayload).id;
    } else {
      throw new Error("Invalid token payload.");
    }
  } catch (error) {
    throw new Error("Invalid token.", {cause: error});
  }
};

export async function GET(request: NextRequest) {
  try {
    const userId = verifyToken(request);

     console.log(userId);

    const services = await Service.find();
    return NextResponse.json(services, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.message === "Authorization token is required.") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    } else if (error.message === "Invalid token.") {
      return NextResponse.json(
        { message: "Forbidden: Invalid token" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { message: "Error retrieving services", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = verifyToken(request);
     console.log(userId);

    const { name, description } = await request.json();
    const newService = new Service({ name, description });
    await newService.save();

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    if (error === "Authorization token is required.") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    } else if (error === "Invalid token.") {
      return NextResponse.json(
        { message: "Forbidden: Invalid token" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { message: "Error creating service", error},
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = verifyToken(request);
    console.log(userId);

    const { _id, name, description } = await request.json();
    const updatedService = await Service.findByIdAndUpdate(
      _id,
      { name, description },
      { new: true }
    );

    if (!updatedService) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedService, { status: 200 });
  } catch (error) {
    if (error === "Authorization token is required.") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    } else if (error === "Invalid token.") {
      return NextResponse.json(
        { message: "Forbidden: Invalid token" },
        { status: 403 }
      );
    }

    console.error("Error updating service:", error); 
    return NextResponse.json(
      { message: "Error updating service", error }, 
      { status: 500 }
    );
  }
}


export async function DELETE(request: NextRequest) {
  try {
    const userId = verifyToken(request);
     console.log(userId);

    const { _id } = await request.json();
    const deletedService = await Service.findByIdAndDelete(_id);
    if (!deletedService) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Service deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error === "Authorization token is required.") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    } else if (error === "Invalid token.") {
      return NextResponse.json(
        { message: "Forbidden: Invalid token" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { message: "Error deleting service", error },
      { status: 500 }
    );
  }
}
