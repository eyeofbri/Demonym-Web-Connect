const lobby = document.querySelector('#lobby');
const battle = document.querySelector('#battle');
const createButton = document.querySelector('#create');
const joinButton = document.querySelector('#join');
const clientModeSelect = document.querySelector('#client-mode');
const lineageSelect = document.querySelector('#lineage-select');
const payloadJson = document.querySelector('#payload-json');
const generatePayloadButton = document.querySelector('#generate-payload');
const importPayloadButton = document.querySelector('#import-payload');
const webPresetButton = document.querySelector('#web-preset');
const payloadStatus = document.querySelector('#payload-status');
const movesContainer = document.querySelector('#moves');
const roomInput = document.querySelector('#room-code');
const currentRoom = document.querySelector('#current-room');
const playerLabel = document.querySelector('#player-label');
const connectionMeta = document.querySelector('#connection-meta');
const matchNumber = document.querySelector('#match-number');
const signalToss = document.querySelector('#signal-toss');
const battleEvent = document.querySelector('#battle-event');
const roundPanel = document.querySelector('#round-panel');
const roundNumber = document.querySelector('#round-number');
const roundPriority = document.querySelector('#round-priority');
const roundLockStatus = document.querySelector('#round-lock-status');
const status = document.querySelector('#status');
const sessionLifecycle = document.querySelector('#session-lifecycle');
const resultPanel = document.querySelector('#result-panel');
const resultTitle = document.querySelector('#result-title');
const resultCopy = document.querySelector('#result-copy');
const rematchButton = document.querySelector('#rematch');
const newBattleButton = document.querySelector('#new-battle');
const leaveMatchButton = document.querySelector('#leave-match');
const rematchState = document.querySelector('#rematch-state');
const battleLog = document.querySelector('#battle-log');
const copyBattleLogButton = document.querySelector('#copy-battle-log');
const logCopyChoices = document.querySelector('#log-copy-choices');
const copyLogSimpleButton = document.querySelector('#copy-log-simple');
const copyLogVerboseButton = document.querySelector('#copy-log-verbose');
const player1Card = document.querySelector('#player-1');
const player2Card = document.querySelector('#player-2');
const tabBattleButton = document.querySelector('#tab-battle');
const tabSettingsButton = document.querySelector('#tab-settings');
const battleView = document.querySelector('#battle-view');
const settingsView = document.querySelector('#settings-view');
const logCount = document.querySelector('#log-count');
const navMenuButton = document.querySelector('#nav-menu-button');
const offcanvas = document.querySelector('#offcanvas');
const offcanvasScrim = document.querySelector('#offcanvas-scrim');
const colorThemeToggle = document.querySelector('#color-theme-toggle');
const uiStyleToggle = document.querySelector('#ui-style-toggle');
const colorThemeValue = document.querySelector('#color-theme-value');
const uiStyleValue = document.querySelector('#ui-style-value');
const newsStatus = document.querySelector('#news-status');
const newsList = document.querySelector('#news-list');
const WEB_CONNECT_VERSION = '0.3.2.7';
const footerYear = document.querySelector('#footer-year');
const homeVersion = document.querySelector('#home-version');
if (footerYear) footerYear.textContent = String(new Date().getFullYear());
if (homeVersion) homeVersion.textContent = `v${WEB_CONNECT_VERSION}`;


const NAV_COLLAPSE_PX = 1000;
const COLOR_THEME_KEY = 'demonym-connect-color-theme';
const UI_STYLE_KEY = 'demonym-connect-ui-style';
const ROUTES = new Set(['home', 'connect', 'about', 'news', 'ladder', 'support', 'settings']);
const NEWS_REPO = 'eyeofbri/Demonym-Web-Connect';
const NEWS_PATH = 'public/news';
let newsLoaded = false;
let newsLoading = false;

function routeFromPath(pathname = location.pathname) {
	const clean = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
	if (!clean) return 'home';
	if (clean === 'boards') return 'ladder';
	return ROUTES.has(clean) ? clean : 'home';
}

function closeNav() {
	document.body.classList.remove('nav-open');
	navMenuButton?.setAttribute('aria-expanded', 'false');
	offcanvas?.setAttribute('aria-hidden', 'true');
}

function setRoute(route, { push = false } = {}) {
	if (!ROUTES.has(route)) route = 'home';
	document.querySelectorAll('.site-page').forEach((page) => { page.hidden = page.dataset.page !== route; });
	document.querySelectorAll('[data-route]').forEach((link) => {
		const active = link.dataset.route === route;
		link.classList.toggle('active', active);
		if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
	});
	if (push) history.pushState({ route }, '', route === 'home' ? '/' : `/${route}`);
	closeNav();
	if (route === 'news') loadNews();
	window.scrollTo({ top: 0, behavior: 'auto' });
}

function applyThemeSettings() {
	const colorTheme = localStorage.getItem(COLOR_THEME_KEY) || 'dark';
	const uiStyle = localStorage.getItem(UI_STYLE_KEY) || 'sharp';
	document.documentElement.dataset.colorTheme = colorTheme;
	document.documentElement.dataset.uiStyle = uiStyle;
	if (colorThemeToggle) colorThemeToggle.checked = colorTheme === 'light';
	if (uiStyleToggle) uiStyleToggle.checked = uiStyle === 'sharp';
	if (colorThemeValue) colorThemeValue.textContent = colorTheme.toUpperCase();
	if (uiStyleValue) uiStyleValue.textContent = uiStyle.toUpperCase();
}

function escapeHtml(value) {
	return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
}

function inlineMarkdown(value) {
	let text = escapeHtml(value);
	text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
	text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
	text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
	text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1 ↗</a>');
	return text;
}

function renderMinimalMarkdown(source, filename) {
	const lines = String(source || '').replace(/\r\n/g, '\n').split('\n');
	let html = '';
	let inList = false;
	for (const raw of lines) {
		const line = raw.trimEnd();
		if (/^[-*]\s+/.test(line)) {
			if (!inList) { html += '<ul>'; inList = true; }
			html += `<li>${inlineMarkdown(line.replace(/^[-*]\s+/, ''))}</li>`;
			continue;
		}
		if (inList) { html += '</ul>'; inList = false; }
		if (!line.trim()) continue;
		const heading = line.match(/^(#{1,3})\s+(.+)$/);
		if (heading) {
			const level = Math.min(3, heading[1].length + 1);
			html += `<h${level}>${inlineMarkdown(heading[2])}</h${level}>`;
		} else {
			html += `<p>${inlineMarkdown(line)}</p>`;
		}
	}
	if (inList) html += '</ul>';
	if (!html) html = `<p>${escapeHtml(filename)}</p>`;
	return html;
}

async function loadNews() {
	if (newsLoaded || newsLoading || !newsStatus || !newsList) return;
	newsLoading = true;
	newsStatus.hidden = false;
	newsStatus.textContent = 'Loading project posts from GitHub...';
	try {
		const headers = { Accept: 'application/vnd.github+json' };
		const listResponse = await fetch(`https://api.github.com/repos/${NEWS_REPO}/contents/${NEWS_PATH}?ref=main`, { headers });
		if (listResponse.status === 404) {
			newsStatus.textContent = 'No news posts have been published yet.';
			newsLoaded = true;
			return;
		}
		if (!listResponse.ok) throw new Error(`GitHub returned ${listResponse.status}`);
		const files = (await listResponse.json()).filter((item) => item.type === 'file' && /\.(md|txt)$/i.test(item.name) && !item.name.startsWith('_'));
		const posts = await Promise.all(files.map(async (file) => {
			const commitUrl = `https://api.github.com/repos/${NEWS_REPO}/commits?path=${encodeURIComponent(`${NEWS_PATH}/${file.name}`)}&per_page=1`;
			const [commitResponse, contentResponse] = await Promise.all([fetch(commitUrl, { headers }), fetch(file.download_url)]);
			const commits = commitResponse.ok ? await commitResponse.json() : [];
			const content = contentResponse.ok ? await contentResponse.text() : '';
			const date = commits?.[0]?.commit?.committer?.date || commits?.[0]?.commit?.author?.date || '1970-01-01T00:00:00Z';
			return { name: file.name, date, content, html: renderMinimalMarkdown(content, file.name) };
		}));
		posts.sort((a, b) => new Date(b.date) - new Date(a.date) || a.name.localeCompare(b.name));
		if (!posts.length) {
			newsStatus.textContent = 'No news posts have been published yet.';
		} else {
			newsList.innerHTML = posts.map((post) => `<article class="news-post"><div class="news-meta">${new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} // ${escapeHtml(post.name)}</div>${post.html}</article>`).join('');
			newsList.hidden = false;
			newsStatus.hidden = true;
		}
		newsLoaded = true;
	} catch (error) {
		newsStatus.innerHTML = `Could not load repo news right now. <a href="https://github.com/${NEWS_REPO}/tree/main/${NEWS_PATH}" target="_blank" rel="noopener noreferrer">Open the news folder on GitHub ↗</a>`;
		console.warn('Demonym Connect news load failed:', error);
	} finally {
		newsLoading = false;
	}
}

applyThemeSettings();
setRoute(routeFromPath());

let socket = null;
let playerNumber = null;
let connectedPlayers = [];
let connectedClients = [];
let requestedClientType = 'web';
let handshakeComplete = false;
let connectionProtocol = null;
let state = null;
let moveLibrary = {};
let lineageLibrary = {};
let battleConfig = { recoverEnergy: 2, energyRecoveryPerRound: 0, battleRules: 19 };
let battleProtocol = {};
let lastEventId = 0;
let eventQueue = Promise.resolve();
let queuedEventCount = 0;
let eventPlaybackActive = false;
let activePlaybackRound = null;
let currentRoomCode = '';
let sessionToken = null;
let reconnectAttempts = 0;
let reconnectTimer = null;
let intentionalClose = false;

const CLIENT_CAPABILITIES = [
	'creature-payload-v1',
	'creature-payload-v2',
	'round-lock-v1',
	'battle-events-v1',
	'recover-action-v1',
	'rematch-v1',
	'session-resume-v1',
];

const statusNames = {
	stagger: 'Stagger',
	disruption: 'Disruption',
	burn: 'Burn',
	corrosion: 'Corrosion',
	'echo-interference': 'Echo Interference',
	evasion: 'Evasion',
	ward: 'Ward',
};

function showBattle(code) {
	lobby.style.display = 'none';
	battle.style.display = 'block';
	currentRoom.textContent = code;
}

function setText(id, value) {
	document.querySelector(id).textContent = value;
}

function showTab(name) {
	const battleActive = name !== 'settings';
	tabBattleButton.classList.toggle('active', battleActive);
	tabSettingsButton.classList.toggle('active', !battleActive);
	tabBattleButton.setAttribute('aria-selected', String(battleActive));
	tabSettingsButton.setAttribute('aria-selected', String(!battleActive));
	battleView.hidden = !battleActive;
	settingsView.hidden = battleActive;
}

function setMeter(player, kind, value, max) {
	const bar = document.querySelector(`#${kind}-bar-${player}`);
	if (!bar) return;
	const numericValue = Number(value);
	const numericMax = Number(max);
	const percent = numericMax > 0 ? Math.max(0, Math.min(100, (numericValue / numericMax) * 100)) : 0;
	bar.style.width = `${percent}%`;
}

function sendMessage(message) {
	if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message));
}

const ACTIVE_ROOM_KEY = 'demonym-connect-active-room';

function sessionStorageKey(code) {
	return `demonym-connect-session:${code}`;
}

function clientModeStorageKey(code) {
	return `demonym-connect-client-mode:${code}`;
}

function clearReconnectTimer() {
	if (reconnectTimer) clearTimeout(reconnectTimer);
	reconnectTimer = null;
}

function scheduleReconnect() {
	if (intentionalClose || !currentRoomCode || !sessionToken) return;
	clearReconnectTimer();
	const delay = Math.min(5000, 750 * Math.max(1, reconnectAttempts + 1));
	reconnectAttempts += 1;
	status.textContent = `Connection lost. Reconnecting to Player ${playerNumber ?? '?'}...`;
	reconnectTimer = setTimeout(() => connectToRoom(currentRoomCode, { reconnect: true }), delay);
}

function clientInfoForPlayer(player) {
	return connectedClients.find((item) => item.player === player) ?? null;
}

function clientLabel(info) {
	if (!info) return 'WAITING';
	return info.clientType === 'cardputer' ? `CARDPUTER · ${info.clientVersion}` : `WEB · ${info.clientVersion}`;
}

function sendClientHello() {
	if (!connectionProtocol) return;
	const version = requestedClientType === 'cardputer' ? `browser-mock-${WEB_CONNECT_VERSION}` : `web-${WEB_CONNECT_VERSION}`;
	sendMessage({
		type: 'client-hello',
		protocol: connectionProtocol.name,
		protocolVersion: connectionProtocol.version,
		clientType: requestedClientType,
		clientVersion: version,
		capabilities: CLIENT_CAPABILITIES,
		...(sessionToken ? { sessionToken } : {}),
	});
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function cardForPlayer(player) {
	return player === 1 ? player1Card : player2Card;
}

async function pulseCard(player, className, duration = 420) {
	if (!player) return;
	const card = cardForPlayer(player);
	card.classList.remove(className);
	void card.offsetWidth;
	card.classList.add(className);
	await sleep(duration);
	card.classList.remove(className);
}

async function showBattleEvent(text, duration = 560) {
	battleEvent.innerHTML = `<span class="event-prefix">//</span>${text}`;
	battleEvent.classList.add('show');
	await sleep(duration);
	battleEvent.classList.remove('show');
	await sleep(100);
}

function moveName(moveId) {
	return moveLibrary[moveId]?.name ?? 'MOVE';
}

async function playBattleEvent(event) {
	if (!event) return;
	activePlaybackRound = event.round ?? null;
	render();

	if (event.type === 'action_locked') {
		await Promise.all([pulseCard(event.player, 'event-lock', 360), showBattleEvent(`PLAYER ${event.player} // MOVE LOCKED`, 360)]);
		return;
	}

	if (event.type === 'creature_imported') {
		await Promise.all([
			pulseCard(event.player, 'event-status', 520),
			showBattleEvent(`P${event.player} // DEVICE CREATURE LOADED`, 560),
		]);
		return;
	}

	if (event.type === 'signal_toss') {
		await showBattleEvent(`SIGNAL TOSS // PLAYER ${event.player} PRIORITY`, 700);
		return;
	}

	if (event.type === 'round_start') {
		await showBattleEvent(`ROUND ${event.round} // LOCK IN`, 480);
		return;
	}

	if (event.type === 'move_resolved') {
		const amount = event.amount ? ` // ${event.amount} DMG` : '';
		await Promise.all([
			pulseCard(event.player, 'event-act'),
			event.amount ? pulseCard(event.targetPlayer, 'event-hit') : Promise.resolve(),
			showBattleEvent(`P${event.player} // ${moveName(event.moveId).toUpperCase()}${amount}`, 620),
		]);
		return;
	}

	if (event.type === 'move_missed') {
		await Promise.all([
			pulseCard(event.player, 'event-act'),
			showBattleEvent(`P${event.player} // ${moveName(event.moveId).toUpperCase()} // MISS`, 560),
		]);
		return;
	}

	if (event.type === 'recover') {
		const source = event.moveId ? moveName(event.moveId).toUpperCase() : 'RECOVER';
		await Promise.all([
			pulseCard(event.player, 'event-recover', 520),
			showBattleEvent(`P${event.player} // ${source} // +${event.amount ?? 0} EN`, 560),
		]);
		return;
	}

	if (event.type === 'heal') {
		await Promise.all([
			pulseCard(event.targetPlayer ?? event.player, 'event-recover', 520),
			showBattleEvent(`P${event.player} // ${moveName(event.moveId).toUpperCase()} // +${event.amount ?? 0} HP`, 560),
		]);
		return;
	}

	if (event.type === 'status_applied') {
		const label = statusNames[event.statusId] ?? event.statusId ?? 'STATUS';
		await Promise.all([
			pulseCard(event.targetPlayer, 'event-status', 520),
			showBattleEvent(`P${event.targetPlayer} // ${String(label).toUpperCase()}`, 480),
		]);
		return;
	}

	if (event.type === 'disconnect') {
		await showBattleEvent(`PLAYER ${event.player} // CONNECTION LOST`, 620);
		return;
	}

	if (event.type === 'reconnect') {
		await showBattleEvent(`PLAYER ${event.player} // RECONNECTED`, 620);
		return;
	}

	if (event.type === 'session_expired') {
		await showBattleEvent(`PLAYER ${event.player} // SESSION EXPIRED · ROOM OPEN`, 700);
		return;
	}

	if (event.type === 'battle_end') {
		await Promise.all([pulseCard(event.player, 'event-win', 800), showBattleEvent(`PLAYER ${event.player} WINS`, 800)]);
	}
}

function queueBattleEvents(events) {
	if (!events?.length) return;
	queuedEventCount += events.length;
	eventPlaybackActive = true;
	render();

	eventQueue = eventQueue
		.then(async () => {
			for (const event of events) {
				await playBattleEvent(event);
				queuedEventCount = Math.max(0, queuedEventCount - 1);
			}
		})
		.finally(() => {
			if (queuedEventCount === 0) {
				eventPlaybackActive = false;
				activePlaybackRound = null;
				render();
			}
		});
}

function connectToRoom(code, options = {}) {
	code = code.trim().toUpperCase();
	const reconnecting = Boolean(options.reconnect);
	if (!/^[A-Z2-9]{6}$/.test(code)) {
		alert('Enter a valid 6-character battle code.');
		return;
	}

	if (!reconnecting) {
		requestedClientType = clientModeSelect.value === 'cardputer' ? 'cardputer' : 'web';
		reconnectAttempts = 0;
		sessionStorage.setItem(clientModeStorageKey(code), requestedClientType);
	} else {
		const storedMode = sessionStorage.getItem(clientModeStorageKey(code));
		if (storedMode === 'cardputer' || storedMode === 'web') requestedClientType = storedMode;
	}

	handshakeComplete = false;
	connectionProtocol = null;
	connectedClients = [];
	currentRoomCode = code;
	intentionalClose = false;
	sessionToken = sessionStorage.getItem(sessionStorageKey(code));
	sessionStorage.setItem(ACTIVE_ROOM_KEY, code);

	showBattle(code);
	const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
	const ws = new WebSocket(`${protocol}://${location.host}/api/rooms/${code}/ws`);
	socket = ws;

	ws.addEventListener('open', () => {
		if (socket !== ws) return;
		status.textContent = 'Connected. Waiting for protocol handshake...';
	});
	ws.addEventListener('message', (event) => {
		if (socket !== ws) return;
		const message = JSON.parse(event.data);

		if (message.type === 'hello-required') {
			connectionProtocol = message.connectionProtocol;
			playerNumber = message.player;
			sessionToken = message.sessionToken ?? sessionToken;
			if (sessionToken && currentRoomCode) sessionStorage.setItem(sessionStorageKey(currentRoomCode), sessionToken);
			connectionMeta.textContent = `Handshake requested · ${connectionProtocol.name} v${connectionProtocol.version} · ${requestedClientType === 'cardputer' ? 'CARDPUTER MOCK' : 'WEB'}`;
			status.textContent = 'Negotiating client capabilities...';
			sendClientHello();
			return;
		}

		if (message.type === 'hello-ack') {
			handshakeComplete = true;
			reconnectAttempts = 0;
			clearReconnectTimer();
			connectionProtocol = message.connectionProtocol ?? connectionProtocol;
			connectionMeta.textContent = `${message.resumed ? 'Session resumed' : 'Handshake accepted'} · ${message.client.clientType.toUpperCase()} · ${message.client.clientVersion} · protocol v${connectionProtocol.version}`;
			status.textContent = 'Handshake accepted. Loading battle room...';
			return;
		}

		if (message.type === 'hello-reject') {
			handshakeComplete = false;
			intentionalClose = true;
			if (currentRoomCode) {
				sessionStorage.removeItem(sessionStorageKey(currentRoomCode));
				sessionStorage.removeItem(clientModeStorageKey(currentRoomCode));
			}
			sessionStorage.removeItem(ACTIVE_ROOM_KEY);
			connectionMeta.textContent = 'Handshake rejected';
			status.textContent = message.message ?? 'Handshake rejected.';
			return;
		}

		if (message.type === 'welcome') {
			playerNumber = message.player;
			state = message.state;
			connectedPlayers = message.connectedPlayers ?? [];
			connectedClients = message.connectedClients ?? [];
			moveLibrary = message.moveLibrary ?? {};
			lineageLibrary = message.lineageLibrary ?? {};
			battleConfig = message.battleConfig ?? battleConfig;
			battleProtocol = message.battleProtocol ?? battleProtocol;
			lastEventId = state.eventSeq ?? 0;
			sessionStorage.setItem(ACTIVE_ROOM_KEY, currentRoomCode);
			sessionStorage.setItem(clientModeStorageKey(currentRoomCode), requestedClientType);
			playerLabel.textContent = `You are Player ${playerNumber} · ${requestedClientType === 'cardputer' ? 'Cardputer Mock' : 'Web Browser'}`;
			player1Card.classList.toggle('you', playerNumber === 1);
			player2Card.classList.toggle('you', playerNumber === 2);
			render();
			return;
		}

		if (message.type === 'state') {
			const previousEventId = lastEventId;
			state = message.state;
			connectedPlayers = message.connectedPlayers ?? [];
			connectedClients = message.connectedClients ?? connectedClients;
			moveLibrary = message.moveLibrary ?? moveLibrary;
			lineageLibrary = message.lineageLibrary ?? lineageLibrary;
			battleConfig = message.battleConfig ?? battleConfig;
			battleProtocol = message.battleProtocol ?? battleProtocol;
			const newEvents = (state.events ?? []).filter((item) => item.id > previousEventId);
			lastEventId = Math.max(previousEventId, state.eventSeq ?? previousEventId);
			if (newEvents.length) queueBattleEvents(newEvents);
			else render();
			return;
		}

		if (message.type === 'error') {
			status.textContent = message.message;
			if (
				String(message.message).toLowerCase().includes('payload') ||
				String(message.message).toLowerCase().includes('creature') ||
				String(message.message).toLowerCase().includes('cardputer')
			)
				payloadStatus.textContent = message.message;
		}
	});

	ws.addEventListener('close', (event) => {
		if (socket !== ws || event.code === 4001) return;
		handshakeComplete = false;
		if (intentionalClose) {
			status.textContent = 'Disconnected.';
			return;
		}
		scheduleReconnect();
	});

	ws.addEventListener('error', () => {
		if (socket !== ws) return;
		status.textContent = sessionToken ? 'Connection error. Reconnect will be attempted.' : 'Connection error.';
	});
}


function signalHash(value) {
	value = (value ^ 61) ^ (value >>> 16); value = Math.imul(value, 9);
	value ^= value >>> 4; value = Math.imul(value, 0x27d4eb2d);
	return (value ^ (value >>> 15)) >>> 0;
}
function rgb565Css(value) {
	const n=parseInt(value,16), r=((n>>11)&31)*255/31, g=((n>>5)&63)*255/63, b=(n&31)*255/31;
	return `rgb(${r|0} ${g|0} ${b|0})`;
}
function renderSignalSprite(player, creature) {
	const canvas=document.querySelector(`#sprite-${player}`); if(!canvas)return;
	const ctx=canvas.getContext('2d'); ctx.clearRect(0,0,canvas.width,canvas.height);
	if(!creature?.payload)return;
	if(creature.visual?.encoding==='indexed4-rgb565-v1' && creature.visual.pixels?.length===1024){
		const palette=creature.visual.palette.split(',').map(rgb565Css);
		const scale=6, ox=0, oy=0;
		for(let i=0;i<512;i++){
			const byte=parseInt(creature.visual.pixels.slice(i*2,i*2+2),16);
			const p0=(byte>>4)&15,p1=byte&15, pixel=i*2, x=pixel%32,y=(pixel/32)|0;
			if(p0!==0 && palette[p0]){ctx.fillStyle=palette[p0];ctx.fillRect(ox+x*scale,oy+y*scale,scale,scale)}
			const x1=(pixel+1)%32,y1=((pixel+1)/32)|0;
			if(p1!==0 && palette[p1]){ctx.fillStyle=palette[p1];ctx.fillRect(ox+x1*scale,oy+y1*scale,scale,scale)}
		}
		return;
	}
	// Browser/test creatures retain a deterministic fallback until they
	// have a native generated visual to upload.
	const seed=Number(creature.payload.visualSeed??1)>>>0,lineage=String(creature.payload.lineage??'wisp'),form=String(creature.payload.form??'static');
	const palette={husk:['#8ff0e6','#527080'],mire:['#83d98d','#3c7654'],wisp:['#b9a7ff','#675da8'],fang:['#ff9f8f','#9b5048'],choir:['#f0b3e6','#925f8a'],machine:['#9dd7e8','#557d8a'],cinder:['#ffb36b','#a75c35'],veil:['#a9b6ff','#5d669b']}[lineage]??['#8ff0e6','#527080'];
	const px=5,ox=16,oy=16,cells=[];
	for(let y=2;y<28;y++)for(let x=3;x<16;x++){const n=signalHash(seed^Math.imul(x+11,0x45d9f3b)^Math.imul(y+7,0x119de1f3));const dx=(x-12)/10,dy=(y-15)/13;if(dx*dx+dy*dy<.78+((n>>>28)&3)*.035&&(n&7)!==0){cells.push([x,y,(n>>>8)&3]);cells.push([31-x,y,(n>>>8)&3])}}
	if(form==='feral')cells.push([7,8,0],[24,8,0],[6,9,0],[25,9,0]); if(form==='static')cells.push([10,2,1],[21,2,1],[9,3,1],[22,3,1]);
	cells.forEach(([x,y,c])=>{ctx.fillStyle=c===0?palette[0]:palette[1];ctx.fillRect(ox+x*px,oy+y*px,px,px)});
}

function renderCreature(player) {
	const connected = connectedPlayers.includes(player);
	if (!connected) {
		const canvas = document.querySelector(`#sprite-${player}`);
		if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
		setText(`#name-${player}`, 'WAITING');
		setText(`#level-${player}`, 'LV —');
		setText(`#lineage-${player}`, '—');
		setText(`#source-${player}`, '—');
		setText(`#client-${player}`, 'WAITING');
		setText(`#hp-${player}`, '—');
		setText(`#max-hp-${player}`, '—');
		setText(`#energy-${player}`, '—');
		setText(`#max-energy-${player}`, '—');
		setText(`#statuses-${player}`, 'Waiting for player...');
		setMeter(player, 'hp', 0, 1);
		setMeter(player, 'energy', 0, 1);
		return;
	}

	const creature = state.players[player - 1];
	renderSignalSprite(player, creature);
	setText(`#name-${player}`, creature.payload.name);
	setText(`#level-${player}`, `LV ${creature.payload.level ?? '—'}`);
	setText(`#lineage-${player}`, creature.payload.lineage.charAt(0).toUpperCase() + creature.payload.lineage.slice(1));
	setText(`#source-${player}`, creature.visual ? 'NATIVE SPRITE' : creature.payload.source === 'cardputer' ? 'CARDPUTER PAYLOAD' : 'WEB TEST');
	setText(`#client-${player}`, clientLabel(clientInfoForPlayer(player)));
	setText(`#hp-${player}`, creature.hp);
	setText(`#max-hp-${player}`, creature.maxHp);
	setText(`#energy-${player}`, creature.energy);
	setText(`#max-energy-${player}`, creature.maxEnergy);
	setMeter(player, 'hp', creature.hp, creature.maxHp);
	setMeter(player, 'energy', creature.energy, creature.maxEnergy);

	const statuses = creature.statuses ?? [];
	setText(
		`#statuses-${player}`,
		statuses.length
			? statuses.map((item) => `${statusNames[item.id] ?? item.id}${(item.stacks ?? 1) > 1 ? ` x${item.stacks}` : ''}`).join(' · ')
			: 'No statuses',
	);
}

function currentMoveCost(creature, move, slot) {
	const serverCost = creature.effectiveMoveCosts?.[slot];
	return Number.isInteger(serverCost) ? serverCost : move.energyCost;
}

function canEditCreature() {
	if (!playerNumber || !state) return false;
	const myClient = clientInfoForPlayer(playerNumber);
	return myClient?.clientType === 'cardputer' && !state.started && !state.ready[playerNumber - 1] && state.winner === null;
}

function buildMockDevicePayload() {
	if (!playerNumber || !state) return null;
	const current = structuredClone(state.players[playerNumber - 1].payload);
	current.source = 'cardputer';
	current.creatureId = (current.creatureId + 0x100000 + playerNumber) >>> 0;
	current.visualSeed = (current.visualSeed ^ 0x0c4d0000 ^ playerNumber) >>> 0;
	current.name = `P${playerNumber} Device Test`;
	return current;
}

function renderPayloadLab() {
	if (!playerNumber || !state) return;
	const editable = canEditCreature();
	const myClient = clientInfoForPlayer(playerNumber);
	const deviceHandshake = myClient?.clientType === 'cardputer';
	generatePayloadButton.disabled = !editable;
	importPayloadButton.disabled = !editable || !deviceHandshake;
	webPresetButton.disabled = !editable;
	const current = state.players[playerNumber - 1].payload;

	if (!deviceHandshake) {
		payloadStatus.textContent =
			'Device import locked: this connection identified as a Web client. Start a new room as Cardputer Mock to test device handoff.';
	} else if (current.source === 'cardputer') {
		payloadStatus.textContent = `Accepted through Cardputer handshake: ${current.creatureId}`;
	} else {
		payloadStatus.textContent = 'Cardputer Mock handshake accepted. Generate and import a device payload to establish this player.';
	}
}

function renderLineagePicker() {
	if (!playerNumber || !state) return;

	const creature = state.players[playerNumber - 1];
	const currentOptions = [...lineageSelect.options].map((option) => option.value);
	const libraryOptions = Object.values(lineageLibrary);

	if (libraryOptions.length && currentOptions.length !== libraryOptions.length) {
		lineageSelect.innerHTML = '';
		for (const lineage of libraryOptions) {
			const option = document.createElement('option');
			option.value = lineage.id;
			option.textContent = lineage.name;
			lineageSelect.append(option);
		}
	}

	lineageSelect.value = creature.payload.lineage.charAt(0).toUpperCase() + creature.payload.lineage.slice(1);
	lineageSelect.disabled = !canEditCreature();
}

function renderMoves() {
	movesContainer.innerHTML = '';
	if (!playerNumber || !state) return;

	const creature = state.players[playerNumber - 1];
	const bothConnected = connectedPlayers.includes(1) && connectedPlayers.includes(2);
	const alreadyLocked = Boolean(state.lockedPlayers?.[playerNumber - 1]);
	const canLock =
		state.started && state.winner === null && state.phase === 'selecting' && !alreadyLocked && bothConnected && !eventPlaybackActive;
	movesContainer.classList.toggle('playback-locked', eventPlaybackActive && state.started && state.winner === null);

	for (const moveId of creature.payload.moveSlots) {
		if (moveId === 'none') continue;
		const move = moveLibrary[moveId];
		if (!move) continue;

		const slot = creature.payload.moveSlots.indexOf(moveId);
		const cost = currentMoveCost(creature, move, slot);
		const coolingDown = (creature.moveCooldowns?.[slot] ?? 0) > 0;
		const affordable = creature.energy >= cost;

		const button = document.createElement('button');
		button.className = 'move';
		if (state.yourLockedMoveId === move.id) button.classList.add('locked');
		button.disabled = !canLock || !affordable || coolingDown;
		button.innerHTML = `<strong>${move.name}${state.yourLockedMoveId === move.id ? ' · LOCKED' : ''}</strong><small class="pressure">${move.pressure.toUpperCase()} · ${move.accuracy}% · ${cost} EN</small><small>${move.description}</small>`;
		button.addEventListener('click', () => sendMessage({ type: 'move', moveId: move.id }));
		movesContainer.append(button);
	}

	const recoverButton = document.createElement('button');
	recoverButton.className = 'move recover';
	if (state.yourLockedMoveId === 'recover') recoverButton.classList.add('locked');
	recoverButton.disabled = !canLock;
	recoverButton.innerHTML = `<strong>Recover${state.yourLockedMoveId === 'recover' ? ' · LOCKED' : ''}</strong><small class="pressure">UTILITY · 0 EN</small><small>Restore up to ${battleConfig.recoverEnergy} Energy. Uses this round's action.</small>`;
	recoverButton.addEventListener('click', () => sendMessage({ type: 'recover' }));
	movesContainer.append(recoverButton);
}

function battleLogText(includeVerbose) {
	const verbosePrefix = '[verbose] ';
	const entries = (state?.log || []).filter((entry) => includeVerbose || !entry.startsWith(verbosePrefix));
	const lines = entries.map((entry, index) => {
		const text = entry.startsWith(verbosePrefix) ? entry.slice(verbosePrefix.length) : entry;
		return `${index + 1}. ${text}`;
	});
	return `BATTLE LOG:\n\n${lines.join('\n')}`;
}

async function copyBattleLog(includeVerbose) {
	const text = battleLogText(includeVerbose);
	try {
		await navigator.clipboard.writeText(text);
	} catch {
		const textarea = document.createElement('textarea');
		textarea.value = text;
		document.body.append(textarea);
		textarea.select();
		document.execCommand('copy');
		textarea.remove();
	}
	logCopyChoices.hidden = true;
	copyBattleLogButton.hidden = false;
}

copyBattleLogButton.addEventListener('click', () => {
	copyBattleLogButton.hidden = true;
	logCopyChoices.hidden = false;
});
copyLogSimpleButton.addEventListener('click', () => copyBattleLog(false));
copyLogVerboseButton.addEventListener('click', () => copyBattleLog(true));

function renderLog() {
	battleLog.innerHTML = '';
	logCount.textContent = String(state?.log?.length ?? 0);
	for (const entry of state.log) {
		const item = document.createElement('li');
		const verbosePrefix = '[verbose] ';
		if (entry.startsWith(verbosePrefix)) {
			item.classList.add('verbose');
			item.textContent = entry.slice(verbosePrefix.length);
		} else {
			item.textContent = entry;
		}
		battleLog.append(item);
	}
	battleLog.scrollTop = battleLog.scrollHeight;
}

function renderRoundPanel(myLocked, opponentLocked, opponent) {
	const active = state.started && state.winner === null && state.round > 0;
	roundPanel.style.display = active ? 'grid' : 'none';
	if (!active) return;

	roundNumber.textContent = eventPlaybackActive && activePlaybackRound ? activePlaybackRound : state.round;
	roundPriority.textContent = eventPlaybackActive ? 'Resolving' : `Player ${state.roundFirstPlayer}`;

	if (eventPlaybackActive) {
		roundLockStatus.textContent = 'Moves locked · playing out';
	} else if (myLocked && opponentLocked) {
		roundLockStatus.textContent = 'Both locked · resolving';
	} else if (myLocked) {
		roundLockStatus.textContent = `You locked · Player ${opponent} choosing`;
	} else if (opponentLocked) {
		roundLockStatus.textContent = `You choosing · Player ${opponent} locked`;
	} else {
		roundLockStatus.textContent = 'Both choosing';
	}
}

function renderResultPanel() {
	const finished = state.winner !== null && !eventPlaybackActive;
	resultPanel.style.display = finished ? 'block' : 'none';
	if (!finished) return;

	const won = state.winner === playerNumber;
	const myVote = Boolean(state.rematch?.[playerNumber - 1]);
	const opponent = playerNumber === 1 ? 2 : 1;
	const opponentVote = Boolean(state.rematch?.[opponent - 1]);

	resultTitle.textContent = state.winner === 0 ? 'DRAW' : won ? 'YOU WIN' : `PLAYER ${state.winner} WINS`;
	resultCopy.textContent = `Match ${state.matchNumber} is complete. Rematch keeps this room and returns both players to lineage selection.`;
	rematchButton.disabled = myVote || !connectedPlayers.includes(1) || !connectedPlayers.includes(2);
	rematchButton.textContent = myVote ? 'REMATCH REQUESTED' : 'REMATCH';

	if (myVote && opponentVote) {
		rematchState.textContent = 'Both players accepted. Resetting battle...';
	} else if (myVote) {
		rematchState.textContent = `Waiting for Player ${opponent} to accept the rematch.`;
	} else if (opponentVote) {
		rematchState.textContent = `Player ${opponent} requested a rematch.`;
	} else {
		rematchState.textContent = 'Both players must choose REMATCH to reuse this room.';
	}
}

function formatCountdown(ms) {
	const total=Math.max(0,Math.ceil(ms/1000)), minutes=Math.floor(total/60), seconds=total%60;
	return `${minutes}:${String(seconds).padStart(2,'0')}`;
}
function renderSessionLifecycle() {
	if (!sessionLifecycle || !state) return;
	const cleanupAt=state.sessionLifecycle?.cleanupAt;
	if (typeof cleanupAt === 'number') {
		const remaining=cleanupAt-Date.now();
		sessionLifecycle.textContent=remaining>0
			? `SESSION CLEANUP // ${formatCountdown(remaining)}`
			: 'SESSION CLEANUP // EXPIRING';
		sessionLifecycle.classList.add('expiring');
	} else {
		sessionLifecycle.textContent='SESSION ACTIVE // server cleanup enabled';
		sessionLifecycle.classList.remove('expiring');
	}
}

function render() {
	if (!state || !playerNumber) return;
	renderCreature(1);
	renderCreature(2);
	renderLineagePicker();
	renderPayloadLab();
	matchNumber.textContent = state.matchNumber ?? 1;
	const myClient = clientInfoForPlayer(playerNumber);
	if (handshakeComplete && myClient && connectionProtocol) {
		connectionMeta.textContent = `Handshake accepted · ${clientLabel(myClient)} · ${connectionProtocol.name} v${connectionProtocol.version} · server ${connectionProtocol.serverVersion}`;
	}

	player1Card.classList.toggle('active', state.started && state.roundFirstPlayer === 1 && state.winner === null);
	player2Card.classList.toggle('active', state.started && state.roundFirstPlayer === 2 && state.winner === null);

	const bothConnected = connectedPlayers.includes(1) && connectedPlayers.includes(2);
	const myLocked = Boolean(state.lockedPlayers?.[playerNumber - 1]);
	const opponent = playerNumber === 1 ? 2 : 1;
	const opponentLocked = Boolean(state.lockedPlayers?.[opponent - 1]);

	signalToss.textContent =
		state.started && state.initiativeWinner ? `SIGNAL TOSS: Player ${state.initiativeWinner} gets Round 1 priority.` : '';
	renderRoundPanel(myLocked, opponentLocked, opponent);
	renderResultPanel();

	if (eventPlaybackActive && state.started) {
		status.textContent = `Resolving Round ${activePlaybackRound ?? state.round}... battle controls are locked.`;
	} else if (state.winner !== null) {
		status.textContent = state.winner === 0 ? 'Draw.' : state.winner === playerNumber ? 'You win.' : `Player ${state.winner} wins.`;
	} else if (!bothConnected) {
		status.textContent = 'Waiting for opponent...';
	} else if (!state.started) {
		status.textContent = 'Opponent connected. Waiting for battle setup...';
	} else if (myLocked) {
		status.textContent = opponentLocked ? 'Both moves locked. Resolving...' : `Move locked. Waiting for Player ${opponent}.`;
	} else if (opponentLocked) {
		status.textContent = `Player ${opponent} locked in. Choose your Round ${state.round} move.`;
	} else {
		status.textContent = `Round ${state.round}: choose and lock in your move.`;
	}

	renderMoves();
	renderLog();
	renderSessionLifecycle();
}

tabBattleButton.addEventListener('click', () => showTab('battle'));

document.querySelectorAll('.route-link').forEach((link) => {
	link.addEventListener('click', (event) => {
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
		event.preventDefault();
		setRoute(link.dataset.route || 'home', { push: true });
	});
});
window.addEventListener('popstate', () => setRoute(routeFromPath()));
navMenuButton?.addEventListener('click', () => {
	const open = !document.body.classList.contains('nav-open');
	document.body.classList.toggle('nav-open', open);
	navMenuButton.setAttribute('aria-expanded', String(open));
	offcanvas?.setAttribute('aria-hidden', String(!open));
});
offcanvasScrim?.addEventListener('click', closeNav);
window.addEventListener('resize', () => { if (window.innerWidth > NAV_COLLAPSE_PX) closeNav(); });
colorThemeToggle?.addEventListener('change', () => {
	localStorage.setItem(COLOR_THEME_KEY, colorThemeToggle.checked ? 'light' : 'dark');
	applyThemeSettings();
});
uiStyleToggle?.addEventListener('change', () => {
	localStorage.setItem(UI_STYLE_KEY, uiStyleToggle.checked ? 'sharp' : 'simple');
	applyThemeSettings();
});
tabSettingsButton.addEventListener('click', () => showTab('settings'));

createButton.addEventListener('click', async () => {
	createButton.disabled = true;
	try {
		const response = await fetch('/api/rooms', { method: 'POST' });
		const data = await response.json();
		connectToRoom(data.code);
	} finally {
		createButton.disabled = false;
	}
});

joinButton.addEventListener('click', () => connectToRoom(roomInput.value));
roomInput.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') connectToRoom(roomInput.value);
});
lineageSelect.addEventListener('change', () => sendMessage({ type: 'select-lineage', lineage: lineageSelect.value }));
generatePayloadButton.addEventListener('click', () => {
	const payload = buildMockDevicePayload();
	if (!payload) return;
	payloadJson.value = JSON.stringify(payload, null, 2);
	payloadStatus.textContent = 'Mock payload generated locally. Import it to send it through server validation.';
});
importPayloadButton.addEventListener('click', () => {
	let payload;
	try {
		payload = JSON.parse(payloadJson.value);
	} catch {
		payloadStatus.textContent = 'Payload is not valid JSON.';
		return;
	}
	payloadStatus.textContent = 'Sending payload to battle server...';
	sendMessage({ type: 'import-creature', creature: payload });
});
webPresetButton.addEventListener('click', () => {
	if (!playerNumber || !state) return;
	const raw = state.players[playerNumber - 1].payload.lineage;
	sendMessage({ type: 'select-lineage', lineage: raw.charAt(0).toUpperCase() + raw.slice(1) });
});
rematchButton.addEventListener('click', () => sendMessage({ type: 'rematch' }));
leaveMatchButton.addEventListener('click', () => {
	intentionalClose = true;
	clearReconnectTimer();
	sessionStorage.removeItem(ACTIVE_ROOM_KEY);
	if (currentRoomCode) {
		sessionStorage.removeItem(sessionStorageKey(currentRoomCode));
		sessionStorage.removeItem(clientModeStorageKey(currentRoomCode));
	}
	if (socket?.readyState === WebSocket.OPEN) {
		sendMessage({ type: 'leave' });
		setTimeout(() => location.reload(), 120);
	} else {
		location.reload();
	}
});
newBattleButton.addEventListener('click', () => {
	intentionalClose = true;
	clearReconnectTimer();
	sessionStorage.removeItem(ACTIVE_ROOM_KEY);
	if (currentRoomCode) {
		sessionStorage.removeItem(sessionStorageKey(currentRoomCode));
		sessionStorage.removeItem(clientModeStorageKey(currentRoomCode));
	}
	if (socket?.readyState === WebSocket.OPEN) {
		sendMessage({ type: 'leave' });
		setTimeout(() => location.reload(), 120);
	} else {
		location.reload();
	}
});

setInterval(renderSessionLifecycle, 1000);

// A normal page refresh should return this tab to its active battle
// automatically. sessionStorage keeps this scoped to the current tab.
const resumeRoomCode = sessionStorage.getItem(ACTIVE_ROOM_KEY);
if (routeFromPath() === 'connect' && resumeRoomCode && /^[A-Z2-9]{6}$/.test(resumeRoomCode) && sessionStorage.getItem(sessionStorageKey(resumeRoomCode))) {
	const storedMode = sessionStorage.getItem(clientModeStorageKey(resumeRoomCode));
	requestedClientType = storedMode === 'cardputer' ? 'cardputer' : 'web';
	clientModeSelect.value = requestedClientType;
	connectToRoom(resumeRoomCode, { reconnect: true });
}
