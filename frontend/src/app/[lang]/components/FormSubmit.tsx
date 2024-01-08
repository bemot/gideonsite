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
  const [errorMessage_email, setErrorMessage_email] = useState("");
  const [errorMessage_message, setErrorMessage_message] = useState("");
  const token = process.env.NEXT_PUBLIC_STRAPI_FORM_SUBMISSION_TOKEN;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function handleSubmit() {
    if (email === "") {
      setErrorMessage_email("Email cannot be blank.");
      return;
    }
    if (message === "") {
      setErrorMessage_message("Message cannot be blank.");
      return;
    }


    if (!emailRegex.test(email)) {
      setErrorMessage_email("Invalid email format.");
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
      setErrorMessage_email("Email failed to submit.");
      return;
    }
    setErrorMessage_email("");
    setErrorMessage_message("");

    setSuccessMessage("Email successfully submitted!");
    setEmail("");
  }

  return (
    <div className="flex items-center justify-center shadow-md">
      <div className="flex-col">

        {successMessage ? (
          <p className="text-green-700 bg-green-300 px-4 py-2 rounded-lg">
            {successMessage}
          </p>
        ) : (
          <>
            <label htmlFor="message" className="text-gray-700 my-2">
              email
            </label>
            <input
              type="email"
              placeholder={errorMessage_email || placeholder}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full p-3 rounded-lg text-gray-700 my-2"
            />


            <label htmlFor="message" className="text-gray-700 my-2">
              Message
            </label>
            <input
              type="message"
              placeholder={errorMessage_message}
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              className="w-full p-3 rounded-lg text-gray-700 my-2"
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

        {errorMessage_email && (
          <p className="text-red-500 bg-red-200 px-4 py-2 rounded-lg my-2">
            {errorMessage_email}
          </p>

        )}

      </div>
    </div>
  );
}
