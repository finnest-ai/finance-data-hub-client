# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Finance Data Hub Client is a Next.js application for managing digital certificates (공동인증서) to collect financial data including bank accounts, tax invoices, and corporate card details. The application is built with @finnest-ai/ui-framework and provides a complete certificate management workflow.

## Tech Stack

- Next.js 16.0.1 (App Router)
- React 19.2.0
- TypeScript 5
- Tailwind CSS 4
- @finnest-ai/ui-framework ^0.1.20

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture

### Component Structure

All UI components are located in `components/` directory and use "use client" directive. The main components are:

- **ClientSelector**: Dropdown card for selecting clients
- **CertificateUpload**: Handles certificate file (.pfx, .p12) and password upload
- **AccountSelectModal**: Modal for selecting multiple accounts to link with a certificate
- **AccountList**: Displays linked and unlinked accounts with expandable details
- **CertificateList**: Shows certificates with expiry warnings and linked accounts

### Type System

Core types are defined in [components/types.ts](components/types.ts):
- `Client`: Customer/client information
- `Certificate`: Digital certificate with linked accounts
- `Account`: Bank account information
- `CertificateUploadData`: Certificate upload payload

### Data Flow

The application follows a client-side state management pattern with sample data in [app/page.tsx](app/page.tsx). Key workflows:

1. **Client Selection**: User selects a client → filters visible certificates and accounts
2. **Certificate Upload**: File + password → API call → open account selection modal
3. **Account Linking**: Select accounts from modal → update both accounts and certificate states
4. **Certificate Deletion**: Remove certificate → unlink associated accounts

### Layout Configuration

The app uses `DefaultLayout` from @finnest-ai/ui-framework with specific props:
- `verticalAlign="start"`: Aligns content to top (not center)
- `maxWidth="4xl"`: Uses wider layout for 2-column grid
- `showHeader`: Displays header with authentication

### UI Patterns

**Client Selector**: Implemented as a single dropdown card button. Shows placeholder text "고객사를 선택하세요" when no client is selected, otherwise displays selected client details. Clicking opens dropdown list with all clients.

**Account Selection Modal**: All available accounts are pre-selected by default using `useEffect` when modal opens. Only shows accounts not already linked to other certificates.

**Sample Data Pattern**: Components currently use sample data with TODO comments marking where API calls should be integrated. Maintain this pattern when adding new features.

## Path Aliases

TypeScript is configured with `@/*` alias mapping to root directory. Use this for imports:

```typescript
import { ClientSelector } from "@/components";
```

## Important Notes

- All components must use "use client" directive for Next.js App Router
- Certificate passwords are handled client-side (TODO: implement secure API integration)
- Account balance and transaction data use Korean won (원) formatting
- UI text is in Korean (ko-KR)
- The app requires authentication via @finnest-ai/ui-framework's AuthGuard
