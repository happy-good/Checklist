const mainElement = document.querySelector('main');
let savedUrls = [];

function renderEditView(urlsToEdit = ['', '', '']) {
    mainElement.innerHTML = `
        <h1>사이트 관리</h1>
        <form id="urlForm">
            <div class="input-group">
                <label for="url1">Website 1</label>
                <input type="text" id="url1" placeholder="example.com" value="${urlsToEdit[0] || ''}" required>
            </div>
            <div class="input-group">
                <label for="url2">Website 2</label>
                <input type="text" id="url2" placeholder="anothersite.net" value="${urlsToEdit[1] || ''}">
            </div>
            <div class="input-group">
                <label for="url3">Website 3</label>
                <input type="text" id="url3" placeholder="yetanother.org" value="${urlsToEdit[2] || ''}">
            </div>
            <button type="submit">저장</button>
        </form>
    `;

    const form = document.getElementById('urlForm');
    form.addEventListener('submit', handleFormSubmit);
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
        if (!/^https?:\/\//i.test(fullUrl)) {
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
    savedUrls = [
        document.getElementById('url1').value,
        document.getElementById('url2').value,
        document.getElementById('url3').value
    ].filter(url => url.trim() !== '');

    if (savedUrls.length > 0) {
        renderLinksView(savedUrls);
    }
}

// Initial render
renderEditView();
