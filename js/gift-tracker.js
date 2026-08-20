// 「コンセプト・施工事例・お客様の声・家づくりの流れ」4ページ巡回でギフトが解放される仕組み。
(function () {
    const currentScript = document.currentScript;
    const PAGE_ID = currentScript ? currentScript.getAttribute('data-page-id') : null;
    const STORAGE_KEY = 'komaiGift';
    const TARGET_PAGES = ['concept', 'works', 'voice', 'flow'];

    if (!PAGE_ID || !TARGET_PAGES.includes(PAGE_ID)) {
        console.error('gift-tracker.js: data-page-id が正しく指定されていません。', PAGE_ID);
        return;
    }

    function loadState() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch (e) {
            return {};
        }
    }
    function saveState(state) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    const state = loadState();
    state.visited = state.visited || {};

    const wasComplete = TARGET_PAGES.every(id => state.visited[id]);
    const showFirstVisitModal = !state.firstModalShown;

    state.visited[PAGE_ID] = true;
    if (showFirstVisitModal) state.firstModalShown = true;

    const nowComplete = TARGET_PAGES.every(id => state.visited[id]);
    const showUnlockModal = nowComplete && !wasComplete && !state.unlockModalShown;
    if (showUnlockModal) state.unlockModalShown = true;

    saveState(state);

    if (!showFirstVisitModal && !showUnlockModal) return;

    function buildModal(title, text) {
        const overlay = document.createElement('div');
        overlay.className = 'gift-modal-overlay';
        overlay.innerHTML =
            '<div class="gift-modal">' +
                '<button type="button" class="gift-modal-close" aria-label="閉じる">' +
                    '<span class="material-symbols-outlined">close</span>' +
                '</button>' +
                '<div class="gift-modal-body">' +
                    '<p class="gift-modal-title">' + title + '</p>' +
                    '<p class="gift-modal-text">' + text + '</p>' +
                '</div>' +
            '</div>';
        document.body.appendChild(overlay);
        requestAnimationFrame(function () { overlay.classList.add('is-active'); });

        function close() {
            overlay.classList.remove('is-active');
            setTimeout(function () { overlay.remove(); }, 300);
        }
        overlay.querySelector('.gift-modal-close').addEventListener('click', close);
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) close();
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (showUnlockModal) {
            buildModal(
                'ギフト獲得！',
                '4ページすべてご覧いただき、ありがとうございます。ギフトが解放されました。好きなタイミングでTOPページに戻って受け取ってください。'
            );
        } else if (showFirstVisitModal) {
            buildModal(
                'ちょっとしたお知らせ',
                'コンセプト・施工事例・お客様の声・家づくりの流れ、4つのページすべてをご覧いただいた方に、ささやかなギフトをご用意しています。'
            );
        }
    });
})();