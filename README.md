# 💳 SmartWallet AI — Intelligent Personal Finance Manager

SmartWallet AI is an AI-driven personal finance tracker and smart expense manager. It helps users track transactions, visualize spending habits, and optimize daily savings using automated AI categorization and real-time financial insights.

![SmartWallet AI Banner](https://via.placeholder.com/1200x600?text=SmartWallet+AI+Dashboard+Preview) <!-- Replace with your project screenshot -->

---

## ✨ Key Features

- 🏷️ **AI Auto-Categorization:** Automatically parses and tags transactions (groceries, utilities, entertainment) using LLM integrations.
- 💡 **Smart Spending Insights:** AI-generated monthly breakdown reports that detect unusual spending spikes and subscription redundancies.
- 📊 **Visual Reports & Charts:** Interactive financial charts powered by real-time aggregated data.
- 📂 **Bank Statement Import:** Upload CSV or Excel bank statements for instant automated parsing.
- 🔒 **Secure & Private:** End-to-end data security backed by JWT authentication and token rotation.
- 🎯 **Budget Tracking:** Set category-based spending limits and receive smart alerts before overspending.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, HeroUI
- **Animations & Icons:** Framer Motion, Lucide React

### **Backend & Database**
- **Runtime:** Node.js / Express.js
- **Database:** MongoDB (Mongoose)
- **AI Integration:** Google Gemini API / OpenAI API
- **Background Jobs:** Redis + BullMQ
- **Authentication:** JWT (JSON Web Tokens) with Token Rotation

---

## ⚙️ Getting Started

Follow these instructions to get a local copy of the project up and running.

### **Prerequisites**
- **Node.js** v18.0 or higher
- **MongoDB** instance (local or Atlas)
- **Redis** server (for background queue processing)
- **Gemini / OpenAI API Key**

### **Installation**

1. **Clone the repository**
   ```bash
   git clone [https://github.com/your-username/smart-wallet-ai.git](https://github.com/your-username/smart-wallet-ai.git)
   cd smart-wallet-ai
