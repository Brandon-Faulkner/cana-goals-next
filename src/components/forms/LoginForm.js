import { FaEnvelope, FaLock, FaRightToBracket } from "react-icons/fa6";
import TextInput from "../actions/TextInput";
import Checkbox from "../actions/Checkbox";
import Button from "../actions/Button";

export default function LoginForm({ onForgot }) {
    return (
        <div className="grid items-center gap-4 max-w-xl w-full">
            <div className="bg-white dark:bg-black rounded-lg p-6 max-w-full shadow-lg max-md:mx-auto">
                <form className="space-y-4">
                    <div className="mb-8">
                        <h1 className="text-green text-4xl font-bold flex justify-center">Sign In</h1>
                        <p className="text-black dark:text-white font-normal text-xl mt-4 leading-relaxed flex justify-center">Welcome back to Cana Goals!</p>
                    </div>

                    <TextInput label={"Email Address"} name={"email"} type={"email"} Icon={FaEnvelope} placeholder={"E.g. example@canachurch.com"} />
                    <TextInput label={"Password"} name={"password"} type={"password"} Icon={FaLock} placeholder={"**********"} />

                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <Checkbox label={"Remember Me"} name={"remember-me"} />

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