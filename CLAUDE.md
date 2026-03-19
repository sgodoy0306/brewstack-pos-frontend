# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Project Context
You are an expert React Native and Tailwind CSS developer. You are building the frontend of a Point of Sale (POS) system for a coffee shop, designed exclusively for tablets in Landscape orientation.

# Tech Stack
- **Framework:** React Native (Expo recommended).
- **Styling:** Tailwind CSS (via NativeWind or twrnc).
- **Navigation:** React Navigation.
- **State Management:** Zustand or Context API for the cart.

# UI/UX Conventions (Critical for the Environment)
- **Bar-optimized Design:** Touch areas must be massive (minimum 60px). Assume the hands operating the tablet might be dealing with milk pitchers for latte art or coffee grounds; the UI must be error-proof for fast-paced tapping.
- **Landscape Layout:** Lock the app orientation to Landscape. Divide the screen strictly: ~70% for the product catalog grid and ~30% for the fixed cart/ticket on the right.
- **Tailwind in RN:** Use Tailwind classes declaratively. Avoid complex nested styles and favor reusable UI components (e.g., `<PosButton className="bg-blue-500 p-6 rounded-xl" />`).
- **Tactile Feedback:** Every button must provide immediate visual feedback when pressed (use `TouchableOpacity` or `Pressable` with opacity/color changes) to confirm the action in a fast-paced environment.

# Code & Logic Conventions
- **Financial Precision:** When handling prices, taxes, and cart totals, calculations must be exact. To avoid JavaScript floating-point errors, handle monetary values with the highest precision (ensuring rigorous accuracy, equivalent to using `double` types in languages like Java or C). Consider handling everything in cents (integers) and formatting only on the view layer.
- **Functional Components:** Always use functional components and Hooks. Keep components small and modular.
- **Logic Separation:** Separate the cart calculation logic (adding/removing items, modifying espresso shots or milk types) from the view components. Use custom hooks (e.g., `useCart`).
- **Performance:** To render the product catalog or the ticket history, strictly use `FlatList` with `keyExtractor` and `memo` if necessary, preventing frame drops on low-end tablets.

# Rules of Interaction with Claude
- When generating new code, output ONLY the modified or newly created files.
- Prioritize native solutions over installing unnecessary third-party libraries that bloat the bundle size.
- Do not alter the general layout (70/30 split) unless explicitly requested.

## Language & Communication Policy
- **Conversation:** Always respond to my prompts, explain concepts in **Spanish**.
- **Code:** All generated code, including class names, variables, methods, database columns, and inline comments, must be strictly in **English**.

## Git Management

**Commits** Never do a commit, you can give advise but dont do a commit
