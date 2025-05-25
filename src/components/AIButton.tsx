import React, { useState } from "react";
import { generateCompletion } from "../services/openai";
import "./AIButton.css";

const AIButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    const emailBody = document.querySelector('div[role="textbox"]');
    const subjectInput = document.querySelector('input[name="subjectbox"]');
    const originalEmail =
      document.querySelector(".h7")?.textContent?.trim() || ""; // Gets the quoted email content
    const senderName =
      document.querySelector(".gD")?.getAttribute("name") || ""; // Gets the sender's name
    const emailContent = emailBody?.textContent?.trim() || "";

    // Combine the information
    const fullContext = {
      senderName: senderName,
      originalEmail: originalEmail,
      newContent: emailContent,
    };

    // Check if we have the necessary content
    if (!emailContent && !originalEmail) {
      alert(
        "Please write some content in the email before using the AI assistant."
      );
      return;
    }

    setIsLoading(true);

    try {
      if (emailBody && subjectInput) {
        const response = await generateCompletion(fullContext);
        const jsonResponse = JSON.parse(response);

        // Set the email body
        emailBody.innerHTML = jsonResponse.body;

        // Set the subject
        (subjectInput as HTMLInputElement).value = jsonResponse.object;

        // Trigger input events for both changes
        const inputEvent = new Event("input", { bubbles: true });
        emailBody.dispatchEvent(inputEvent);
        subjectInput.dispatchEvent(inputEvent);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className="ai-button"
      style={{
        padding: "4px 8px",
        fontSize: "11px",
        background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
        color: "#fff",
        borderRadius: "12px",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        height: "20px",
        position: "absolute",
        right: "8px",
        top: "6%",
        transform: "translateY(-50%)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        zIndex: 1,
      }}
      role="button"
      onClick={handleClick}
    >
      {isLoading ? (
        <svg
          className="animate-spin"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          style={{
            animation: "spin 1s linear infinite",
          }}
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray="32"
            strokeDashoffset="8"
          />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFD700">
          <path d="M13 0L4 13h7l-2 11 9-13h-7l2-11z" />
        </svg>
      )}
      <span>{isLoading ? "Enhancing..." : "Enhance with AI"}</span>
    </div>
  );
};

export default AIButton;
