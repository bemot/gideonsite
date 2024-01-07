"use client";
import { useState } from "react";
import { getStrapiURL } from "../utils/api-helpers";

export default function FormSubmit({
  placeholder,
  text,
}: {
  placeholder: string;
  text: string;
}) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const token = process.env.NEXT_PUBLIC_STRAPI_FORM_SUBMISSION_TOKEN;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function handleSubmit() {
    if (email === "") {
      setErrorMessage("Email cannot be blank.");
      return;
    }
    if (message === "") {
      setErrorMessage("Message cannot be blank.");
      return;
    }


    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email format.");
      return;
    }

    const res = await fetch(getStrapiURL() + "/api/lead-form-submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: { email, message } }),
    });

    if (!res.ok) {
      setErrorMessage("Email failed to submit.");
      return;
    }
    setErrorMessage("");
    setSuccessMessage("Email successfully submitted!");
    setEmail("");
  }

  return (
    <div className="flex flex-col items-center justify-center shadow-md">
      <div className="flex flex-col">

        {successMessage ? (
          <p className="text-green-700 bg-green-700 px-4 py-2 rounded-lg">
            {successMessage}
          </p>
        ) : (
          <>
            <label htmlFor="message" className="text-gray-700 my-2">
              Message
            </label>
            <input
              id="message"
              type="message"
              placeholder={errorMessage}
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              className="w-full p-3 rounded-lg text-gray-700"
            />

            <label htmlFor="email" className="text-gray-700 my-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder={errorMessage || placeholder}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full p-3 rounded-lg text-gray-700"
            />

            <button
              type="button"
              className="w-full p-3 font-semibold rounded-lg dark:bg-violet-400 dark:text-gray-900 my-2"
              onClick={handleSubmit}
            >
              {text}
            </button>
          </>
        )}

        {errorMessage && (
          <p className="text-red-500 bg-red-200 px-4 py-2 rounded-lg my-2">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
