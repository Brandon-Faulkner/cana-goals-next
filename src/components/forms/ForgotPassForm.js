import { FaCircleCheck, FaEnvelope, FaKey } from "react-icons/fa6";
import TextInput from "../actions/TextInput";
import Button from "../actions/Button";

export default function ForgotPassForm({ onBack }) {
    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 bg-white dark:bg-black shadow-lg w-full sm:p-8 p-6 rounded-lg relative">
                <div>
                    <div className="mb-10">
                        <h1 className="text-black dark:text-white font-semibold text-2xl">Forgot Your Password?</h1>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <FaCircleCheck className="min-h-4 min-w-4 text-green" />
                            <h2 className="text-black dark:text-white text-lg">Enter the email address associated with your
                                account.</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaCircleCheck className="min-h-4 min-w-4 text-green" />
                            <h2 className="text-black dark:text-white text-lg">Check your email inbox for a link to reset
                                your password.
                            </h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaCircleCheck className="min-h-4 min-w-4 text-green" />
                            <h2 className="text-black dark:text-white text-lg">Change your password and sign back in!</h2>
                        </div>
                    </div>
                </div>

                <form className="md:max-w-sm w-full mx-auto">
                    <div className="mb-8">
                        <h1 className="text-black dark:text-white font-semibold text-2xl">Reset Your Password</h1>
                    </div>

                    <div className="space-y-4">
                        <TextInput
                            label={"Email Address"}
                            name={"email"}
                            type={"email"}
                            Icon={FaEnvelope}
                            placeholder={"E.g. example@canachurch.com"}
                        />
                    </div>

                    <div className="mt-8">
                        <Button
                            label={"Reset Password"}
                            type={"submit"}
                            Icon={FaKey}
                        />
                    </div>

                    <div className="mt-4 text-center">
                        <button type="button" onClick={onBack} className="text-base text-green hover:underline accent-green-alt cursor-pointer">
                            Back to Login
                        </button>
                    </div>
                </form>
                <div
                    className="divider absolute left-0 right-0 mx-auto w-1 h-full border-l border-black dark:border-white max-md:hidden">
                </div>
            </div>
        </div>
    )
}