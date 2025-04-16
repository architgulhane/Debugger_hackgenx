# 🧩 UI Components Library

Welcome to the **Smart Budget Allocation System – UI Component Library**, a modular and reusable set of components built using **React**, **TypeScript**, **TailwindCSS**, and **ShadCN/UI** conventions. These components power the user interface of the Smart Budget Allocation System, including the responsive `LandingPage`, dashboards, and utilities.
## 🚀 Getting Started

To get started with this UI library:

### 1. Install Dependencies

Make sure you have the following:

```bash
npm install
# or
yarn install
2. Tailwind Setup
Ensure your tailwind.config.js includes:

js
Copy
Edit
content: [
  "./components/**/*.{js,ts,jsx,tsx}",
  "./app/**/*.{js,ts,jsx,tsx}",
],
3. Importing Components
Use components directly:

tsx
Copy
Edit
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
- Highlights
- Landing Page (landing.tsx)
A modern responsive landing page using:

Framer Motion animations

TailwindCSS layout

Navigation bar

Hero section

Dashboard preview

▶ UI Components
Each file inside ui/ exports a reusable React component used across the system.


Component	Description
button.tsx	Styled button components
card.tsx	Basic card layout for content blocks
form.tsx	Form controls and validation
toast.tsx	Notification system
dialog.tsx	Modal dialogs
calendar.tsx	Date selection
avatar.tsx	User avatars
table.tsx	Responsive data tables
tabs.tsx	Tab navigation
...	And many more utility components!
All components follow accessibility best practices and responsive design.
▶ Development & Testing
You can develop components in isolation or within pages like the LandingPage. Make sure to follow:

Component-first development

Reusability and stateless logic

Consistent TailwindCSS styling

Framer Motion for animated elements (optional)


