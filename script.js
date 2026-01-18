import languagesData from './languages.js';

// DOM Elements
const entryPage = document.getElementById('entry-page');
const linksPage = document.getElementById('links-page');
const backBtn = document.getElementById('back-btn');
const linksList = document.getElementById('links-list');
const slotTitle = document.getElementById('slot-title');
const languageCards = document.querySelectorAll('.language-card');

/**
 * Handles language selection.
 * @param {string} lang 
 */
function handleLanguageSelect(lang) {
    if (!languagesData[lang]) {
        console.error('Invalid language:', lang);
        return;
    }

    renderLinks(lang, languagesData[lang]);
    switchPage('links');
    // Add history entry
    history.pushState({ page: 'links', lang: lang }, '', `#${lang}`);
}

/**
 * Renders the list of links for a specific language.
 * @param {string} lang 
 * @param {Array} links 
 */
function renderLinks(lang, links) {
    const langName = lang.toUpperCase();
    slotTitle.innerText = `${langName} PROGRAMS: DATA ACQUIRED`;
    linksList.innerHTML = ''; // Clear previous

    links.forEach((link, index) => {
        const li = document.createElement('li');
        // Use title if available, otherwise use the URL as the text
        const displayText = link.title ? link.title : link.url;

        // Removed target="_blank" to open in same tab
        li.innerHTML = `
            <a href="${link.url}" target="_self">
                <span class="prefix">OP_CODE_${(index + 1).toString().padStart(2, '0')} >></span> 
                ${displayText}
            </a>
        `;
        // Add staggered animation delay
        li.style.animation = `scan 0.5s ease-out ${index * 0.05}s backwards`;
        linksList.appendChild(li);
    });
}

/**
 * Switches the visible page.
 * @param {string} page 'entry' or 'links'
 */
function switchPage(page) {
    if (page === 'links') {
        entryPage.classList.remove('active');
        entryPage.classList.add('hidden');
        linksPage.classList.remove('hidden');
        linksPage.classList.add('active');
    } else {
        linksPage.classList.remove('active');
        linksPage.classList.add('hidden');
        entryPage.classList.remove('hidden');
        entryPage.classList.add('active');
        // Reset URL hash when going back to entry
        if (location.hash) {
            history.replaceState({ page: 'entry' }, '', ' ');
        }
    }
}

// Event Listeners
languageCards.forEach(card => {
    card.addEventListener('click', () => {
        const lang = card.getAttribute('data-lang');
        handleLanguageSelect(lang);
    });
});

if (backBtn) {
    backBtn.addEventListener('click', () => {
        switchPage('entry');
        history.pushState({ page: 'entry' }, '', ' ');
    });
}

// Handle Browser Back Button
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.page === 'links') {
        // Correctly re-render if we are going forward to a link state
        if (event.state.lang) {
            renderLinks(event.state.lang, languagesData[event.state.lang]);
            switchPage('links');
        }
    } else {
        // Default to entry page
        switchPage('entry');
    }
});

// Handle Initial Load with Hash
function initHash() {
    const hash = location.hash.replace('#', '');
    if (hash && languagesData[hash]) {
        renderLinks(hash, languagesData[hash]);
        switchPage('links');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHash);
} else {
    initHash();
}

/* --- DEBUG / HACKING UI LOGIC (RETAINED BUT MODIFIED IF NEEDED) --- */
const debugPanel = document.getElementById('debug-panel');
const slotGrid = document.getElementById('slot-grid');

// Toggle Debug Panel with Backtick (`)
document.addEventListener('keydown', (e) => {
    if (e.key === '`') {
        toggleDebugPanel();
    }
});

function toggleDebugPanel() {
    if (debugPanel) {
        debugPanel.classList.toggle('hidden');
    }
}
