# 🗳️ ElectIQ — Your Interactive Election Guide

**ElectIQ** is an interactive AI-powered assistant designed to simplify the election process for first-time voters and the general public. It provides **clear, step-by-step guidance** on registration, eligibility, voting, and results across multiple countries.

> Built with a focus on clarity, accessibility, and modular AI-driven design.

---

## 🚀 Live Demo

🌐 **Frontend (Vercel)**
👉 [https://elect-iq-seven.vercel.app/chat](https://elect-iq-seven.vercel.app/chat)

⚙️ **Backend (Google Cloud Run)**
👉 [https://elect-iq-397274261172.europe-west1.run.app](https://elect-iq-397274261172.europe-west1.run.app)

---

## ✨ Overview

Navigating elections can be confusing — different rules, deadlines, and processes across regions make participation difficult.

**ElectIQ solves this by:**

* Breaking down the **complete election lifecycle**
* Providing **personalized, country-specific guidance**
* Delivering **interactive learning (FAQs, quizzes, next steps)**
* Using **simple, conversational language**

---

## 🌍 Supported Regions

🇮🇳 India
🇺🇸 USA
🇬🇧 UK
🇩🇪 Germany
🇦🇺 Australia

---

## 🧠 Core Features

### 🗂️ Election Lifecycle Guidance

* Registration → Campaigning → Voting → Counting → Results
* Structured and easy-to-follow explanations

### 🎯 Personalized Assistance

* Country-specific rules
* Eligibility checks
* Required documents guidance

### 💬 Interactive Experience

* Conversational chatbot
* Smart FAQ suggestions
* Quick quizzes
* “What should I do next?” recommendations

### 📅 Timelines & Key Dates

* Election schedules
* Registration deadlines
* Voting reminders

### ♿ Beginner-Friendly Design

* Simple language
* No prior knowledge required
* No sign-up needed

---

## 🏗️ System Architecture

```
                ┌──────────────────────┐
                │      Frontend UI     │
                │ (React + Vite App)  │
                └─────────┬────────────┘
                          │
                          ▼
                ┌──────────────────────┐
                │   Chat Interface     │
                │ (State + Prompts)    │
                └─────────┬────────────┘
                          │
                          ▼
                ┌──────────────────────┐
                │  AI / Logic Layer    │
                │  (Rules + LLM/Tree)  │
                └─────────┬────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼                               ▼
┌──────────────────────┐        ┌──────────────────────┐
│ Structured Data/API  │        │ Static Knowledge Base │
│ (Election Info)      │        │ (FAQs, Guides)        │
└──────────────────────┘        └──────────────────────┘
```

---

## 🧩 Feature Breakdown

| Feature             | Description                      |
| ------------------- | -------------------------------- |
| Chat Assistant      | Conversational UI for queries    |
| Lifecycle Explorer  | Step-by-step election phases     |
| Eligibility Checker | Determines voting eligibility    |
| ID Guidance         | Required documents per country   |
| Timeline Viewer     | Key dates & deadlines            |
| Quick Quiz          | Reinforces understanding         |
| Next-Step Engine    | Personalized actionable guidance |

---

## 💬 Sample Interaction

**User:** How do I register to vote in India?

**ElectIQ:**

* Must be 18+ and an Indian citizen
* Apply via NVSP portal or Form 6
* Upload ID and address proof

👉 Suggested actions:

* Check eligibility
* View required documents
* Track application

---

## 🖥️ UI/UX Design

```
Sidebar:
- Ask Anything
- Election Lifecycle
- Key Dates
- Quick Quiz
- What’s Next

Main Panel:
- AI Response Card
- Suggested Actions (buttons)
- Chat Input + Send
```

### Design Principles

* Minimal & distraction-free
* Guided interaction (buttons + prompts)
* Accessible and responsive

---

## ⚙️ Tech Stack

**Frontend**

* React + Vite
* TypeScript
* Tailwind CSS

**Backend / Logic**

* Node.js / Python
* Rule-based + AI logic
* REST APIs

**Data**

* JSON / TSV datasets
* Government APIs (optional)

**Deployment**

* Vercel (Frontend)
* Google Cloud Run (Backend)

---

## 🔌 Scalability

* Modular architecture
* Country-specific plug-and-play logic
* Easily extendable to new regions

---

## 📦 Installation

```bash
git clone https://github.com/sathwiksandesh/electiq.git
cd electiq
npm install
npm run dev
```

---

## 🧪 Future Enhancements

* 🌐 More country support
* 📊 Real-time election APIs
* 🔔 Notifications & reminders
* 🗣️ Voice assistant
* 📱 Mobile app

---

