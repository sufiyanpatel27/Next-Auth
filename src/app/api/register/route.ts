import { connectMongoDB} from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: any) {
    const { name, email, password } = await req.json();
    await connectMongoDB();
    const existingUser = await User.findOne({ email });

    

    if (existingUser) {
        return new NextResponse("User exists with this email.", {status: 400});
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword});
        return NextResponse.json({ message: "User registered. "}, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "An error occured while registering the user." },
            { status: 500 }
        )
    }
}