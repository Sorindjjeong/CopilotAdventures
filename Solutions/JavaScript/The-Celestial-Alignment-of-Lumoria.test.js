// The-Celestial-Alignment-of-Lumoria.test.js
// 빛 강도 및 그림자 계산 유닛 테스트
const { calculateLumoriaLight } = require('./Lumoria/The-Celestial-Alignment-of-Lumoria');

describe('calculateLumoriaLight', () => {
  it('기본 4행성 시스템에서 그림자 판정이 올바른지', () => {
    const planets = [
      { name: 'Mercuria', distance: 0.4, diameter: 4879 },
      { name: 'Venusia', distance: 0.7, diameter: 12104 },
      { name: 'Earthia', distance: 1.0, diameter: 12742 },
      { name: 'Marsia', distance: 1.5, diameter: 6779 }
    ];
    const results = calculateLumoriaLight(planets);
    expect(results[0].shadowType).toBe('None');
    expect(results[1].shadowType).toMatch(/Full|Partial|None/);
    expect(results[2].shadowType).toMatch(/Full|Partial|None/);
    expect(results[3].shadowType).toMatch(/Full|Partial|None/);
  });

  it('행성 크기와 거리 변화에 따라 그림자 판정이 달라지는지', () => {
    const planets = [
      { name: 'A', distance: 0.5, diameter: 10000 },
      { name: 'B', distance: 0.6, diameter: 5000 },
      { name: 'C', distance: 0.7, diameter: 20000 }
    ];
    const results = calculateLumoriaLight(planets);
    expect(results[1].shadowType).not.toBe('None');
    expect(results[2].shadowType).not.toBe('None');
  });
});
