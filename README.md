# 🚀 Pomodoro Timer

A modern, minimalist Pomodoro timer built from scratch with **React**, **TypeScript**, and **Vite**. This app is designed to help you stay focused and productive, featuring a dynamic theme that changes to match your current mode (Work, Short Break, or Long Break).

## ✨ Live Demo

**Check out the live app here:** [**https://stunning-taiyaki-eaca32.netlify.app/**](https://stunning-taiyaki-eaca32.netlify.app/)

## 📸 Preview

![Pomodoro Timer in "Long Break" mode](https://i.imgur.com/f2c5df.png)

## Core Features

* **Dynamic Theming:** The entire app's color scheme changes to match the active mode, helping you stay in the zone.
* **Full Pomodoro Cycle:** The app automatically cycles through Work, Short Break, and Long Break sessions, including a long break after every four work sessions.
* **Active Mode Indicator:** The UI clearly highlights which mode ("Work", "Short Break", or "Long Break") is currently selected.
* **Session Counter:** Visually tracks your completed work sessions so you know when your next long break is coming.
* **Responsive Layout:** The interface is built to be clean and usable on both desktop and mobile devices.

## 💻 Technologies Used

* **Core:** React (with Hooks: `useState`, `useEffect`), TypeScript
* **Build Tool:** Vite
* **Styling:**
    * `react-bootstrap` (for layout and components)
    * Custom CSS (for dynamic theming and the minimalist UI)
* **Deployment:** Netlify (with continuous deployment from GitHub)

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
