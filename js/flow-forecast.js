// TOPページ「家づくりの流れ」リンクに表示する引き渡し目安の計算
//
// ※ flow.html の SCHEDULE SIMULATOR と同じ工程・休暇ロジックを使っています。
//    「平屋（最短パターン）」で、今日契約した場合の引き渡し月を計算しています。
//    flow.html 側の steps 配列（工程内容・日数）を変更した場合は、
//    下の stepDays（平屋＝steps[].days[0]の並び）もあわせて更新してください。
(function () {
    // 長期休暇の判定（flow.htmlのisHoliday()と同じ内容）
    function isHoliday(date) {
        const m = date.getMonth() + 1; // 1〜12
        const d = date.getDate();

        // ゴールデンウィーク（4/29～5/5）
        if ((m === 4 && d >= 29) || (m === 5 && d <= 5)) return true;

        // お盆休み（8/13～8/16）
        if (m === 8 && d >= 13 && d <= 16) return true;

        // 年末年始（12/27～1/7）
        if (m === 12 && d >= 27) return true;
        if (m === 1 && d <= 7) return true;

        return false;
    }

    // 指定した開始日からnumDays日間のうち、休暇日が何日含まれるかを数える
    function countHolidaysInRange(startDate, numDays) {
        let count = 0;
        for (let i = 0; i < numDays; i++) {
            const d = new Date(startDate.getTime());
            d.setDate(d.getDate() + i);
            if (isHoliday(d)) count++;
        }
        return count;
    }

    // 平屋（最短パターン）の各工程の日数。flow.html steps[].days[0] と同じ並び。
    // 最後の「お引渡し」は0日なので、そこまでの合計日数が引き渡し目安になる。
    const stepDays = [0, 0, 7, 30, 7, 30, 2, 7, 14, 30, 20, 0, 7, 0, 0];

    // baseDateに契約した場合の「お引渡し」到達日を計算
    function calcHandoverDate(baseDate) {
        let cumulativeDays = 0;
        for (let i = 0; i < stepDays.length - 1; i++) {
            const stepStartDate = new Date(baseDate.getTime());
            stepStartDate.setDate(stepStartDate.getDate() + cumulativeDays);
            const holidayExtra = countHolidaysInRange(stepStartDate, stepDays[i]);
            cumulativeDays += stepDays[i] + holidayExtra;
        }
        const result = new Date(baseDate.getTime());
        result.setDate(result.getDate() + cumulativeDays);
        return result;
    }

    // 日付から「上旬/中旬/下旬」を判定（flow.htmlのgetFormattedDate()と同じ区切り）
    function periodLabel(day) {
        if (day <= 10) return '上旬';
        if (day <= 20) return '中旬';
        return '下旬';
    }

    const mainEl = document.querySelector('#flowForecast .nav-forecast-main');
    if (!mainEl) return;

    const handoverDate = calcHandoverDate(new Date());
    const month = handoverDate.getMonth() + 1;
    const period = periodLabel(handoverDate.getDate());
    mainEl.textContent = `ただいまのご契約のお引き渡し目安：${month}月${period}頃`;
})();