import { FaEnvelope, FaLock, FaRightToBracket } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useState } from "react";
import Image from "next/image";
import TextInput from "../actions/TextInput";
import Checkbox from "../actions/Checkbox";
import Button from "../actions/Button";

export default function LoginForm({ onForgot }) {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        // Validate email and password
        if (!formData.email || !formData.password) {
            toast.error("Missing email and/or password.");
            return;
        }

        try {
            if (formData.email && formData.password) {
                // Send data to firebase and check auth
                toast.success("Logged in!");
            }
        } catch (error) {
            toast.error("Error loggin in: " + error.message);
        }
    };

    return (
        <div className="grid items-center gap-4 max-w-xl w-full">
            <div className="bg-white dark:bg-black rounded-lg p-6 max-w-full shadow-lg max-md:mx-auto">
                <form className="space-y-4" onSubmit={handleLogin}>
                    <Image src="/android-chrome-192x192.png" alt="Cana Goals main logo" width={100} height={100} className="m-auto" />

                    <div className="mb-8">
                        <h1 className="text-green text-4xl font-bold flex justify-center">Sign In</h1>
                        <p className="text-black dark:text-white font-normal text-xl mt-4 leading-relaxed flex justify-center">Welcome back to Cana Goals!</p>
                    </div>

                    <TextInput label={"Email Address"} name={"email"} type={"email"} Icon={FaEnvelope} placeholder={"E.g. example@canachurch.com"} value={formData.email} onChange={handleInputChange} />
                    <TextInput label={"Password"} name={"password"} type={"password"} Icon={FaLock} placeholder={"**********"} value={formData.password} onChange={handleInputChange} />

                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <Checkbox label={"Remember Me"} name={"rememberMe"} checked={formData.rememberMe} onChange={handleInputChange} />

                        <button type="button" onClick={onForgot} className="text-base text-green hover:underline accent-green-alt cursor-pointer">
                            Forgot your password?
                        </button>
                    </div>

                    <div className="!mt-8">
                        <Button label={"Log In"} type={"submit"} Icon={FaRightToBracket} />
                    </div>
                </form>
            </div>
        </div>
    );
}