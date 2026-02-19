# AI Chatbot Integration Plan

## Goal
Add an intelligent, context-aware chatbot to the POS system to guide users and assist with operations.

## User Review Required
> [!IMPORTANT]
> This implementation requires an [OpenAI API Key](https://platform.openai.com/). You will need to add `OPENAI_API_KEY` to your backend `.env` file.

## Architecture

### Backend (Node/Express)
- **Dependency**: `openai`
- **Endpoint**: `POST /api/chat/message`
- **Logic**:
    - Receive user message + current page context.
    - Send to OpenAI with a system prompt defining the bot as a "POS Assistant".
    - (Optional) Fetch relevant data (menu items, orders) if functions are called (Function Calling). *For V1, we will stick to a knowledgeable assistant.*

### Frontend (React/Vite)
- **Components**:
    - `ChatWidget`: The floating button.
    - `ChatWindow`: The message interface.
- **State**: `zustand` store `useChatStore` to manage visibility and messages.
- **Styling**: Tailwind CSS + Framer Motion for smooth animations.

## Proposed Changes

### Backend
#### [NEW] `backend/models/chat.model.js`
(Optional) Store chat history.

#### [NEW] `backend/controllers/chat.controller.js`
Handles interactions with OpenAI.

#### [NEW] `backend/routers/chat.router.js`
API routes.

#### [MODIFY] [backend/index.js](file:///f:/POS/backend/index.js)
Register the new router.

### Frontend
#### [NEW] `frontend/src/store/useChatStore.js`
Manage chat state.

#### [NEW] `frontend/src/components/chat/ChatWidget.jsx`
Floating button.

#### [NEW] `frontend/src/components/chat/ChatWindow.jsx`
Main interface.

#### [MODIFY] [frontend/src/App.jsx](file:///f:/POS/frontend/src/App.jsx)
Add the widget to the global layout.

## Verification Plan
### Automated Tests
- N/A for this feature in this phase.

### Manual Verification
1. Start backend and frontend.
2. Click the chat bubble.
3. Send a message "How do I add a menu item?".
4. Verify response mentions POS-specific context.
