import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Register() {
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    role: Yup.string()
      .oneOf(["admin", "landlord", "tenant"], "Invalid role")
      .required("Role is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setRegisterError("");
    setRegisterSuccess("");
    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRegisterSuccess("✅ Registration successful! You can now login.");
        resetForm();
      } else {
        setRegisterError(data.error || "❌ Registration failed");
      }
    } catch (err) {
      console.error("Error:", err);
      setRegisterError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md bg-white text-black rounded-3xl shadow-2xl border border-gray-300 p-10">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-3xl font-extrabold">Create Account ✨</h2>
          <p className="text-sm text-gray-600 mt-2">Sign up to get started</p>
        </div>

        {/* Error & Success */}
        {registerError && (
          <div className="mb-4 text-sm text-red-600 font-semibold text-center">
            {registerError}
          </div>
        )}
        {registerSuccess && (
          <div className="mb-4 text-sm text-green-600 font-semibold text-center">
            {registerSuccess}
          </div>
        )}

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* Name */}
              <div>
                <label className="block mb-2 text-sm font-medium">Name</label>
                <Field
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block mb-2 text-sm font-medium">
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

              {/* Password */}
              <div>
                <label className="block mb-2 text-sm font-medium">
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

              {/* Confirm Password */}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Confirm Password
                </label>
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              {/* Role Selector */}
              <div>
                <label className="block mb-2 text-sm font-medium">Role</label>
                <Field
                  name="role"
                  as="select"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="landlord">Landlord</option>
                  <option value="tenant">Tenant</option>
                </Field>
                <ErrorMessage
                  name="role"
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
                {isSubmitting ? "Registering..." : "Register"}
              </button>

              {/* Footer */}
              <p className="text-sm text-center text-gray-600 mt-4">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-semibold text-black hover:text-gray-700 underline"
                >
                  Login here
                </a>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Register;
