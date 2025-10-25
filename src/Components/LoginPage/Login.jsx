import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Login() {
  const [loginError, setLoginError] = useState("");

  // ✅ Validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // ✅ Submit logic
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoginError(""); // clear previous error
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("✅ Login successful!");
        resetForm();
      } else {
        setLoginError(data.error || "❌ Login failed");
      }
    } catch (err) {
      console.error("Error:", err);
      setLoginError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md bg-white text-black rounded-3xl shadow-2xl border border-gray-300 p-10">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-3xl font-extrabold">Welcome Back 👋</h2>
          <p className="text-sm text-gray-600 mt-2">
            Log in to access your account
          </p>
        </div>

        {/* Form */}
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium"
                >
                  Email Address
                </label>
                <Field
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium"
                >
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 font-semibold text-white bg-black rounded-lg hover:bg-gray-800 focus:ring-4 focus:ring-gray-600 transition duration-300 shadow-md"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
              {/* Inline Login Error */}
              {loginError && (
                <div className="mb-4 text-sm text-red-600 font-semibold text-center">
                  {loginError}
                </div>
              )}

              {/* Footer */}
              <p className="text-sm text-center text-gray-600 mt-4">
                Don’t have an account?{" "}
                <a
                  href="/register"
                  className="font-semibold text-black hover:text-gray-700 underline"
                >
                  Register here
                </a>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Login;
