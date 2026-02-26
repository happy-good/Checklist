document.addEventListener('DOMContentLoaded', () => {
    const AppState = {
        key: 'checklistState',

        // 1. GET state from localStorage
        getState: function() {
            try {
                const stored = localStorage.getItem(this.key);
                if (stored) {
                    return JSON.parse(stored);
                }
            } catch (error) {
                console.error("Error reading state from localStorage:", error);
            }
            // Default state if nothing is stored
            return {
                savedDate: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
                items: Array(7).fill({ text: '', confirmed: false })
            };
        },

        // 2. SAVE state to localStorage
        saveState: function(state) {
            try {
                localStorage.setItem(this.key, JSON.stringify(state));
            } catch (error) {
                console.error("Error saving state to localStorage:", error);
            }
        }
    };

    // --- DOM Elements ---
    const inputViewContainer = document.getElementById('input-view-container');
    const confirmationViewContainer = document.getElementById('confirmation-view-container');
    const backToEditBtn = document.getElementById('back-to-edit-btn');
    const userInputs = document.querySelectorAll('.user-input');
    const confirmationList = document.getElementById('confirmation-list');
    const currentDateElement = document.getElementById('current-date');
    const confirmationDateElement = document.getElementById('confirmation-date');

    // --- Main Render Function ---
    function render(state) {
        // Render input view
        state.items.forEach((item, index) => {
            if (userInputs[index]) {
                userInputs[index].value = item.text;
            }
        });

        // Render confirmation view
        confirmationList.innerHTML = '';
        const filledItems = state.items.filter(item => item.text.trim() !== '');

        if (filledItems.length === 0) return;

        filledItems.forEach((item, originalIndex) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'confirmation-item';

            const button = document.createElement('button');
            button.className = 'confirm-btn';
            button.textContent = item.text;
            button.classList.toggle('hidden', item.confirmed);

            const status = document.createElement('span');
            status.className = 'status-text';
            status.textContent = '확인완료';
            status.classList.toggle('hidden', !item.confirmed);

            // Event listener to update state on click
            button.addEventListener('click', () => {
                 // Find the correct index in the original array
                const masterIndex = state.items.findIndex(i => i.text === item.text && !i.confirmed);
                if (masterIndex !== -1) {
                    const newState = AppState.getState();
                    newState.items[masterIndex].confirmed = true;
                    AppState.saveState(newState);
                    render(newState); // Re-render the UI
                }
            });

            itemDiv.appendChild(button);
            itemDiv.appendChild(status);
            confirmationList.appendChild(itemDiv);
        });
    }

    // --- Initialization and Daily Reset ---
    function initialize() {
        const today = new Date().toISOString().slice(0, 10);
        let state = AppState.getState();

        // Check if the saved date is not today
        if (state.savedDate !== today) {
            // It's a new day! Reset confirmations but keep the text.
            state.items = state.items.map(item => ({ ...item, confirmed: false }));
            state.savedDate = today; // Update the date
            AppState.saveState(state);
        }

        // Display dates
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = new Date(today).toLocaleDateString('ko-KR', dateOptions);
        currentDateElement.textContent = dateString;
        confirmationDateElement.textContent = dateString;

        // Initial render
        render(state);
    }

    // --- Event Listeners ---

    // Switch to confirmation view
    function switchToConfirmView() {
        const state = AppState.getState();
        const hasInput = state.items.some(item => item.text.trim() !== '');
        if (hasInput) {
            render(state);
            inputViewContainer.classList.add('hidden');
            confirmationViewContainer.classList.remove('hidden');
        }
    }

    // Switch back to input view
    backToEditBtn.addEventListener('click', () => {
        confirmationViewContainer.classList.add('hidden');
        inputViewContainer.classList.remove('hidden');
    });

    // Save state on input change
    userInputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            const newState = AppState.getState();
            newState.items[index].text = input.value;
            AppState.saveState(newState);
        });

        // Handle Enter key
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (index < userInputs.length - 1) {
                    userInputs[index + 1].focus();
                } else {
                    switchToConfirmView();
                }
            }
        });
    });

    // --- START THE APP ---
    initialize();
});
