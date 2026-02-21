import { quotes as initialQuotes } from './quotes-database.js';
import { quotes as newQuotes } from './quotes-database-new.js';

const mainElement = document.querySelector('main');
let savedUrls = [];

// A simple URL validation function
function isValidUrl(string) {
    // This regex checks for a basic domain structure.
    const pattern = new RegExp('^(https?:\/\/)?'+ // protocol
    '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
    '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
    '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
    '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
    '(\#[-a-z\d_]*)?$','i'); // fragment locator
    return !!pattern.test(string);
}

function renderEditView(urlsToEdit = ['', '', '', '', '', '']) {
    mainElement.innerHTML = `
        <h1>사이트 관리</h1>
        <form id="urlForm" novalidate>
            ${[1, 2, 3, 4, 5, 6].map(i => `
                <div class="input-group">
                    <label for="url${i}">Website ${i}</label>
                    <input type="text" id="url${i}" placeholder="example.com" value="${urlsToEdit[i - 1] || ''}">
                    <span class="message-span"></span>
                </div>
            `).join('')}
            <button type="submit" class="hidden">저장</button>
        </form>
    `;

    const form = document.getElementById('urlForm');
    const inputs = form.querySelectorAll('input[type="text"]');
    const submitButton = form.querySelector('button[type="submit"]');

    function validateAndToggleButton() {
        let allValid = true;
        let atLeastOneUrl = false;

        inputs.forEach(input => {
            const url = input.value.trim();
            const messageSpan = input.nextElementSibling;

            if (url) {
                atLeastOneUrl = true;
                if (isValidUrl(url)) {
                    messageSpan.textContent = '정상적인 주소입니다.';
                    messageSpan.className = 'message-span success';
                } else {
                    allValid = false;
                    messageSpan.textContent = '정상적인 주소가 아닙니다.';
                    messageSpan.className = 'message-span error';
                }
            } else {
                messageSpan.textContent = '';
                messageSpan.className = 'message-span';
            }
        });

        if (!atLeastOneUrl) {
            allValid = false;
        }

        if (allValid) {
            submitButton.classList.remove('hidden');
        } else {
            submitButton.classList.add('hidden');
        }
    }

    inputs.forEach(input => {
        input.addEventListener('input', validateAndToggleButton);
    });

    form.addEventListener('submit', handleFormSubmit);

    // Initial validation check
    validateAndToggleButton();
}

function renderLinksView(urls) {
    mainElement.innerHTML = `
        <div class="header-container">
            <h1>사이트 관리</h1>
        </div>
    `;

    const linkContainer = document.createElement('div');
    linkContainer.className = 'link-container';

    urls.forEach(url => {
        if (!url) return;
        const link = document.createElement('a');
        link.className = 'url-button';

        let fullUrl = url;
        if (!/^https?:/i.test(fullUrl)) {
            fullUrl = 'https://' + fullUrl;
        }
        link.href = fullUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        try {
            const urlObject = new URL(fullUrl);
            link.textContent = urlObject.hostname.replace(/^www\./, '');
        } catch (e) {
            link.textContent = url.substring(0, 30);
        }

        linkContainer.appendChild(link);
    });

    mainElement.appendChild(linkContainer);

    const editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.textContent = 'Edit';
    mainElement.appendChild(editButton);

    editButton.addEventListener('click', () => {
        renderEditView(savedUrls);
    });
}

function handleFormSubmit(event) {
    event.preventDefault();
    savedUrls = Array.from(document.querySelectorAll('#urlForm input')).map(input => input.value.trim()).filter(url => url !== '');
    renderLinksView(savedUrls);
}

function showDailyThought() {
    const thoughtContainer = document.getElementById('daily-thought-container');
    
    let currentDatabaseName = localStorage.getItem('currentQuoteDB') || 'initial';
    let usedQuotes = JSON.parse(localStorage.getItem('usedQuotes')) || [];
    
    let currentQuotes = (currentDatabaseName === 'initial') ? initialQuotes : newQuotes;
    let availableQuotes = currentQuotes.filter(q => !usedQuotes.includes(q));

    if (availableQuotes.length === 0) {
        // Switch databases
        if (currentDatabaseName === 'initial') {
            currentDatabaseName = 'new';
            currentQuotes = newQuotes;
        } else {
            currentDatabaseName = 'initial';
            currentQuotes = initialQuotes;
        }

        usedQuotes = [];
        localStorage.setItem('currentQuoteDB', currentDatabaseName);
        localStorage.setItem('usedQuotes', JSON.stringify(usedQuotes));
        availableQuotes = currentQuotes;
    }

    const randomIndex = Math.floor(Math.random() * availableQuotes.length);
    const quote = availableQuotes[randomIndex];

    usedQuotes.push(quote);
    localStorage.setItem('usedQuotes', JSON.stringify(usedQuotes));

    thoughtContainer.innerHTML = `
        <h2>오늘의 긍정적인 말</h2>
        <p>${quote}</p>
    `;
}


// Initial render
renderEditView();
showDailyThought();
