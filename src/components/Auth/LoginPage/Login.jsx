import { useState } from "react";
import { useNavigate } from "react-router-dom"; // if using React Router
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useContext } from "react";
import { UserContext } from "../../pages/context/UserContext";

function Login() {
  const navigate = useNavigate(); // React Router v6 hook
  const [loginError, setLoginError] = useState("");
  const { loginUser } = useContext(UserContext);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoginError("");
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user info globally
        loginUser({
          id: data.user?.id,
          token: data.token,
          role: data.user?.role,
          email: data.user?.email,
          name: data.user?.name,
        });

        console.log("User saved:", data);

        // Redirect based on role
        switch (data.user?.role) {
          case "admin":
            navigate("/admin-dashboard");
            break;
          case "landlord":
            navigate("/landlord-dashboard");
            break;
          case "tenant":
            navigate("/tenant-dashboard");
            break;
          default:
            navigate("/");
        }
      } else {
        setLoginError(data.error || "❌ Login failed");
      }
    } catch (err) {
      console.error("Error:", err);
      setLoginError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md bg-white text-black rounded-3xl shadow-2xl border border-gray-300 p-10">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-extrabold">Welcome Back 👋</h2>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
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

                {loginError && (
                  <div className="mb-4 text-sm text-red-600 font-semibold text-center">
                    {loginError}
                  </div>
                )}
              </div>
              {/* Footer */}
              <p className="text-sm text-center text-gray-600 mt-4">
                No account?{" "}
                <a
                  href="/register"
                  className="font-semibold text-black hover:text-gray-700 underline"
                >
                  Create account
                </a>
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 font-semibold text-white bg-black rounded-lg hover:bg-gray-800 focus:ring-4 focus:ring-gray-600 transition duration-300 shadow-md"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Login;
