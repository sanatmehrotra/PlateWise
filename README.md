# PlateWise App

**PlateWise App** is a real-time platform connecting restaurants with NGOs to efficiently redistribute surplus food. The app reduces food waste, ensures transparency, and empowers communities by providing instant matching between surplus food offers and organizations in need.

---

## Table of Contents
1. [Why This Project](#why-this-project)
2. [Problem Statement](#problem-statement)
3. [End Goals](#end-goals)
4. [Target Audience](#target-audience)
5. [Scope & Limitations](#scope--limitations)
6. [Features](#features)
7. [Tech Stack](#tech-stack)
8. [Firestore Schema](#firestore-schema)
9. [Screenshots](#screenshots)
10. [Installation](#installation)
11. [Usage](#usage)
12. [Future Enhancements](#future-enhancements)
13. [Contributors](#contributors)

---

## Why This Project
Food waste is a major issue worldwide. Restaurants often have surplus food that goes unused due to lack of efficient, real-time coordination with NGOs and volunteer organizations. Traditional methods of contacting NGOs (phone calls, emails) are slow and unreliable, causing missed opportunities to feed those in need. PlateWise App addresses this by providing a **centralized, real-time platform** that instantly connects restaurants and NGOs, ensuring food reaches communities efficiently.

---

## Problem Statement
- Restaurants have surplus food at unpredictable times.  
- NGOs often miss donation opportunities due to lack of awareness or real-time updates.  
- Manual coordination is inefficient and can lead to food spoilage or waste.  
- There is no simple, scalable solution currently available that bridges restaurants and NGOs instantly.

---

## End Goals
- Minimize food waste by enabling restaurants to donate surplus food quickly.  
- Provide NGOs with instant visibility of available food donations.  
- Ensure accountability and transparency through real-time tracking of requests.  
- Create a scalable platform that could be extended to other community aid services in the future.

---

## Target Audience
- **Primary:** Restaurants looking to donate surplus food.  
- **Secondary:** NGOs and volunteer organizations that distribute food to needy communities.  
- **Tertiary (Future Scope):** Communities in need, volunteers, and civic organizations looking for streamlined aid coordination.

---

## Scope & Limitations
- **In Scope:**  
  - Real-time posting of food requests by restaurants.  
  - NGO dashboard to accept and complete requests.  
  - Role-based authentication and routing.  
  - Tracking status of each request (open → accepted → completed).  
- **Out of Scope (MVP):**  
  - Food delivery logistics or transportation coordination.  
  - Multi-city scaling or AI optimization (can be added later).  
  - Incentive or reward system for users (future enhancement).

---

## Features
- **Authentication:** Google Auth login and email/password signup with role selection.  
- **Restaurant Dashboard:**  
  - Create surplus food requests with description, quantity, and location.  
  - Track request status: Open → Accepted → Completed.  
  - Close requests manually if needed.  
- **NGO Dashboard:**  
  - View open requests filtered by proximity.  
  - Accept requests and mark them completed.  
  - Real-time updates for new requests.  
- **Role-based Routing:** Redirect users based on role after signup/login.  
- **Real-time Firestore Integration:** Instant updates for request creation, acceptance, and completion.  

---

## Tech Stack
- **Frontend:** Firebase Studio / React / Next.js  
- **Backend & Database:** Firebase Auth + Firestore  
- **AI Integration:** Gemini API (for future smart suggestions)  
