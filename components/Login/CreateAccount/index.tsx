import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Field from "@/components/Field";
import supabase from "@/lib/supabase"; // Replaced import

type CreateAccountProps = {
    handleSignIn: () => void;
};

const CreateAccount = ({ handleSignIn }: CreateAccountProps) => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            // Use supabase.auth.signUp directly
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName, // Fixed variable name
                    },
                },
            });
    
            if (error) {
                setError(error.message);
            } else if (data.user) {
                // Account created successfully
                if (data.session) {
                    // User is automatically logged in
                    router.push('/dashboard');
                } else {
                    // Email confirmation required
                    setError("Please check your email and confirm your account before signing in.");
                }
            }
        } catch (error: any) {
            // Handle specific error cases
            const errorMessage = error.message || "Failed to create account";
            
            if (errorMessage.includes("User already registered") || 
                errorMessage.includes("already exists") || 
                errorMessage.includes("already been taken") ||
                errorMessage.includes("email address is already in use") ||
                errorMessage.includes("duplicate") ||
                error.status === 422) {
                setError("An account with this email already exists. Please try logging in.");
            } else if (errorMessage.includes("invalid email") || errorMessage.includes("Invalid email")) {
                setError("Please enter a valid email address.");
            } else if (errorMessage.includes("password") && (errorMessage.includes("short") || errorMessage.includes("6"))) {
                setError("Password must be at least 6 characters long.");
            } else if (errorMessage.includes("weak") || errorMessage.includes("Password")) {
                setError("Please choose a stronger password with at least 6 characters.");
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                    {error}
                </div>
            )}
            <Field
                className="mt-6"
                innerLabel="Full name"
                placeholder="Enter full name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                required
            />
            <Field
                className="mt-6"
                innerLabel="Email"
                placeholder="Enter email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
            />
            <Field
                className="mt-6"
                innerLabel="Password"
                placeholder="Enter password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
            />
            <Button className="mt-6 w-full" isBlack type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
            </Button>
            <div className="mt-4 text-center text-body-2 text-t-secondary">
                Already have an account?&nbsp;
                <button
                    type="button"
                    className="text-t-primary font-bold transition-colors hover:text-primary-01"
                    onClick={handleSignIn}
                >
                    Sign in
                </button>
            </div>
        </form>
    );
};

export default CreateAccount;
