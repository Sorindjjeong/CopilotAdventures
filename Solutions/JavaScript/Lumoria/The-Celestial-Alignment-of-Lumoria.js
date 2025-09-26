// 테스트 및 외부 사용을 위한 내보내기
module.exports = {
  calculateLumoriaLight,
  generateAlignmentSVG,
  generateShadowAnimationSVG,
  generateLumoriaReport
};
/**
 * 그림자 변화 애니메이션 SVG 프레임 생성
 * @param {Array} planetList
 * @param {number} frames - 프레임 수
 * @returns {Array} SVG 문자열 배열
 */
function generateShadowAnimationSVG(planetList, frames = 10) {
  // 행성 각도를 변화시키며 그림자 상태를 시뮬레이션
  const width = 800, height = 200;
  const sunX = 80, sunY = height/2;
  const planetGap = 150;
  const maxAngle = Math.PI/2; // 90도
  let svgs = [];
  for (let f = 0; f < frames; f++) {
    let svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>\n`;
    svg += `<circle cx='${sunX}' cy='${sunY}' r='40' fill='gold' />\n`;
    svg += `<text x='${sunX-20}' y='${sunY+60}' font-size='18'>Lumoria Sun</text>\n`;
    // 각 프레임별 행성 위치 및 그림자 상태 계산
    planetList.forEach((p, i) => {
      const angle = (maxAngle * f / (frames-1)) + (i * 0.1);
      const px = sunX + planetGap * (i+1);
      const py = sunY + Math.sin(angle) * 60;
      const pr = Math.max(10, p.diameter/1500);
      // 그림자 상태 계산 (정확도 개선)
      const sorted = [...planetList].sort((a, b) => a.distance - b.distance);
      const idx = sorted.findIndex(pp => pp.name === p.name);
      const closer = sorted.slice(0, idx);
      let shadowType = 'None';
      let shadowColor = '#fff';
      let shadowingPlanets = [];
      closer.forEach(cp => {
        const thetaCloser = 2 * Math.atan((cp.diameter/2)/(cp.distance*149597870));
        const thetaPlanet = 2 * Math.atan((p.diameter/2)/(p.distance*149597870));
        if (thetaCloser > thetaPlanet) shadowingPlanets.push(cp);
      });
      if (shadowingPlanets.length > 1) { shadowType = 'None (Multiple Shadows)'; shadowColor = '#444'; }
      else if (shadowingPlanets.length === 1) { shadowType = 'Full'; shadowColor = '#222'; }
      else if (closer.length > 0) { shadowType = 'Partial'; shadowColor = '#888'; }
      svg += `<circle cx='${px}' cy='${py}' r='${pr}' fill='#6cf' stroke='#333' stroke-width='2' />\n`;
      svg += `<ellipse cx='${px}' cy='${py+pr+5}' rx='${pr*0.8}' ry='${pr*0.4}' fill='${shadowColor}' opacity='0.7' />\n`;
      svg += `<text x='${px-20}' y='${py+pr+20}' font-size='16'>${p.name}</text>\n`;
      svg += `<text x='${px-20}' y='${py+pr+38}' font-size='12' fill='#555'>${shadowType}</text>\n`;
    });
    svg += `<text x='${width-180}' y='${height-20}' font-size='14'>Frame ${f+1}/${frames}</text>\n`;
    svg += '</svg>';
    svgs.push(svg);
  }
  return svgs;
}
/**
 * The Celestial Alignment of Lumoria
 * Fantasy-themed console application for calculating planetary light intensity
 * Author: GitHub Copilot
 *
 * Planets:
 * - Mercuria: 0.4 AU, 4,879 km
 * - Earthia: 1 AU, 12,742 km
 * - Marsia: 1.5 AU, 6,779 km
 * - Venusia: 0.7 AU, 12,104 km
 *
 * Shadow Rules:
 * - Full: At least one closer planet is larger
 * - Partial: At least one closer planet is smaller, none larger
 * - None: No closer planets
 * - None (Multiple Shadows): More than one closer planet casts shadow
 */


// 사용자 정의 행성계 입력 지원
const readline = require('readline');
function getUserPlanets(callback) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  let planets = [];
  console.log('사용자 정의 행성계 입력 (예: 이름,거리(AU),지름(km))');
  function ask() {
    rl.question('행성 정보 입력 (엔터만 입력시 종료): ', line => {
      if (!line.trim()) {
        rl.close();
        callback(planets.length ? planets : [
          { name: 'Mercuria', distance: 0.4, diameter: 4879 },
          { name: 'Venusia', distance: 0.7, diameter: 12104 },
          { name: 'Earthia', distance: 1.0, diameter: 12742 },
          { name: 'Marsia', distance: 1.5, diameter: 6779 }
        ]);
        return;
      }
      const parts = line.split(',').map(s => s.trim());
      if (parts.length === 3) {
        planets.push({ name: parts[0], distance: parseFloat(parts[1]), diameter: parseInt(parts[2]) });
      } else {
        console.log('입력 형식 오류: 이름,거리,지름 형식으로 입력하세요.');
      }
      ask();
    });
  }
  ask();
}

/**
 * Calculates the light intensity and shadow type for each planet
 * @param {Array} planetList - Array of planet objects
 * @returns {Array} - Array of results with shadow type
 */

/**
 * 실제 천체 물리학 원리에 기반한 그림자 계산
 * closer 행성의 각도, 거리, 크기를 고려하여 그림자 여부 결정
 */
function calculateLumoriaLight(planetList) {
  // 거리순 정렬
  const sorted = [...planetList].sort((a, b) => a.distance - b.distance);
  return sorted.map((planet, idx) => {
    // 더 가까운 행성들
    const closer = sorted.slice(0, idx);
    // 그림자 판정: closer 행성의 각도(태양-행성-관측행성)와 크기, 거리로 실제 그림자 투영 여부 계산
    let shadowType = 'None';
    let shadowingPlanets = [];
    closer.forEach(cp => {
      // 실제 천체 물리학 원리 기반: closer 행성의 그림자 투영 각도와 관측 행성의 각도 비교
      // θ = 2 * atan((지름/2)/(거리*AU->km))
      const AU_TO_KM = 149597870;
      const thetaCloser = 2 * Math.atan((cp.diameter/2)/(cp.distance*AU_TO_KM));
      const thetaPlanet = 2 * Math.atan((planet.diameter/2)/(planet.distance*AU_TO_KM));
      // 그림자 투영: closer 행성의 각도가 관측 행성보다 크고, 거리 차이가 충분히 가까울 때
      if (thetaCloser > thetaPlanet && Math.abs(cp.distance - planet.distance) < 1.0) {
        shadowingPlanets.push(cp);
      }
    });
    if (shadowingPlanets.length > 1) shadowType = 'None (Multiple Shadows)';
    else if (shadowingPlanets.length === 1) shadowType = 'Full';
    else if (closer.length > 0) shadowType = 'Partial';
    return {
      ...planet,
      shadowType,
      closerCount: closer.length,
      largerCount: closer.filter(p => p.diameter > planet.diameter).length,
      smallerCount: closer.filter(p => p.diameter < planet.diameter).length,
      shadowingPlanets: shadowingPlanets.map(p => p.name)
    };
  });
}

/**
 * Prints the celestial results in a beautiful themed format
      // 상세 보고서 생성 및 저장
      const report = generateLumoriaReport(results);
      require('fs').writeFileSync('lumoria-report.txt', report);
      console.log('📄 천체 현상 상세 보고서가 lumoria-report.txt로 저장되었습니다.');
 * @param {Array} results - Array of planet results
/**
 * 천체 현상 상세 보고서 생성
 * @param {Array} results - 행성별 그림자 결과
 * @returns {string} 보고서 텍스트
 */
function generateLumoriaReport(results) {
  let report = '🌌 Lumoria Celestial Alignment Report\n';
  report += '========================================\n';
  results.forEach(p => {
    report += `\n🪐 ${p.name}\n`;
    report += `  - Distance from Sun: ${p.distance} AU\n`;
    report += `  - Diameter: ${p.diameter} km\n`;
    report += `  - Shadows Cast: ${p.closerCount}\n`;
    report += `  - Larger Planets (closer): ${p.largerCount}\n`;
    report += `  - Smaller Planets (closer): ${p.smallerCount}\n`;
    report += `  - Shadowing Planets: ${p.shadowingPlanets && p.shadowingPlanets.length ? p.shadowingPlanets.join(', ') : 'None'}\n`;
    report += `  - Shadow Type: ${p.shadowType}\n`;
  });
  report += '\n========================================\n';
  report += 'This report was generated by the Celestial Alignment of Lumoria simulation.\n';
  return report;
}
function printCelestialResults(results) {
  console.log('🌌✨ The Celestial Alignment of Lumoria ✨🌌');
  console.log('--------------------------------------------------');
  results.forEach(p => {
    console.log(`🪐 ${p.name.padEnd(10)} | Distance: ${p.distance} AU | Diameter: ${p.diameter} km`);
    console.log(`   Shadows Cast: ${p.closerCount} | Larger: ${p.largerCount} | Smaller: ${p.smallerCount}`);
    let shadowIcon = '☀️';
    if (p.shadowType === 'Full') shadowIcon = '🌑';
    else if (p.shadowType === 'Partial') shadowIcon = '🌗';
    else if (p.shadowType === 'None (Multiple Shadows)') shadowIcon = '🌑🌑';
    console.log(`   Light Intensity: ${shadowIcon}  ${p.shadowType}`);
    console.log('--------------------------------------------------');
  });
}

// Main execution
getUserPlanets(planets => {
  try {
    const results = calculateLumoriaLight(planets);
    printCelestialResults(results);
    // SVG 생성 및 출력
    const svg = generateAlignmentSVG(planets);
    require('fs').writeFileSync('lumoria-alignment.svg', svg);
    console.log('🖼️ 행성 정렬 SVG가 lumoria-alignment.svg로 저장되었습니다.');
    // 그림자 변화 애니메이션 SVG 프레임 생성 및 저장
    const animSvgs = generateShadowAnimationSVG(planets, 10);
    animSvgs.forEach((svgStr, idx) => {
      require('fs').writeFileSync(`lumoria-shadow-frame${idx+1}.svg`, svgStr);
    });
    console.log('🎞️ 그림자 변화 애니메이션 SVG 프레임들이 lumoria-shadow-frame*.svg로 저장되었습니다.');
    // 상세 보고서 생성 및 저장
    const report = generateLumoriaReport(results);
    require('fs').writeFileSync('lumoria-report.txt', report);
    console.log('📄 천체 현상 상세 보고서가 lumoria-report.txt로 저장되었습니다.');
  } catch (err) {
    console.error('🚨 Celestial misalignment detected:', err.message);
  }
});


/**
 * 행성 정렬 SVG 생성 함수
 * @param {Array} planetList
 * @returns {string} SVG 문자열
 */
function generateAlignmentSVG(planetList) {
  // SVG 캔버스 크기
  const width = 800, height = 200;
  const sunX = 80, sunY = height/2;
  const planetGap = 150;
  let svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>\n`;
  // 태양
  svg += `<circle cx='${sunX}' cy='${sunY}' r='40' fill='gold' />\n`;
  svg += `<text x='${sunX-20}' y='${sunY+60}' font-size='18'>Lumoria Sun</text>\n`;
  // 행성 정렬 및 그림자 상태 표시
  const results = calculateLumoriaLight(planetList);
  results.forEach((p, i) => {
    const px = sunX + planetGap * (i+1);
    const py = sunY;
    const pr = Math.max(10, p.diameter/1500);
    let shadowColor = '#fff';
    if (p.shadowType === 'Full') shadowColor = '#222';
    else if (p.shadowType === 'Partial') shadowColor = '#888';
    else if (p.shadowType === 'None (Multiple Shadows)') shadowColor = '#444';
    svg += `<circle cx='${px}' cy='${py}' r='${pr}' fill='#6cf' stroke='#333' stroke-width='2' />\n`;
    svg += `<ellipse cx='${px}' cy='${py+pr+5}' rx='${pr*0.8}' ry='${pr*0.4}' fill='${shadowColor}' opacity='0.7' />\n`;
    svg += `<text x='${px-20}' y='${py+pr+20}' font-size='16'>${p.name}</text>\n`;
    svg += `<text x='${px-20}' y='${py+pr+38}' font-size='12' fill='#555'>${p.shadowType}</text>\n`;
  });
  svg += `<text x='${width-180}' y='${height-20}' font-size='14'>Lumoria Alignment</text>\n`;
  svg += '</svg>';
  return svg;
}
