const state = {
    currentPage: 'home',
    language: 'hindi',
    recording: false,
    mediaRecorder: null,
    audioChunks: [],
    diseases: [],
    education: [],
    calendar: [],
    currentDetail: null,
    chatHistory: [],
    profile: {
        size: '',
        crops: '',
        region: ''
    }
};

// ━━━ Initialization ━━━
document.addEventListener('DOMContentLoaded', () => {
    // Splash screen
    setTimeout(() => {
        const splash = document.getElementById('splash');
        if (splash) {
            splash.classList.add('fade-out');
            setTimeout(() => splash.remove(), 600);
        }
    }, 1200);

    loadProfile();
    updateGreeting();
    loadData();
    checkStatus();
    loadChatHistory();

    // ── Language toggle ──
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) langToggle.addEventListener('click', toggleLanguage);

    // ── Mic button ──
    const micBtn = document.getElementById('mic-btn');
    if (micBtn) micBtn.addEventListener('click', toggleRecording);

    // ── Send button ──
    const sendBtn = document.getElementById('send-btn');
    if (sendBtn) sendBtn.addEventListener('click', sendText);

    // ── Text input Enter key ──
    const textInput = document.getElementById('text-input');
    if (textInput) {
        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendText();
        });
    }

    // ── Search inputs ──
    const diseaseSearch = document.getElementById('disease-search');
    if (diseaseSearch) diseaseSearch.addEventListener('input', (e) => filterDiseases(e.target.value));

    const knowledgeSearch = document.getElementById('knowledge-search');
    if (knowledgeSearch) knowledgeSearch.addEventListener('input', (e) => filterKnowledge(e.target.value));

    const calendarSearch = document.getElementById('calendar-search');
    if (calendarSearch) calendarSearch.addEventListener('input', (e) => filterCalendar(e.target.value));

    // ── data-nav: all navigation triggers ──
    document.addEventListener('click', (e) => {
        const el = e.target.closest('[data-nav]');
        if (el) navigateTo(el.dataset.nav);
    });

    // ── Detail modal close ──
    const detailClose = document.getElementById('detail-close');
    if (detailClose) detailClose.addEventListener('click', closeDetail);

    const detailAskBtn = document.getElementById('detail-ask-btn');
    if (detailAskBtn) detailAskBtn.addEventListener('click', askAboutDetail);

    // ── Settings modal open/close ──
    const openSettings = document.getElementById('open-settings');
    if (openSettings) openSettings.addEventListener('click', () => {
        document.getElementById('settings-modal').classList.remove('hidden');
    });

    const settingsClose = document.getElementById('settings-close');
    if (settingsClose) settingsClose.addEventListener('click', () => {
        document.getElementById('settings-modal').classList.add('hidden');
    });

    const saveProfileBtn = document.getElementById('save-profile-btn');
    if (saveProfileBtn) saveProfileBtn.addEventListener('click', saveProfile);

    // ── Hash routing ──
    window.addEventListener('hashchange', () => {
        const page = location.hash.replace('#', '') || 'home';
        navigateTo(page, false);
    });

    // Initial route
    const initial = location.hash.replace('#', '') || 'home';
    if (initial !== 'home') navigateTo(initial, false);

    // Online/offline detection
    window.addEventListener('online', () => showToast('Internet connected ✓'));
    window.addEventListener('offline', () => showToast('Offline mode — stored answers available'));
});

// ━━━ Profile Logic ━━━
function loadProfile() {
    try {
        const saved = localStorage.getItem('jeevam_profile');
        if (saved) {
            state.profile = JSON.parse(saved);
            const sizeEl = document.getElementById('profile-size');
            const cropsEl = document.getElementById('profile-crops');
            const regionEl = document.getElementById('profile-region');
            if (sizeEl) sizeEl.value = state.profile.size || '';
            if (cropsEl) cropsEl.value = state.profile.crops || '';
            if (regionEl) regionEl.value = state.profile.region || '';
        }
    } catch(e) {}
}

function saveProfile() {
    state.profile = {
        size: document.getElementById('profile-size').value,
        crops: document.getElementById('profile-crops').value,
        region: document.getElementById('profile-region').value,
    };
    localStorage.setItem('jeevam_profile', JSON.stringify(state.profile));
    document.getElementById('settings-modal').classList.add('hidden');
    showToast('Profile saved!');
}

function getProfileContext() {
    const ctx = [];
    if (state.profile.size)   ctx.push(`Farm Size: ${state.profile.size}`);
    if (state.profile.crops)  ctx.push(`Primary Crops: ${state.profile.crops}`);
    if (state.profile.region) ctx.push(`Region: ${state.profile.region}`);
    return ctx.join(', ');
}

// ━━━ Toast Notifications ━━━
function showToast(message) {
    let toast = document.querySelector('.offline-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'offline-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ━━━ Navigation ━━━
function navigateTo(page, pushHash = true) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    const target = document.getElementById(`page-${page}`);
    if (target) {
        target.classList.add('active');
        state.currentPage = page;
    }

    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === page);
    });

    if (pushHash) location.hash = page;
}

// ━━━ Language Toggle ━━━
function toggleLanguage() {
    state.language = state.language === 'hindi' ? 'english' : 'hindi';
    const btn = document.getElementById('lang-toggle');
    if (btn) {
        btn.textContent = state.language === 'hindi' ? 'हिं / En' : 'En / हिं';
        btn.dataset.lang = state.language;
    }
    updateGreeting();
}

// ━━━ Greeting ━━━
function updateGreeting() {
    const hour = new Date().getHours();
    let greetHi, greetEn;

    if (hour < 12) {
        greetHi = 'शुभ प्रभात! ☀';
        greetEn = 'Good Morning!';
    } else if (hour < 17) {
        greetHi = 'नमस्ते! ☀';
        greetEn = 'Good Afternoon!';
    } else {
        greetHi = 'शुभ संध्या! ✦';
        greetEn = 'Good Evening!';
    }

    const titleEl = document.getElementById('greeting-text');
    const subEl = document.getElementById('greeting-sub');

    if (state.language === 'hindi') {
        if (titleEl) titleEl.textContent = greetHi;
        if (subEl) subEl.textContent = 'आज मैं कैसे मदद कर सकता हूँ?';
    } else {
        if (titleEl) titleEl.textContent = greetEn;
        if (subEl) subEl.textContent = 'How can I help you today?';
    }
}

// ━━━ Status Check ━━━
async function checkStatus() {
    try {
        const res = await fetch('/api/status');
        await res.json();
    } catch {}
}

// ━━━ Voice Recording ━━━
function toggleRecording() {
    if (state.recording) {
        stopRecording();
    } else {
        startRecording();
    }
}

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        state.mediaRecorder = new MediaRecorder(stream, {
            mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                ? 'audio/webm;codecs=opus'
                : 'audio/webm'
        });
        state.audioChunks = [];

        state.mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) state.audioChunks.push(e.data);
        };

        state.mediaRecorder.onstop = () => {
            stream.getTracks().forEach(t => t.stop());
            const blob = new Blob(state.audioChunks, { type: 'audio/webm' });
            sendVoice(blob);
        };

        state.mediaRecorder.start();
        state.recording = true;

        const micBtn = document.getElementById('mic-btn');
        if (micBtn) micBtn.classList.add('recording');

        const micIcon = document.getElementById('mic-icon');
        if (micIcon) micIcon.classList.add('hidden');

        const stopIcon = document.getElementById('stop-icon');
        if (stopIcon) stopIcon.classList.remove('hidden');

        const micHint = document.getElementById('mic-hint');
        if (micHint) micHint.textContent = 'सुन रहा हूँ...';

        const vs = document.getElementById('voice-status');
        if (vs) vs.innerHTML = '<div class="waveform"><span></span><span></span><span></span><span></span><span></span></div>';

    } catch (err) {
        console.error('Mic access denied:', err);
        const vs = document.getElementById('voice-status');
        if (vs) vs.textContent = 'Microphone access denied — please allow mic permission';
    }
}

function stopRecording() {
    if (state.mediaRecorder && state.recording) {
        state.mediaRecorder.stop();
        state.recording = false;

        const micBtn = document.getElementById('mic-btn');
        if (micBtn) micBtn.classList.remove('recording');

        const micIcon = document.getElementById('mic-icon');
        if (micIcon) micIcon.classList.remove('hidden');

        const stopIcon = document.getElementById('stop-icon');
        if (stopIcon) stopIcon.classList.add('hidden');

        const micHint = document.getElementById('mic-hint');
        if (micHint) micHint.textContent = 'बोलें अपनी समस्या बताएं';

        const vs = document.getElementById('voice-status');
        if (vs) vs.textContent = 'सोच रहा हूँ...';
    }
}

// ━━━ API: Send Voice ━━━
async function sendVoice(blob) {
    const chatArea = document.getElementById('chat-area');
    if (!chatArea) return;

    const welcome = chatArea.querySelector('.chat-welcome');
    if (welcome) welcome.remove();

    const loadingEl = createLoadingBubble();
    chatArea.appendChild(loadingEl);
    chatArea.scrollTop = chatArea.scrollHeight;

    try {
        const formData = new FormData();
        formData.append('audio', blob, 'recording.webm');
        formData.append('language', state.language);
        formData.append('profile_context', getProfileContext());

        const res = await fetch('/api/voice', { method: 'POST', body: formData });
        const data = await res.json();

        loadingEl.remove();

        if (data.success) {
            if (data.transcript) {
                chatArea.appendChild(createBubble(data.transcript, 'user'));
                saveChatMessage(data.transcript, 'user');
            }
            chatArea.appendChild(createBubble(data.answer, 'bot', data.audio_url, !data.online));
            saveChatMessage(data.answer, 'bot', data.audio_url);
            if (data.audio_url) playAudio(data.audio_url);
        } else {
            chatArea.appendChild(createBubble(data.error || 'कुछ गड़बड़ हुई', 'bot'));
        }

        const vs = document.getElementById('voice-status');
        if (vs) vs.textContent = '';

    } catch (err) {
        loadingEl.remove();
        chatArea.appendChild(createBubble('Network error — कृपया फिर से कोशिश करें', 'bot'));
        const vs = document.getElementById('voice-status');
        if (vs) vs.textContent = '';
    }

    chatArea.scrollTop = chatArea.scrollHeight;
}

// ━━━ API: Send Text ━━━
async function sendText() {
    const input = document.getElementById('text-input');
    if (!input) return;
    const query = input.value.trim();
    if (!query) return;

    input.value = '';
    const chatArea = document.getElementById('chat-area');
    if (!chatArea) return;

    const welcome = chatArea.querySelector('.chat-welcome');
    if (welcome) welcome.remove();

    chatArea.appendChild(createBubble(query, 'user'));
    saveChatMessage(query, 'user');

    const loadingEl = createLoadingBubble();
    chatArea.appendChild(loadingEl);
    chatArea.scrollTop = chatArea.scrollHeight;

    try {
        const formData = new FormData();
        formData.append('query', query);
        formData.append('language', state.language);
        formData.append('profile_context', getProfileContext());

        const res = await fetch('/api/text', { method: 'POST', body: formData });
        const data = await res.json();

        loadingEl.remove();

        if (data.success) {
            chatArea.appendChild(createBubble(data.answer, 'bot', data.audio_url, !data.online));
            saveChatMessage(data.answer, 'bot', data.audio_url);
            if (data.audio_url) playAudio(data.audio_url);
        } else {
            chatArea.appendChild(createBubble(data.error || 'कुछ गड़बड़ हुई', 'bot'));
        }
    } catch {
        loadingEl.remove();
        chatArea.appendChild(createBubble('Network error — कृपया फिर से कोशिश करें', 'bot'));
    }

    chatArea.scrollTop = chatArea.scrollHeight;
}

// ━━━ Chat Bubble Helpers ━━━
function formatBotResponse(text) {
    const lines = text.split('\n');
    let html = '';
    let currentSection = null;
    let sectionContent = [];
    let hasOfflineBadge = false;

    const flushSection = () => {
        if (currentSection) {
            html += `<div class="bubble-section">`;
            html += `<div class="bubble-heading">${currentSection}</div>`;
            html += `<div class="bubble-text">${sectionContent.join('<br>')}</div>`;
            html += `</div>`;
        } else if (sectionContent.length > 0) {
            html += `<div class="bubble-text">${sectionContent.join('<br>')}</div>`;
        }
        currentSection = null;
        sectionContent = [];
    };

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith('⚠') && !hasOfflineBadge) {
            flushSection();
            html += `<div class="bubble-offline-badge">⚠ Offline Mode</div>`;
            html += `<div class="bubble-text">${trimmed.replace('⚠', '').trim()}</div>`;
            hasOfflineBadge = true;
            continue;
        }

        if (trimmed.startsWith('◈')) {
            flushSection();
            currentSection = trimmed;
            continue;
        }

        if ((trimmed.includes('Himmat rakhein') || trimmed.includes('theek ho jayega') ||
             trimmed.includes('natural farming mein') || trimmed.includes('nirash na hon')) &&
             lines.indexOf(line) > lines.length - 3) {
            flushSection();
            html += `<div class="bubble-encouragement">${trimmed}</div>`;
            continue;
        }

        sectionContent.push(trimmed);
    }

    flushSection();
    return html || text;
}

function createBubble(text, type, audioUrl, isOffline) {
    const div = document.createElement('div');
    div.className = `chat-bubble ${type}`;

    if (type === 'bot') {
        div.innerHTML = formatBotResponse(text);
        if (audioUrl) {
            const listenBtn = document.createElement('button');
            listenBtn.className = 'bubble-listen';
            listenBtn.innerHTML = '🔊 सुनें';
            listenBtn.addEventListener('click', () => playAudio(audioUrl));
            div.appendChild(listenBtn);
        }
    } else {
        div.textContent = text;
    }

    return div;
}

function createLoadingBubble() {
    const div = document.createElement('div');
    div.className = 'chat-loading';
    div.innerHTML = '<span></span><span></span><span></span>';
    return div;
}

function playAudio(url) {
    const player = document.getElementById('tts-player');
    if (player) {
        player.src = url;
        player.play().catch(() => {});
    }
}

// ━━━ Chat Persistence ━━━
function saveChatMessage(text, type, audioUrl) {
    state.chatHistory.push({ text, type, audioUrl, ts: Date.now() });
    if (state.chatHistory.length > 50) state.chatHistory.shift();
    try {
        localStorage.setItem('jeevam_chat', JSON.stringify(state.chatHistory));
    } catch { }
}

function loadChatHistory() {
    try {
        const saved = localStorage.getItem('jeevam_chat');
        if (!saved) return;
        state.chatHistory = JSON.parse(saved);
        if (!state.chatHistory.length) return;

        const chatArea = document.getElementById('chat-area');
        if (!chatArea) return;
        const welcome = chatArea.querySelector('.chat-welcome');
        if (welcome) welcome.remove();

        state.chatHistory.forEach(msg => {
            chatArea.appendChild(createBubble(msg.text, msg.type, msg.audioUrl));
        });

        setTimeout(() => { chatArea.scrollTop = chatArea.scrollHeight; }, 100);
    } catch {
        // Corrupted localStorage — clear it and start fresh
        localStorage.removeItem('jeevam_chat');
        state.chatHistory = [];
    }
}

// ━━━ Load Data ━━━
async function loadData() {
    try {
        const [disRes, eduRes, calRes] = await Promise.all([
            fetch('/api/diseases'),
            fetch('/api/education'),
            fetch('/api/calendar'),
        ]);
        state.diseases = await disRes.json();
        state.education = await eduRes.json();
        state.calendar = await calRes.json();

        renderDiseases(state.diseases);
        renderKnowledge(state.education);
        renderCalendar(state.calendar);
    } catch (err) {
        console.error('Failed to load data:', err);
    }
}

// ━━━ Render Disease List ━━━
function renderDiseases(items) {
    const list = document.getElementById('disease-list');
    if (!list) return;
    list.innerHTML = '';

    const cropIcons = {
        'tamatar': '🍅', 'tomato': '🍅',
        'gehu': '🌾', 'wheat': '🌾',
        'aalu': '🥔', 'potato': '🥔',
        'baingan': '🍆', 'brinjal': '🍆',
        'mirchi': '🌶', 'chilli': '🌶',
        'dhaan': '🌾', 'rice': '🌾',
        'ganna': '🎋', 'sugarcane': '🎋',
        'pyaaz': '🧅', 'onion': '🧅',
        'gobhi': '🥦', 'cauliflower': '🥦',
        'moongfali': '🥜', 'groundnut': '🥜',
    };

    if (items.length === 0) {
        list.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:40px 0;">कोई रोग नहीं मिला</p>';
        return;
    }

    items.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'list-card';

        const cropName = item.crop.toLowerCase();
        let icon = '🌿';
        for (const [key, emoji] of Object.entries(cropIcons)) {
            if (cropName.includes(key)) { icon = emoji; break; }
        }

        card.innerHTML = `
            <div class="list-card-icon" style="background: var(--danger-bg);">${icon}</div>
            <div class="list-card-text">
                <h4>${item.crop}</h4>
                <p>${item.problem.substring(0, 60)}...</p>
            </div>
            <span class="list-card-arrow">›</span>
        `;
        card.addEventListener('click', () => showDiseaseDetail(state.diseases.indexOf(item)));
        list.appendChild(card);
    });
}

// ━━━ Render Knowledge List ━━━
function renderKnowledge(items) {
    const list = document.getElementById('knowledge-list');
    if (!list) return;
    list.innerHTML = '';

    if (items.length === 0) {
        list.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:40px 0;">कोई गाइड नहीं मिला</p>';
        return;
    }

    items.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'list-card';
        card.innerHTML = `
            <div class="list-card-icon" style="background: var(--info-bg);">◈</div>
            <div class="list-card-text">
                <h4>${item.title}</h4>
                <p>${item.what.substring(0, 60)}...</p>
            </div>
            <span class="list-card-arrow">›</span>
        `;
        card.addEventListener('click', () => showEducationDetail(state.education.indexOf(item)));
        list.appendChild(card);
    });
}

// ━━━ Render Calendar List ━━━
function renderCalendar(items) {
    const list = document.getElementById('calendar-list');
    if (!list) return;
    list.innerHTML = '';

    if (items.length === 0) {
        list.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:40px 0;">कोई डेटा नहीं मिला</p>';
        return;
    }

    items.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'list-card';
        card.style.cursor = 'default';

        const seasonColor = item.season === 'Kharif' ? '#4CAF50' : item.season === 'Rabi' ? '#FF9800' : '#2196F3';

        card.innerHTML = `
            <div class="list-card-icon" style="background: ${seasonColor}22; color: ${seasonColor}; font-size: 14px; font-weight: bold;">
                ${item.season.charAt(0)}
            </div>
            <div class="list-card-text" style="width: 100%;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <h4 style="margin:0;">${item.month}</h4>
                    <span style="font-size: 10px; background: #eee; padding: 2px 6px; border-radius: 4px;">${item.season}</span>
                </div>
                <p style="margin-bottom: 4px;"><strong>Crops:</strong> ${item.crops.join(', ')}</p>
                <p style="font-size: 11px;">${item.activities}</p>
            </div>
        `;
        list.appendChild(card);
    });
}

// ━━━ Search / Filter ━━━
function filterDiseases(query) {
    const q = query.toLowerCase();
    const filtered = state.diseases.filter(d =>
        d.crop.toLowerCase().includes(q) ||
        d.problem.toLowerCase().includes(q) ||
        d.keywords.some(k => k.includes(q))
    );
    renderDiseases(filtered);
}

function filterKnowledge(query) {
    const q = query.toLowerCase();
    const filtered = state.education.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.what.toLowerCase().includes(q) ||
        e.keywords.some(k => k.includes(q))
    );
    renderKnowledge(filtered);
}

function filterCalendar(query) {
    const q = query.toLowerCase();
    const filtered = state.calendar.filter(c =>
        c.month.toLowerCase().includes(q) ||
        c.season.toLowerCase().includes(q) ||
        c.crops.some(cr => cr.toLowerCase().includes(q))
    );
    renderCalendar(filtered);
}

// ━━━ Detail Views ━━━
function showDiseaseDetail(idx) {
    const item = state.diseases[idx];
    if (!item) return;
    state.currentDetail = { type: 'disease', item };

    document.getElementById('detail-title').textContent = item.crop;
    document.getElementById('detail-body').innerHTML = `
        <h3>◈ Samasya (Problem)</h3>
        <p>${item.problem}</p>
        <h3>◈ Pehchan (How to confirm)</h3>
        <p>${item.confirm}</p>
        <h3>◈ Ilaj (Treatment)</h3>
        <p>${item.treatment.replace(/\n/g, '<br>')}</p>
        <h3>◈ Bachav (Prevention)</h3>
        <p>${item.prevention}</p>
        <h3>◈ Kab lagayen (When to apply)</h3>
        <p>${item.timing}</p>
    `;
    document.getElementById('detail-modal').classList.remove('hidden');
}

function showEducationDetail(idx) {
    const item = state.education[idx];
    if (!item) return;
    state.currentDetail = { type: 'education', item };

    document.getElementById('detail-title').textContent = item.title;
    document.getElementById('detail-body').innerHTML = `
        <h3>◈ Kya hai (What it is)</h3>
        <p>${item.what}</p>
        <h3>◈ Kya chahiye (Ingredients)</h3>
        <p>${item.ingredients.replace(/\n/g, '<br>')}</p>
        <h3>◈ Kaise banaye (How to make)</h3>
        <p>${item.steps.replace(/\n/g, '<br>')}</p>
        <h3>◈ Kitne din mein tayar (Ready in)</h3>
        <p>${item.ready_in}</p>
        <h3>◈ Kaise use karein (How to use)</h3>
        <p>${item.usage.replace(/\n/g, '<br>')}</p>
    `;
    document.getElementById('detail-modal').classList.remove('hidden');
}

function closeDetail() {
    document.getElementById('detail-modal').classList.add('hidden');
    state.currentDetail = null;
}

function askAboutDetail() {
    if (!state.currentDetail) return;
    const item = state.currentDetail.item;
    const query = state.currentDetail.type === 'disease'
        ? item.crop + ' ' + item.keywords[0]
        : item.title;

    closeDetail();
    navigateTo('voice');

    setTimeout(() => {
        const input = document.getElementById('text-input');
        if (input) {
            input.value = query;
            sendText();
        }
    }, 300);
}