# **Project Blueprint: Full-View Switch Checklist**

## **1. Overview**

This project is a persistent checklist application that automatically resets daily. It uses `localStorage` to save user input and confirmation statuses, ensuring data is not lost on page reload. At midnight, all confirmations are cleared, but the checklist text remains for the new day.

## **2. Application Flow & Structure**

- **`index.html`**: Contains the HTML structure for input and confirmation views.
- **`style.css`**: Provides all styling for the application.
- **`main.js`**: Manages all application logic:
    - **State Management**: Handles saving and loading data to/from `localStorage`.
    - **Daily Reset**: Checks the date on load and resets confirmation statuses if it's a new day.
    - **View Switching**: Toggles visibility between the input and confirmation screens.
    - **Date Injection**: Displays the current date in both views.

## **3. Design and Features**

### **3.1. Visual Design**

- **Full-View Switch**: Clear, stateful transitions between the two main views.
- **Distinct Confirmation Screen**: A unique background color for the confirmation view.

### **3.2. Core Features**

1.  **Automatic Daily Reset**: At midnight, all "확인완료" statuses are automatically reset to their initial state. The checklist text is preserved.
2.  **Data Persistence**: User input and confirmation statuses are saved in `localStorage`, so they persist between browser sessions.
3.  **Consistent Date Display**: The current date is shown on both screens.
4.  **Dynamic Confirmation View**: The confirmation screen is built from the saved state.
5.  **Individual Confirmation**: Items can be marked as "확인완료", and this status is saved.

## **4. Implementation Plan**

1.  **Update `main.js`**: (In Progress)
    - **Create `saveState()` and `loadState()`**: Implement functions to manage data in `localStorage`.
    - **Implement Daily Reset Logic**: In `loadState()`, compare the saved date with the current date. If it's a new day, map over the saved items and set `confirmed: false` for all of them before updating the UI.
    - **Refactor Event Handlers**: Update all event listeners (text input, confirm button clicks) to use the new state management functions, ensuring the UI and `localStorage` are always in sync.
    - **Initial Load**: Call `loadState()` when the DOM is loaded to initialize the application with the correct data.
2.  **`index.html` & `style.css`**: (Completed) No changes needed.
