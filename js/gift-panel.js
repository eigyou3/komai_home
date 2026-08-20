        (function () {
            const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzeTkwi6mABKBoN0CYcfzVJNyfscRcPszjli48TTMn6cX4WtWz3WY5ArXCwpyyJQNUlwA/exec';
            const REFERRAL_URL = 'https://eigyou3.github.io/referral_form/';
            const STORAGE_KEY = 'komaiGift';
            const TARGET_PAGES = ['concept', 'works', 'voice', 'flow'];

            function loadState() {
                try {
                    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
                } catch (e) {
                    return {};
                }
            }

            const navItem = document.getElementById('giftNavItem');
            const navBtn = document.getElementById('giftNavBtn');
            const overlay = document.getElementById('giftModalOverlay');
            const closeBtn = document.getElementById('giftModalClose');

            const steps = {
                locked: document.getElementById('giftStepLocked'),
                choice: document.getElementById('giftStepChoice'),
                ob: document.getElementById('giftStepOb'),
                conditionCheck: document.getElementById('giftStepConditionCheck'),
                form: document.getElementById('giftStepForm'),
                done: document.getElementById('giftStepDone'),
                already: document.getElementById('giftStepAlready'),
            };

            let isUnlocked = false;

            // ロック状態の判定とボタン見た目の更新をまとめた関数
            function refreshUnlockState() {
                const state = loadState();
                state.visited = state.visited || {};
                isUnlocked = TARGET_PAGES.every(id => state.visited[id]);

                if (navItem) {
                    navItem.classList.remove('is-locked', 'is-unlocked');
                    navItem.classList.add(isUnlocked ? 'is-unlocked' : 'is-locked');
                }
            }

            refreshUnlockState();

            // 「戻る」ボタンでbfcacheから復元されたときに再チェックする
            window.addEventListener('pageshow', function (e) {
                if (e.persisted) {
                    refreshUnlockState();
                }
            });

            function showStep(name) {
                Object.keys(steps).forEach(key => {
                    if (steps[key]) steps[key].hidden = (key !== name);
                });
            }

            function openModal() {
                showStep(isUnlocked ? 'choice' : 'locked');
                if (overlay) overlay.classList.add('is-active');
            }

            function closeModal() {
                if (overlay) overlay.classList.remove('is-active');
            }

            if (navBtn) {
                navBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    openModal();
                });
            }
            if (closeBtn) closeBtn.addEventListener('click', closeModal);
            if (overlay) {
                overlay.addEventListener('click', function (e) {
                    if (e.target === overlay) closeModal();
                });
            }

            // OB／検討中の選択 → 決定ボタンの活性化
            const decideBtn = document.getElementById('giftDecideBtn');
            document.querySelectorAll('input[name="giftStatus"]').forEach(radio => {
                radio.addEventListener('change', function () {
                    if (decideBtn) decideBtn.disabled = false;
                });
            });

            if (decideBtn) {
                decideBtn.addEventListener('click', function () {
                    const selected = document.querySelector('input[name="giftStatus"]:checked');
                    if (!selected) return;
                    showStep(selected.value === 'ob' ? 'ob' : 'conditionCheck');
                });
            }

            // お引き渡し済みの方 → You too, me too を新しいタブで開く
            const obOpenBtn = document.getElementById('giftObOpenBtn');
            if (obOpenBtn) {
                obOpenBtn.addEventListener('click', function () {
                    window.open(REFERRAL_URL, '_blank', 'noopener');
                    closeModal();
                });
            }

            // 検討中の方 → 条件確認 → フォームへ
            const conditionOkBtn = document.getElementById('giftConditionOkBtn');
            if (conditionOkBtn) {
                conditionOkBtn.addEventListener('click', function () {
                    showStep('form');
                });
            }

            // 検討中の方 → メール送信（GASの購読エンドポイントを type=gift で流用）
            const giftForm = document.getElementById('giftForm');
            const giftEmailInput = document.getElementById('giftEmailInput');
            const giftSubmitBtn = document.getElementById('giftSubmitBtn');
            const giftFormMessage = document.getElementById('giftFormMessage');

            if (giftForm) {
                giftForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    const email = (giftEmailInput.value || '').trim();
                    if (!email) return;

                    giftSubmitBtn.disabled = true;
                    if (giftFormMessage) {
                        giftFormMessage.textContent = '送信中...';
                        giftFormMessage.className = 'subscribe-message';
                    }

                    fetch(GAS_WEB_APP_URL, {
                        method: 'POST',
                        body: new URLSearchParams({ email: email, type: 'gift' }),
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.result === 'success') {
                                showStep(data.alreadyApplied ? 'already' : 'done');
                            } else {
                                if (giftFormMessage) {
                                    giftFormMessage.textContent = data.message || '送信に失敗しました。時間をおいて再度お試しください。';
                                    giftFormMessage.className = 'subscribe-message is-error';
                                }
                                giftSubmitBtn.disabled = false;
                            }
                        })
                        .catch(() => {
                            if (giftFormMessage) {
                                giftFormMessage.textContent = '送信に失敗しました。時間をおいて再度お試しください。';
                                giftFormMessage.className = 'subscribe-message is-error';
                            }
                            giftSubmitBtn.disabled = false;
                        });
                });
            }
        })();