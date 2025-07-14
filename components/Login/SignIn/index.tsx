import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Field from "@/components/Field";
// ❌ DELETE THIS
// import supabase from "@/lib/supabase";

type SignInProps = {
    handleSignUp: () => void;
    handleForgotPassword: () => void;
};

const SignIn = ({ handleSignUp, handleForgotPassword }: SignInProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        console.log("Starting sign-in process...");
        
        try {
            console.log("Calling signIn function...");
            // Use supabase.auth.signInWithPassword directly
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            if (signInError) {
                console.error("Supabase sign-in error:", signInError);
                let errorMessage = "Failed to sign in";
                if (signInError.message) {
                    if (signInError.message.includes("Invalid login credentials")) {
                        errorMessage = "Invalid email or password. Please check your credentials.";
                    } else if (signInError.message.includes("Email not confirmed")) {
                        errorMessage = "Please check your email and confirm your account.";
                    } else {
                        errorMessage = signInError.message;
                    }
                }
                setError(errorMessage);
            } else if (data.user) { // Check if data.user exists
                console.log("Sign-in successful, user:", data.user);
                
                // Fetch user's role from the 'profiles' table
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', data.user.id)
                    .single();

                if (profileError) {
                    console.error("Error fetching profile:", profileError);
                    // Decide on a fallback behavior, e.g., redirect to a generic dashboard
                    router.push('/dashboard');
                    return;
                }

                // Redirect based on the user's role
                if (profile && profile.role === 'admin') {
                    console.log("Admin user detected, redirecting to admin dashboard...");
                    router.push('/admin/dashboard');
                } else {
                    console.log("Non-admin user, redirecting to user dashboard...");
                    router.push('/dashboard');
                }
            } else {
                // Handle cases where there's no error but also no user data (should be rare)
                console.error("Sign-in did not return user data and no error.");
                setError("An unexpected error occurred during sign-in.");
            }
                
        } catch (error: any) { // This catch is for unexpected errors in the try block itself
            console.error("Sign-in process caught an unexpected error:", error);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
            console.log("Sign-in process completed");
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
                autoComplete="current-password"
                required
                handleForgotPassword={handleForgotPassword}
            />
            <Button className="mt-6 w-full" isBlack type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
            </Button>
            <div className="mt-4 text-center text-body-2 text-t-secondary">
                Need an account?&nbsp;
                <button
                    type="button"
                    className="text-t-primary font-bold transition-colors hover:text-primary-01"
                    onClick={handleSignUp}
                >
                    Sign up
                </button>
            </div>
        </form>
    );
};

export default SignIn;
