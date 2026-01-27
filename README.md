# Achim – Image Sales Platform

Private image sales system for organizations with subscription-based access.

## Tech Stack
- Backend: ASP.NET Core, Entity Framework Core, SQL Server
- Frontend: React + TypeScript + Vite
- Version Control: Git + GitHub

## Features
- Organizations with subscriptions
- Secure image catalog
- Paid downloads
- Admin management panel
- API endpoints for frontend integration

## Project Structure


## Backend
- Controllers → API endpoints (auth, content, admin)
- Models → Database entities
- Data → DbContext, migrations
- Key Tables:
  - `Users` → authentication, roles
  - `Content` → images and metadata
  - `Organizations` → organization and subscription info
  - `Settings` → system configuration

## Frontend
- Pages → main pages for users and admin
- Components → reusable UI components
- Services → API calls to backend endpoints
- Routing → React Router for page navigation

## Status
- Git repository initialized
- Backend folder structured
- Frontend folder ready for React project creation
- Ready for next steps: build frontend components and connect to backend APIs
