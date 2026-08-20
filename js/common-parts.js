// 共通パーツを読み込む用
(() => {
    const targets = document.querySelectorAll('[data-include]');

    targets.forEach((el) => {
        const path = el.getAttribute('data-include');

        fetch(path)
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
})();