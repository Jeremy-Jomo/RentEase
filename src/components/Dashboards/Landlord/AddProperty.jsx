import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const AddProperty = () => {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");

  const initialValues = {
    title: "",
    description: "",
    location: "",
    rent_price: "",
    image_url: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    location: Yup.string().required("Location is required"),
    rent_price: Yup.number()
      .typeError("Rent must be a number")
      .required("Rent price is required"),
    image_url: Yup.string(),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitError("");

    const payload = {
      ...values,
      landlord_id: Number(localStorage.getItem("id")),
    };
    console.log("Payload being sent:", payload);

    const response = await fetch(
      "https://renteasebackend-1.onrender.com/properties",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (response.ok) {
      resetForm();
      navigate("/landlord-dashboard"); // redirect after successful add
    } else {
      setSubmitError(data.error || "Failed to add property");
    }
    setSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-300 p-10">
        <h2 className="text-3xl font-extrabold mb-6 text-center">
          Add New Property
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* Title */}
              <div>
                <label className="block mb-2 font-medium">Title</label>
                <Field
                  type="text"
                  name="title"
                  placeholder="Beautiful apartment in Nairobi"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 font-medium">Description</label>
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Describe your property..."
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                  rows={4}
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block mb-2 font-medium">Location</label>
                <Field
                  type="text"
                  name="location"
                  placeholder="City or neighborhood"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                />
                <ErrorMessage
                  name="location"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              {/* Rent Price */}
              <div>
                <label className="block mb-2 font-medium">Rent Price</label>
                <Field
                  type="number"
                  name="rent_price"
                  placeholder="1200"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                />
                <ErrorMessage
                  name="rent_price"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block mb-2 font-medium">
                  Image URL (optional)
                </label>
                <Field
                  type="text"
                  name="image_url"
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                />
              </div>

              {submitError && (
                <div className="text-red-600 font-semibold text-center">
                  {submitError}
                </div>
              )}

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  {isSubmitting ? "Adding..." : "Add Property"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddProperty;
