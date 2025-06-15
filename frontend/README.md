# PolkaGuard-Council Frontend

A modern React-based web interface for the PolkaGuard-Council decentralized security auditing platform. This frontend provides an intuitive interface for auditors, token holders, and council members to interact with the PolkaGuard smart contracts.

## 🚀 Quick Start

```sh
# Step 1: Navigate to the frontend directory
cd frontend

# Step 2: Install dependencies
npm install

# Step 3: Start the development server
npm run dev

# Step 4: Open your browser and visit http://localhost:5173
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
│   ├── Index.tsx       # Landing/Dashboard page
│   ├── ProofUpload.tsx # Proof submission interface
│   ├── Council.tsx     # DAO voting interface
│   ├── Vault.tsx       # Bounty vault management
│   └── Profile.tsx     # User profile and wallet
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
└── App.tsx             # Main application component
```

## 🛠️ Technologies

This project is built with modern web technologies:

**Core Framework:**
- **React 18** - UI library with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and dev server

**UI & Styling:**
- **shadcn/ui** - Beautiful, accessible component library
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful icon library

**State Management & Data:**
- **TanStack Query** - Server state management and caching
- **React Hook Form** - Performant form handling
- **Zod** - Schema validation

**Routing & Navigation:**
- **React Router DOM** - Client-side routing

**Additional Features:**
- **Recharts** - Chart and data visualization
- **Date-fns** - Date utility library
- **Sonner** - Toast notifications

## 🔐 PolkaGuard Features

### For Security Auditors
- **Proof Upload**: Submit zero-knowledge proofs of exploits
- **Claim Bounties**: Claim rewards for approved proofs
- **Track Submissions**: Monitor proof verification status

### For Token Holders
- **DAO Voting**: Vote on proof approvals using governance tokens
- **Proposal Creation**: Create proposals for proof verification
- **Stake Management**: Manage token stakes for voting power

### For Council Members
- **Proof Verification**: Review and verify submitted proofs
- **Bounty Administration**: Manage bounty pools and payouts
- **System Oversight**: Monitor overall platform health

## 🏗️ Available Scripts

```sh
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## 🌐 Environment Setup

Create a `.env.local` file in the frontend directory:

```env
# Polkadot Network Configuration
VITE_POLKADOT_RPC_URL=ws://localhost:9944
VITE_NETWORK_NAME=development

# Contract Addresses (update with deployed addresses)
VITE_TOKEN_CONTRACT_ADDRESS=
VITE_DAO_CONTRACT_ADDRESS=
VITE_REGISTRY_CONTRACT_ADDRESS=
VITE_VAULT_CONTRACT_ADDRESS=
```

## 🔌 Smart Contract Integration

The frontend interacts with four main smart contracts:

1. **PolkaGuardToken** - Governance token for voting
2. **BountyDAO** - Decentralized voting mechanism
3. **ExploitProofRegistry** - Proof submission and verification
4. **BountyVault** - Bounty fund management

## 📱 Pages Overview

- **Dashboard (/)** - Overview of platform activity and user stats
- **Proof Upload (/upload)** - Interface for submitting exploit proofs
- **Council (/council)** - DAO voting interface and proposal management
- **Vault (/vault)** - Bounty pool status and fund management
- **Profile (/profile)** - User wallet connection and account details

## 🎨 UI Components

Built with shadcn/ui components including:
- Forms with validation
- Data tables and charts
- Modal dialogs
- Toast notifications
- Loading states
- Responsive navigation

## 🔧 Development

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Polkadot wallet extension (for testing)

### Local Development
1. Ensure the smart contracts are deployed locally
2. Update contract addresses in `.env.local`
3. Install dependencies: `npm install`
4. Start dev server: `npm run dev`
5. Connect your Polkadot wallet to interact with contracts

## 🚀 Deployment

```sh
# Build for production
npm run build

# The dist/ folder contains the built application
# Deploy the contents to your web server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

*Part of the PolkaGuard-Council decentralized security platform*
