# VTT-AI Optimizer & Metrics Hub 🚀

A high-performance hybrid monorepo designed for processing VTT (WebVTT) and text files, optimizing them for LLMs, and calculating speaking metrics. Built with a "Weightless" architecture optimized for **Vercel** and orchestrated by **Turborepo**.

## 🏗️ Project Architecture

This project follows the `vercel-monorepository-structure` pattern, ensuring seamless coexistence of a React frontend and a FastAPI backend.

```text
.
├── apps/
│   ├── frontend/       # React + Vite + Tailwind CSS
│   └── backend/        # FastAPI (Python)
├── packages/           # Shared logic (future growth)
├── vercel.json         # Global routing (routes /api/* to backend)
├── package.json        # Root workspace manifest
└── turbo.json          # Pipeline orchestration
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **Python** (3.9+)
- **npm** or **pnpm**

### 🛠️ Local Development

You can launch both the frontend and backend concurrently from the root directory using Turborepo.

1.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

2.  **Setup Backend Environment:**
    Navigate to the backend directory to set up your Python environment:
    ```bash
    cd apps/backend
    python -m venv venv
    # Windows
    .\venv\Scripts\activate
    # Unix/macOS
    source venv/bin/activate
    pip install -r requirements.txt
    cd ../..
    ```

3.  **Launch the Project:**
    Run the following command from the root to start both apps:
    ```bash
    npm run dev
    ```
    - **Frontend:** [http://localhost:5173](http://localhost:5173)
    - **Backend API:** [http://localhost:8000](http://localhost:8000) (Proxied via `/api` on the frontend)

### 🔌 API Routing & Proxy
- **During Development:** Vite is configured in `apps/frontend/vite.config.ts` to proxy any requests starting with `/api` to `http://localhost:8000`.
- **In Production (Vercel):** `vercel.json` handles the routing, ensuring `/api/*` requests reach the FastAPI entry point at `apps/backend/index.py`.

## 🧪 Testing

Run linting or tests across the whole monorepo:
```bash
npm run lint
# or
turbo run test
```

## 📄 License
MIT
