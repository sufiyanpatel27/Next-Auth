"use client"

import { useState } from "react"
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSubmit = async(e: any) => {
        e.preventDefault();

        if (!email || !password) {
            setError("All feilds are required.")
            return
        }

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid Credentials");
                return
            }
            router.replace("home");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col bg-white text-black
                justify-center items-center rounded-md w-[90%] md:w-1/3
            ">
                <p className="text-lg font-semibold mt-10">Sign In User</p>
                <form onSubmit={handleSubmit} className="flex flex-col mt-5 gap-3">
                    <input onChange={(e) => setEmail(e.target.value)} className="rounded-md bg-neutral-100" type="email" placeholder="email" />
                    <input onChange={(e) => setPassword(e.target.value)} className="rounded-md bg-neutral-100" type="password" placeholder="password" />
                    {error &&
                        <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                            {error}
                        </div>
                    }
                    <button className="bg-green-300 rounded-md mb-5 font-semibold">Log In</button>
                </form>
                <button onClick={() => signIn("google")} className="bg-red-300 rounded-md font-semibold px-9">Log In with Google</button>

                <Link className="text-sm mt-10 mb-3 text-right" href={"/register"}>
                    Do not have an account? <span className="underline">Sign Up</span>
                </Link>
            </div>
        </div>
    )
}