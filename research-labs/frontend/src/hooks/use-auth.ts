import { useState } from "react";
import { useRouter } from "next/navigation";

type FormData = {
  [key: string]: string;
};

type User = {
  id?: number;
  username: string;
  email: string;
  password_hash: string;
  role: string;
};

type AuthMode = "login" | "register";

type AuthResponse = {
  token?: string;
  user?: User;
  error?: string;
  message?: string;
};

export const useAuthForm = (mode: AuthMode) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const router = useRouter();

  const submitForm = async (formData: FormData) => {
    setIsLoading(true);

    try {
      const endpoint = (mode === "login")
        ? "http://127.0.0.1:6188/nodejs/api/auth/login"
        : "http://127.0.0.1:6188/nodejs/api/auth/register";

      const response = await fetch(endpoint, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: AuthResponse = await response.json();
      console.log("----------------------------------");
      console.log("API Response:", data);
      console.log("----------------------------------");

      if (data.statue == 'INACTIVE') {
        router.push("/inactive")
      }
      if (!response.ok) {
        throw new Error(data.error || data.message || "Authentication failed");
      }

      if (data.user) {
        setUserData(data.user);
      }

      if (mode === "login") {
        document.cookie = `token=${data.token}; path=/; secure; samesite=strict`;
      } else if (mode === "register") {
        // router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        router.push("/login")
      }
      router.push("/profile");

      return data;
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : "An unknown error occurred";
      setError(message);
      console.error("Authentication error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    userData,
    submitForm,
  };
};
