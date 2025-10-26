# **Project Specification: GymApp**

Document Version: 1.3

Date: 24/10/2025

### **1\. Project Overview**

GymApp is envisioned as a comprehensive gym membership application with a strong social media component. The ultimate goal is a platform that serves as a B2B Software-as-a-Service (SaaS) solution for gyms of any size, with end-user applications for web, iOS, and Android.

The platform will be built on a flexible, modular architecture to accommodate different gym business models, from small studios to large multi-location facilities.

This document is divided into two parts:

* **Part 1:** Defines the scope for the initial **Proof of Concept (PoC)**.  
* **Part 2:** Outlines the high-level vision for the **Full Product**, including core architectural and feature concepts.

## **Part 1: Proof of Concept (PoC) Scope**

### **2.1. PoC Objectives**

The primary goals of this PoC are to:

* Validate the technical feasibility of the core booking and scheduling workflow.  
* Test the user experience for both members (booking) and admins (management).  
* Demonstrate the value of integrated social and program-selection features using a privacy-first model.  
* Provide a functional model to gather early user feedback before committing to full-scale development.

### **2.2. Target Audience (PoC)**

This PoC will have two primary user roles with a simple, hard-coded setup:

* **Gym Member (User):** The end-user who needs to view schedules, book sessions, and interact with their personal program and friends list.  
* **Gym Administration (Admin/Coach):** Gym staff, coaches, and managers who need to create schedules, manage class rosters, and oversee member programs.

### **2.3. PoC Key Features (In Scope)**

#### **2.3.1. Admin Role (Gym Management / Coaches)**

* **Schedule Management:** Admins must be able to upload, create, edit, and delete class/session schedules.  
* **Class Roster View:** Admins can select any session from the schedule and see a list of all members who are booked into it.  
* **Program Creation:** Admins have a simple interface to create basic programs (e.g., "Strength Day A," "Cardio Focus") and assign them to specific members.

#### **2.3.2. Member Role (User)**

* **View & Book Schedule:** Users can view the live schedule of available classes and sessions.  
* **Booking & Cancellation:** Users can book themselves into a session. This action will register their attendance. Users can also cancel their bookings ("book off").  
* **Program Selection at Booking:** When a user books a session, they will be prompted to select which program they intend to follow. The options will include:  
  * The generic session program (default).  
  * Any specific personal programs assigned to them by a coach.  
* **Social View (Friends) \- Privacy-First Model:**  
  * **User Identifier:** Each user will be assigned a unique, non-personal "Friend ID" or "GymTag" (e.g., FitnessFan72). This is the *only* identifier used for social features. Real names and emails are never searchable.  
  * **Add Friend:** The "Add Friend" feature will *only* allow searching by this exact "Friend ID." Users must share their ID with friends outside of the app (e.g., via text).  
  * **Double Opt-In:**  
    1. User A searches for User B's Friend ID and sends a request.  
    2. User B receives a notification and must explicitly "Accept" or "Deny" the request.  
  * **Activity Sharing:** *After* a friendship is confirmed, and *only if* both users have toggled on the "Share my gym activity" setting, they will be able to see which sessions their friends are booked into on the main schedule.

## **Part 2: Full Product Vision (Future Scope)**

This section outlines the core concepts intended for the full, scalable product, which are **out of scope** for the initial PoC.

### **3.1. Core Feature: Personal Goals & Motivation**

To replace traditional, extrinsic "points schemes," the app will feature a user-centric goal-setting system. The incentive will be the user's personal satisfaction in achieving their own goals, visualized by the app.

* **User-Defined Goals:** Users will be able to set their own goals, such as:  
  * **Consistency:** "Attend the gym \[3\] times per week."  
  * **Exploration:** "Try \[2\] new class types this month (e.g., Spin, Yoga)."  
  * **Program Adherence:** "Complete my '\[Strength Day A\]' program \[5\] times this month."  
* **Automatic Tracking:** The app will automatically track progress against these goals based on the user's booking and attendance data.  
* **Meaningful Metrics:** Instead of points, the app will use **Streaks** (e.g., "You've hit your weekly goal 4 weeks in a row\! 🔥") and **Progress Bars** to provide a visual feedback loop and build positive habits.

### **3.2. Core Architecture: Modular Onboarding Engine**

To accommodate different gym types (e.g., small studios, large commercial gyms, CrossFit boxes), the platform will be built on a flexible modular architecture. The gym setup process will be an onboarding wizard where owners configure these modules for their specific business.

This engine will consist of:

* **Core Engine:** A simple, universal base that only understands Users, Sessions, and Bookings.  
* **Configurable Modules (Adaptation Layers):**  
  * **Resource Module:** To define physical assets (e.g., "Spin Room," "Squat Rack 1," "Main Studio") and staff accounts.  
  * **Service Module:** To define the gym's offerings (e.g., "Class Types" like "Yoga," "HIIT," and a custom "Exercise Library" for program building).  
  * **Membership Rules Engine:** A highly flexible module to build membership plans by combining rules for:  
    * **Payment:** Recurring, Class Pack, Pay-as-you-go.  
    * **Access (What):** "All Session Types" or specific classes.  
    * **Limits (How Many):** Unlimited credits, 10-per-month, etc.  
    * **Time (When):** Any time, or "Off-Peak Only."

### **3.3. Additional Revenue & Community Modules (Future Scope)**

#### **3.3.1. Event Management**

* A module for gyms to create, promote, and manage special events (e.g., social gatherings, workshops, competitions).  
* This will support ticket sales and registration for both existing members and **non-members**, providing a valuable community-building and revenue-generating tool.

#### **3.3.2. Merchandise / E-commerce**

* A simple e-commerce module allowing gyms to host and sell their own products.  
* This includes items like branded clothing, equipment (e.g., skipping ropes, bands), supplements, and drinks.

#### **3.3.3. Service Marketplace**

* A module to promote and potentially book "add-on" services.  
* This allows gyms to formally partner with or promote in-house providers for services like:  
  * 1-on-1 Personal Training  
  * Physiotherapy sessions  
  * Nutrition consultations  
  * Specialist coaching

### **3.4. Other Future Features (Out of Scope for PoC)**

* Native (iOS/Android) app development.  
* Full-scale web application (this PoC is a simplified version).  
* Full payment processing, billing, and membership management.  
* Exercise media library (videos, photos, custom graphics).  
* Advanced social media features (e.g., news feeds, posting, direct messaging).  
* Detailed workout logging and performance analytics.  
1. 