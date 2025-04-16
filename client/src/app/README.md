📁 *src/app* – Application Structure
This directory contains the main routing and layout logic of the Smart Budget Allocation System. Each subfolder represents a key module or feature within the application.

📦 Folder & File Structure
🔐 admin/
Contains administrative interfaces and controls for managing users, data, and platform configurations.

🔗 blockchain/
Handles blockchain integration for transparent budget tracking and verification of transactions.

📊 dashboard/
The main user dashboard displaying budget insights, spending analytics, site-wise data, and key statistics.

⚙️ opimization/
(Note: Consider renaming to optimization)
Includes logic for AI/ML-powered budget optimization and resource allocation.

🧾 participation/
Allows users or citizens to engage in participatory budgeting and provide input on fund allocations.

📑 reports/
Module for generating visual and downloadable budget reports, summaries, and analytics.

🧠 scenario/
Handles various simulation and scenario planning features for future budget forecasts and planning.

🌐 transparency/
Displays blockchain-backed records and public logs, ensuring open and auditable budget flows.

🧩 Root Files
layout.tsx
Defines the root layout for the app (e.g., shared navigation, sidebar, footers). Ensures consistent structure across routes.

page.tsx
Landing page setup or root-level route handling for the application.

globals.css
Global styles using Tailwind CSS and custom overrides for consistent theming across the app.

🛠️ Development Notes
Routing: All folders act as isolated routes as per Next.js App Router.

Styling: TailwindCSS and ShadCN components used.

Modularity: Each folder is designed to be independently scalable and maintainable.

Update Log: Last major structure update was 3 hours ago with all route folders finalized.

