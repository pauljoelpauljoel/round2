import slotsData from './slots.js';

// DOM Elements
const entryPage = document.getElementById('entry-page');
const linksPage = document.getElementById('links-page');
const slotInput = document.getElementById('slot-input');
const enterBtn = document.getElementById('enter-btn');
const errorMsg = document.getElementById('error-msg');
const backBtn = document.getElementById('back-btn');
const linksList = document.getElementById('links-list');
const slotTitle = document.getElementById('slot-title');

/**
 * Handles the logic for entering a slot number.
 */
function handleEnter() {
    const slotNum = parseInt(slotInput.value);

    // Validate Input
    if (!slotNum || slotNum < 1 || slotNum > 40) {
        showError();
        return;
    }

    // Retrieve Data
    const links = slotsData[slotNum];
    if (!links) {
        showError();
        return;
    }

    // Render Links
    renderLinks(slotNum, links);

    // Switch View
    switchPage('links');
}

/**
 * Shows the error message with animation.
 */
function showError() {
    errorMsg.classList.remove('hidden');
    entryPage.querySelector('.terminal-window').style.borderColor = '#ff5555';
    setTimeout(() => {
        entryPage.querySelector('.terminal-window').style.borderColor = '#30363d';
    }, 500);
}

/**
 * Renders the list of links for a specific slot.
 * @param {number} slotNum 
 * @param {Array} links 
 */
function renderLinks(slotNum, links) {
    slotTitle.innerText = `SLOT ${slotNum}: DATA ACQUIRED`;
    linksList.innerHTML = ''; // Clear previous

    links.forEach((link, index) => {
        const li = document.createElement('li');
        // Use title if available, otherwise use the URL as the text
        const displayText = link.title ? link.title : link.url;

        li.innerHTML = `
            <a href="${link.url}" target="_blank">
                <span class="prefix">OP_CODE_0${index + 1} >></span> ${displayText}
            </a>
        `;
        // Add staggered animation delay
        li.style.animation = `scan 0.5s ease-out ${index * 0.1}s backwards`;
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
        errorMsg.classList.add('hidden'); // Clear error
    } else {
        linksPage.classList.remove('active');
        linksPage.classList.add('hidden');
        entryPage.classList.remove('hidden');
        entryPage.classList.add('active');
        slotInput.value = ''; // Reset input
        slotInput.focus();
    }
}

// Event Listeners
enterBtn.addEventListener('click', handleEnter);

slotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleEnter();
    }
});

backBtn.addEventListener('click', () => {
    switchPage('entry');
});

// Initial Focus
slotInput.focus();

/* --- DEBUG / HACKING UI LOGIC --- */
const debugPanel = document.getElementById('debug-panel');
const slotGrid = document.getElementById('slot-grid');

// Toggle Debug Panel with Backtick (`)
document.addEventListener('keydown', (e) => {
    if (e.key === '`') {
        toggleDebugPanel();
    }
});

function toggleDebugPanel() {
    debugPanel.classList.toggle('hidden');
    if (!debugPanel.classList.contains('hidden')) {
        initDebugPanel();
    }
}

function initDebugPanel() {
    slotGrid.innerHTML = '';
    Object.keys(slotsData).forEach(key => {
        const id = parseInt(key);
        const data = slotsData[id];
        const isActive = data.some(l => l.url && l.url !== '#' && l.url !== '');

        const node = document.createElement('div');
        node.className = `slot-node ${isActive ? 'active' : 'empty'}`;
        // No text inside the nodes
        node.title = isActive ? `Slot ${id}: ACTIVE` : `Slot ${id}: EMPTY`;

        node.addEventListener('click', () => {
            slotInput.value = id;
            handleEnter();
        });

        slotGrid.appendChild(node);
    });
}


