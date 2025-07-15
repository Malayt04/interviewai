# InterviewAI

InterviewAI is an AI-powered platform designed to help users prepare for job interviews through realistic mock interviews, instant feedback, and resume-based question generation. It leverages advanced AI models for both voice and coding interviews, providing a holistic and interactive preparation experience.

---

## Features

- **AI-Powered Mock Interviews:**

  - Practice real interview questions tailored to your chosen role, experience level, and tech stack.
  - Interviews are conducted by an AI interviewer using voice, simulating a real interview environment.

- **Resume-Based Interview Generation:**

  - Upload your resume (PDF), which is scanned to extract relevant information (role, level, tech stack).
  - The platform generates a set of custom interview questions based on your resume content.

- **Instant, Structured Feedback:**

  - After each interview, receive detailed feedback scored across multiple categories:
    - Communication Skills
    - Technical Knowledge
    - Problem-Solving
    - Cultural & Role Fit
    - Confidence & Clarity
  - Feedback includes strengths, areas for improvement, and a final assessment.

- **Coding Questions and Live Code Review:**

  - During interviews, you may be prompted to solve coding questions.
  - Submit code via an integrated editor and receive constructive feedback from the AI interviewer.

- **Credit-Based System & Payments:**

  - Credits are required to generate interviews and receive feedback.
  - Purchase credits securely via the integrated payment system.

- **User Profiles & Interview History:**
  - View your past interviews, feedback, and manage your profile.

---

## Getting Started

1. **Sign Up / Sign In:**
   - Create an account or log in to access the platform.
2. **Upload Resume (Optional):**
   - For a personalized experience, upload your resume to generate interview questions tailored to your background.
3. **Start an Interview:**
   - Choose your role, experience level, and tech stack, or use the resume-based generator. Begin a mock interview with the AI.
4. **Answer Questions (Voice & Coding):**
   - Respond to behavioral and technical questions. For coding questions, use the built-in code editor.
5. **Receive Feedback:**
   - Get instant, structured feedback on your performance, including scores and actionable insights.
6. **Purchase Credits:**
   - If you run out of credits, purchase more to continue practicing.

---

## Technologies Used

- Next.js (React framework)
- AI SDKs: Google Gemini, OpenAI GPT-4, 11labs (voice), Deepgram (transcription)
- Firebase (authentication, database)
- Razorpay (payments)
- Tailwind CSS (styling)
- Vapi (voice AI integration)

---

## How to Run Locally

1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up environment variables for Firebase, AI APIs, and payment keys.
4. Run the development server: `npm run dev`
5. Access the app at `http://localhost:3000`

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

---

## License

MIT License
