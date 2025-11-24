# 🚀 Pomodoro Timer

A modern, minimalist Pomodoro timer built from scratch with **React**, **TypeScript**, and **Vite**. This app is designed to help you stay focused and productive.

## ✨ Live Demo

**Check out the live app here:** [**https://stunning-taiyaki-eaca32.netlify.app/**](https://stunning-taiyaki-eaca32.netlify.app/)

## 📸 Preview

<img width="1363" height="614" alt="Pomodoro Timer Preview" src="https://github.com/user-attachments/assets/d12ac373-6ba0-4a3d-b253-e6d18ef3000b" />

## ✨ Key Features

* **⚙️ Customizable Settings:** Don't like the defaults? Open the settings panel to define your own custom durations for work sessions and breaks.
* **🔄 Full Pomodoro Cycle:** Automatically handles the logic for the Pomodoro Technique, including tracking completed sessions and triggering a Long Break after every four work intervals.
* **🔔 Audio Alerts:** Plays a distinct notification sound when a timer completes so you never miss a break.
* **📝 Browser Tab Notifications:** The document title updates in real-time with the countdown, so you can see the remaining time even when you are in another tab.
* **💬 User Feedback:** Integrated feedback form powered by **Netlify Forms** (serverless) allows users to send suggestions directly from the app.
* **📱 Responsive Design:** A clean, centered layout that works perfectly on desktop and mobile devices.

## 💻 Technologies Used

* **Core:** React (Hooks: `useState`, `useEffect`), TypeScript
* **Build Tool:** Vite
* **Styling:**
    * `react-bootstrap` (Grid system and layout)
    * Custom CSS (for the frosted glass modals and dynamic theming)
* **Deployment & Backend:** Netlify (Continuous Deployment + Netlify Forms)

---

## 🏃‍♂️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Make sure you have Node.js and npm installed.

* [Node.js](https://nodejs.org/)
* [npm](https://www.npmjs.com/get-npm)

### Installation

1.  Clone the repository:
    ```sh
    git clone [https://github.com/MatheusPMello/pomodoro-timer.git](https://github.com/MatheusPMello/pomodoro-timer.git)
    ```
2.  Navigate to the project directory:
    ```sh
    cd pomodoro-timer
    ```
3.  Install the dependencies:
    ```sh
    npm install
    ```

### Running the Application

To start the development server, run:

```sh
npm run dev
```

This will open the application in your default browser at http://localhost:5173.

### 📜 Available Scripts
npm run dev: Runs the app in development mode.

npm run build: Builds the app for production.

npm run lint: Lints the code using ESLint.

npm run preview: Previews the production build locally.
