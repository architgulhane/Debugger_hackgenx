🔴Smart Budget Allocation System – UI Component Library
This is a modular, reusable UI library built with React, TypeScript, and TailwindCSS, following ShadCN/UI standards. It includes components for:

➢Core UI: Buttons, inputs, forms, labels, etc.

➢Layout: Cards, drawers, sheets, scroll areas.

➢Navigation: Menus, sidebars, breadcrumbs, pagination.

➢Interaction: Dialogs, tooltips, tabs, accordions.

➢Feedback: Alerts, toast messages, progress bars.

➢Custom Inputs: Switches, sliders, OTP inputs.

➢Hooks: For toast and mobile detection.

➢Each component is structured for scalability and consistency. Built-in support for animation, accessibility, and mobile responsiveness.

How to Use

1.Installation
Make sure your project includes:
TailwindCSS
clsx, lucide-react (for icons)
ShadCN UI structure

2.Importing Components
Example: import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

3.Tailwind Setup
Your tailwind.config.js should include: content: ["./components//*.{ts,tsx}", "./app//*.{ts,tsx}"]

4.Usage
Components are designed to be modular, customizable with props, and responsive across viewports.
