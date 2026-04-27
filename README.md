
# 🗳️ ElectIQ — Your Interactive Election Guide

**ElectIQ** is an interactive AI-powered assistant designed to simplify the election process for first-time voters and the general public. It provides clear, step-by-step guidance on registration, eligibility, voting, and results across multiple countries.

> Built with a focus on clarity, accessibility, and modular AI-driven design.
**Google Cloud run Deployment link : https://elect-iq-397274261172.europe-west1.run.app**
**Vercel Deployment Link : https://elect-iq-seven.vercel.app/chat**
---

## 🚀 Overview

Navigating elections can be confusing — different rules, deadlines, and processes across regions make it harder for citizens to participate.

**ElectIQ solves this by:**

* Breaking down the **entire election lifecycle**
* Providing **personalized, country-specific guidance**
* Offering **interactive learning (FAQs, quizzes, next steps)**
* Using **simple, conversational language**

---

## 🌍 Supported Regions

* 🇮🇳 India
* 🇺🇸 USA
* 🇬🇧 UK
* 🇩🇪 Germany
* 🇦🇺 Australia

---

## 🧠 Core Features

### 1. Election Lifecycle Guidance

* Registration → Campaigning → Voting → Counting → Results
* Clear, structured explanations for each phase

### 2. Personalized Assistance

* Country/region-specific rules
* Eligibility checks
* Required documents guidance

### 3. Interactive Experience

* 💬 Conversational chatbot
* ❓ FAQ suggestions
* 🧠 Quick quizzes
* ✅ “What should I do next?” recommendations

### 4. Timelines & Key Dates

* Election schedules
* Registration deadlines
* Voting day reminders

### 5. Beginner-Friendly Design

* Simple language
* No prior knowledge required
* No sign-up needed

---

## 🏗️ High-Level Architecture

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

| Feature             | Description                    |
| ------------------- | ------------------------------ |
| Chat Assistant      | Conversational UI for queries  |
| Lifecycle Explorer  | Step-by-step election phases   |
| Eligibility Checker | Determines if user can vote    |
| ID Guidance         | Required documents per country |
| Timeline Viewer     | Key dates & deadlines          |
| Quick Quiz          | Reinforces user understanding  |
| Next-Step Engine    | Personalized guidance          |

---

## 💬 Sample Conversation Flow

**User:** How do I register to vote in India?
**ElectIQ:**

* You must be 18+ and a citizen of India
* Visit NVSP portal or submit Form 6
* Upload ID & address proof

👉 *Next options:*

* Check eligibility
* Required documents
* Track application

---

**User:** What should I do next?
**ElectIQ:**

* Verify your voter ID status
* Note your polling station
* Check election date

---

## 🖥️ UI/UX Design (Wireframe Description)

### Layout Structure

```
┌──────────────────────────────────────────────┐
│ Sidebar                                     │
│-------------------------------------------- │
│ • Ask Anything                              │
│ • Election Lifecycle                        │
│ • Key Dates                                 │
│ • Quick Quiz                                │
│ • What's Next                               │
│-------------------------------------------- │
│ Country Selector                            │
│ Language Selector                           │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ Main Chat Panel                             │
│-------------------------------------------- │
│ AI Response Card                            │
│ - Explanation                               │
│ - Suggested Questions (buttons)             │
│                                            │
│ User Input Box + Send Button                │
└──────────────────────────────────────────────┘
```

### Design Principles

* Minimal, distraction-free UI
* Button-based suggestions for guidance
* Accessible typography and contrast
* Mobile-responsive layout

---

## ⚙️ Tech Stack

### Frontend

* **React + Vite**
* TypeScript
* Tailwind CSS (or similar UI framework)

### Backend / Logic

* Node.js / Python (optional)
* Rule-based system or LLM integration
* REST APIs for election data

### Data Layer

* JSON / TSV structured datasets
* Government election APIs (if available)

### Deployment

* Vercel / Netlify (Frontend)
* Google Cloud Run / Render (Backend)

---

## 🔌 Modularity & Scalability

* Component-based UI architecture
* Country-specific logic modules
* Plug-and-play data sources
* Easy addition of new regions

---

## ♿ Accessibility

* Beginner-friendly language
* No login required
* Clear navigation
* Assistive UI elements

---

## 📦 Installation

```bash
# Clone repo
git clone https://github.com/sathwiksandesh/electiq.git

# Navigate
cd electiq

# Install dependencies
npm install

# Run locally
npm run dev
```

---

## 🧪 Future Enhancements

* 🌐 More countries support
* 📊 Real-time election data APIs
* 🔔 Notification system (deadlines/reminders)
* 🗣️ Voice assistant integration
* 📱 Mobile app version

---
