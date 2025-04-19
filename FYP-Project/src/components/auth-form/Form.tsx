import { useState, useEffect } from "react";
import { FormField } from "./FormField";
import { useAuthForm } from "../../hooks/usetAuthForm";
import { FormMessage } from "./FormMessage";
import { FormLink } from "./FormLink";

// Props used to differentiate the form
type FormProps = {
    route: string,
    method: string,
}

export const Form: React.FC<FormProps> = ({
     route, method 
    }) => {

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    
    const {
      username,
      setUsername,
      password,
      setPassword,
      loading,
      error,
      handleSubmit,
    } = useAuthForm(route, method);

    const formName = method === "login" ? "Login" : "Register";

    // Sets the success message if it existss
    useEffect(() => {
        const message = localStorage.getItem("successMessage");

        if (message) {
            setSuccessMessage(message);
            localStorage.removeItem("successMessage");
        }
    }, [])


    return (
        <div className="flex justify-center items-center mt-20">
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-lg w-96">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">{formName}</h1>

                <FormMessage type="error" message={error} />
                <FormMessage type="success" message={successMessage} />


                <FormField
                    id="username"
                    label="Username"
                    type="text"
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                />

                <FormField
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                />

                <button
                    type="submit"
                    className={`w-full py-2 rounded-md text-white font-semibold bg-darkred hover:bg-darkredhover transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={loading}
                >
                    {loading ? "Loading..." : formName}
                </button>

                <FormLink method={method} />
            </form>
        </div>
    )
  }

export default Form;