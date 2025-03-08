# Web3 Compliance Platform

A comprehensive compliance platform that simplifies regulatory processes for crypto ecosystem participants through intelligent registration and tracking tools.

## Features

- 🔐 Web3 Authentication
- 📝 Dynamic Form Handling
- 🏦 PostgreSQL Database Integration
- 👥 Role-based Admin Dashboard
- 📋 Multi-form Registration for:
  - DeFi Protocols
  - NFT Marketplaces
  - Crypto Funds
  - Exchanges
  - Stablecoins
- 🛡️ Enhanced Security with:
  - Rate Limiting
  - CSP Headers
  - Input Validation
  - Session Management
- 📱 Responsive Design
- 🔍 Interactive Compliance Terms
- 📊 Data Export Capabilities

## Tech Stack

- TypeScript + React
- Express.js Backend 
- PostgreSQL Database
- Drizzle ORM
- TanStack Query
- Shadcn/ui Components
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/web3-compliance-platform.git
cd web3-compliance-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```
DATABASE_URL=postgresql://...
SESSION_SECRET=your-secret-key
VITE_NEWS_API_KEY=your-api-key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Database Configuration

Before running the application, ensure you have a PostgreSQL database set up.  The `DATABASE_URL` environment variable in your `.env` file should point to your database.  This variable should follow the format:

```
postgresql://<username>:<password>@<host>:<port>/<database_name>
```

Replace the placeholders with your actual credentials.  If you're using a cloud-based PostgreSQL service, refer to their documentation for the correct connection string.  The application uses Drizzle ORM for database interactions; therefore, ensure the database schema (defined in `shared/schema.ts`) is correctly set up.


## Project Structure

```
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── lib/          # Utility functions and hooks
│   │   └── pages/        # Page components
├── server/               # Backend Express application
│   ├── routes.ts        # API routes
│   ├── auth.ts          # Authentication logic
│   └── storage.ts       # Database operations
└── shared/              # Shared TypeScript types and schemas
    └── schema.ts        # Database schema and types
```

## Security Features

- Rate limiting on API endpoints
- Content Security Policy (CSP) headers
- Session management with secure cookies
- Input validation and sanitization
- Password strength requirements
- SQL injection prevention
- CSRF protection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.