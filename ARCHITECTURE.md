# AcadeMetrics | Platform Architecture & Flow

AcadeMetrics is a unified educational evaluation platform designed to streamline the assessment lifecycle. This document outlines the core functional flows and system architecture.

## 1. High-Level System Workflow

This diagram illustrates the end-to-end journey from exam creation to result analysis.

```mermaid
graph TD
    subgraph Faculty_Actions [Faculty Portal]
        A[Create Subject] --> B[Create Exam]
        B --> C[Draft Questions/Coding Problems]
        C --> D[Deploy & Publish Exam]
        D --> E[Share Exam Code]
    end

    subgraph Student_Actions [Student Portal]
        F[Join Exam via Code] --> G[Access Study Materials]
        G --> H[Take Assessment]
        H --> I[Submit Answers/Code]
    end

    subgraph System_Processing [Automated Backend]
        I --> J{Auto-Grading Engine}
        J -->|MCQ| K[Calculate Score]
        J -->|Coding| L[Run Test Cases]
        K --> M[Store Results]
        L --> M
    end

    subgraph Feedback_Loop [Finalization]
        M --> N[Faculty: Review Submissions]
        N --> O[Faculty: Publish Results]
        O --> P[Student: View Performance Analytics]
    end

    E -.-> F
    P -.-> A
```

## 2. Component Architecture

The platform is built with a modern, decoupled architecture to ensure scalability and real-time synchronization.

```mermaid
graph LR
    subgraph Frontend [Next.js 15 App]
        UI[Tailwind CSS UI]
        FC[Faculty Context]
        SC[Student Context]
        AC[Auth Context]
    end

    subgraph Data_Layer [Data & Persistence]
        MS[(Mock Store / LocalStorage)]
        FB[(Firebase Firestore)]
        IS{IS_MOCK?}
    end

    subgraph Execution_Engine [Code Evaluation]
        P[Piston API / Node VM]
    end

    UI <--> FC
    UI <--> SC
    UI <--> AC

    FC <--> IS
    SC <--> IS
    AC <--> IS

    IS <-->|true| MS
    IS <-->|false| FB

    SC <--> Execution_Engine
```

## 3. Key Feature Modules

### 👨‍🏫 Faculty Module
- **Exam Management**: Build complex assessments with MCQ or Coding questions.
- **Material Distribution**: Upload and share study notes and academic resources.
- **Announcement System**: Push real-time notifications to the entire student body.
- **Gradebook**: Centralized view of all student submissions and performance metrics.

### 👨‍🎓 Student Module
- **Live Assessment**: Secure environment for taking exams with auto-save functionality.
- **Coding Environment**: Built-in IDE for solving algorithmic challenges with real-time test case feedback.
- **Result Dashboard**: Detailed breakdown of scores once published by faculty.
- **Performance Tracking**: Visual analytics showing growth across different subjects.

## 4. Technical Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Database**: Firebase Firestore (with high-fidelity Mock Mode for demo persistence)
- **Deployment**: Vercel
