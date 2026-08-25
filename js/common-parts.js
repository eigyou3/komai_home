// 共通パーツを読み込んで、対応するプレースホルダーに差し込む。
// 全て差し込み終わったら、フッターの実寸などが必要な他スクリプト向けに
// 'includesLoaded' イベントをdocumentに発火する。
(() => {
    const targets = document.querySelectorAll('[data-include]');

    const loaders = Array.from(targets).map((el) => {
        const path = el.getAttribute('data-include');

        return fetch(path)
            .then((res) => {
                if (!res.ok) throw new Error(`${path} の読み込みに失敗しました（${res.status}）`);
                return res.text();
            })
            .then((html) => {
                el.outerHTML = html;
            })
            .catch((err) => {
                console.error(err);
            });
    });

    Promise.all(loaders).then(() => {
        document.dispatchEvent(new Event('includesLoaded'));
    });
})();

// フッターの「インスタ」ボタン → Instagramアカウント選択モーダル。
(() => {
    document.addEventListener('click', (e) => {
        const openBtn = e.target.closest('#footerInstagramBtn');
        if (openBtn) {
            const overlay = document.getElementById('instagramModalOverlay');
            if (overlay) overlay.classList.add('is-active');
            return;
        }

        const closeBtn = e.target.closest('#instagramModalClose');
        const overlay = document.getElementById('instagramModalOverlay');
        if (closeBtn || e.target === overlay) {
            if (overlay) overlay.classList.remove('is-active');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        const overlay = document.getElementById('instagramModalOverlay');
        if (overlay) overlay.classList.remove('is-active');
    });
})();