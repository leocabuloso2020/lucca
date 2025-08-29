# AI Rules for this Application

This document outlines the core technologies and libraries used in this project, along with guidelines for their usage. Adhering to these rules ensures consistency, maintainability, and leverages the strengths of our chosen stack.

## Tech Stack Overview

*   **Next.js:** The primary React framework for building the application, providing server-side rendering, routing, and API routes.
*   **TypeScript:** All new code should be written in TypeScript for type safety and improved developer experience.
*   **Tailwind CSS:** The utility-first CSS framework for all styling. Prioritize Tailwind classes for responsive and consistent design.
*   **Shadcn/ui:** A collection of reusable components built with Radix UI and Tailwind CSS. Use these components whenever possible for UI elements.
*   **Supabase:** Our backend-as-a-service for database, authentication, and real-time subscriptions.
*   **React Hook Form & Zod:** Used together for robust form management and validation.
*   **Lucide-React:** The icon library for all visual icons within the application.
*   **Sonner:** The preferred library for displaying toast notifications to users.
*   **Embla Carousel:** Used for creating performant and touch-friendly carousels.
*   **React Day Picker:** For date selection functionalities.

## Library Usage Guidelines

*   **React Framework:** Always use **Next.js** for page and component creation.
*   **Language:** All new code must be written in **TypeScript**.
*   **Styling:**
    *   Use **Tailwind CSS** classes for all styling. Avoid inline styles or custom CSS files unless absolutely necessary for very specific, isolated cases (e.g., global styles in `globals.css`).
    *   Leverage **Shadcn/ui** components for common UI patterns (buttons, cards, inputs, dialogs, etc.). Do not modify Shadcn/ui component files directly; if a customization is needed, create a new component that wraps or extends the Shadcn/ui component.
*   **Backend & Data:**
    *   Interact with the database and handle authentication using **Supabase**.
    *   Ensure all Supabase client interactions are done via the `supabase` instance from `lib/supabase/client.ts`.
*   **Forms & Validation:**
    *   For any forms, use **React Hook Form** for state management and submission handling.
    *   Implement schema validation using **Zod** in conjunction with React Hook Form's resolvers.
*   **Icons:** Use icons from **Lucide-React**.
*   **Notifications:** For user feedback and notifications, use **Sonner** for toasts.
*   **Carousels:** Implement carousels using **Embla Carousel**.
*   **Date Pickers:** Use **React Day Picker** for any date input fields.
*   **State Management:** For local component state, use React's `useState` and `useReducer` hooks. For global state, consider React Context API if needed, but keep it minimal.
*   **Utility Functions:** Place general utility functions in `lib/utils.ts`.
*   **Hooks:** Custom hooks should reside in the `hooks/` directory.
*   **File Structure:**
    *   Pages go into `app/` (Next.js convention).
    *   Reusable UI components go into `components/`.
    *   Utility functions go into `lib/`.
    *   Custom hooks go into `hooks/`.