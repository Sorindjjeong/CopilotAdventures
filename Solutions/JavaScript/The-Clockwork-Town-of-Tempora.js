
/**
 * The Clockwork Town of Tempora - 시계 동기화 콘솔 애플리케이션
 *
 * 대형 시계탑(Grand Clock Tower) 시간: 15:00
 * 마을 시계: 14:45, 15:05, 15:00, 14:40
 * 각 시계가 시계탑보다 몇 분 앞섰는지/뒤처졌는지 계산
 * 오류 처리 및 명확한 콘솔 출력 포함
 */

// 시계탑 시간 정의
const grandClockTime = "15:00";

// 마을 시계 시간 배열
const clockTimes = ["14:45", "15:05", "15:00", "14:40"];

/**
 * 시간 문자열(HH:MM)을 분 단위로 변환
 * @param {string} timeStr - "HH:MM" 형식의 시간 문자열
 * @returns {number} - 총 분(minute)
 */
function timeToMinutes(timeStr) {
    const match = /^([0-9]{1,2}):([0-9]{2})$/.exec(timeStr);
    if (!match) throw new Error(`잘못된 시간 형식: ${timeStr}`);
    const [_, hour, minute] = match;
    return parseInt(hour, 10) * 60 + parseInt(minute, 10);
}

/**
 * 시계탑과의 분 차이 계산
 * @param {string} clockTime - 마을 시계 시간
 * @param {string} grandTime - 시계탑 시간
 * @returns {number} - 앞서면 양수, 뒤처지면 음수
 */
function getMinuteDifference(clockTime, grandTime) {
    return timeToMinutes(clockTime) - timeToMinutes(grandTime);
}

console.log("=== 템포라 마을 시계 동기화 결과 ===");
console.log(`대형 시계탑 시간: ${grandClockTime}`);
clockTimes.forEach((clockTime, idx) => {
    try {
        const diff = getMinuteDifference(clockTime, grandClockTime);
        const status = diff > 0 ? "앞섬" : diff < 0 ? "뒤처짐" : "동일";
        console.log(`시계 #${idx + 1} (${clockTime}): ${diff}분 (${status})`);
    } catch (err) {
        console.error(`시계 #${idx + 1} 오류: ${err.message}`);
    }
});
