"use client"

import { useState } from "react"
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";


export default function RegisterPage() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!name || !email || !password) {
            setError("All feilds are required.")
            return
        }

        try {
            await axios.post("api/register",
                {
                    name,
                    email,
                    password,
                }
            ).then(() => {
                const form = e.target;
                form.reset();
                router.push("/")
            }
            ).catch((err) => {
                setError(err.response.data)
            });

        } catch (error) {
            console.log("Error during registeration: ", error);
        }
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col bg-white text-black
                justify-center items-center rounded-md w-[90%] md:w-1/3
            ">
                <p className="text-lg font-semibold mt-10">Register User</p>
                <form onSubmit={handleSubmit} className="flex flex-col mt-5 gap-3">
                    <input onChange={(e) => setName(e.target.value)} className="rounded-md bg-neutral-100" type="text" placeholder="name" />
                    <input onChange={(e) => setEmail(e.target.value)} className="rounded-md bg-neutral-100" type="email" placeholder="email" />
                    <input onChange={(e) => setPassword(e.target.value)} className="rounded-md bg-neutral-100" type="password" placeholder="password" />
                    {error &&
                        <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                            {error}
                        </div>
                    }
                    <button className="bg-green-300 rounded-md mb-10 font-semibold">Sign Up</button>
                </form>
                <Link className="text-sm mb-3 text-right" href={"/"}>
                    Already have an account? <span className="underline">Login</span>
                </Link>
            </div>
        </div>
    )
}