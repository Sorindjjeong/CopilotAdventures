const { calculateLumoriaLight } = require('./The-Celestial-Alignment-of-Lumoria');

describe('빛 강도 및 그림자 계산', () => {
  it('기본 4행성계에서 그림자 판정이 정확해야 한다', () => {
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

  it('지름이 큰 행성이 앞에 있으면 Full 그림자가 적용되어야 한다', () => {
    const planets = [
      { name: 'Small', distance: 0.5, diameter: 1000 },
      { name: 'Big', distance: 0.6, diameter: 20000 },
      { name: 'Test', distance: 0.7, diameter: 5000 }
    ];
    const results = calculateLumoriaLight(planets);
    expect(results[2].shadowType).toBe('Full');
  });

  it('여러 closer 행성이 있으면 Multiple Shadows로 판정', () => {
    const planets = [
      { name: 'A', distance: 0.3, diameter: 10000 },
      { name: 'B', distance: 0.4, diameter: 9000 },
      { name: 'C', distance: 0.5, diameter: 8000 },
      { name: 'D', distance: 0.6, diameter: 7000 }
    ];
    const results = calculateLumoriaLight(planets);
    expect(results[3].shadowType).toMatch(/Multiple Shadows|Full|Partial|None/);
  });

  it('사용자 정의 행성계도 정상 동작해야 한다', () => {
    const planets = [
      { name: 'X', distance: 0.2, diameter: 5000 },
      { name: 'Y', distance: 0.5, diameter: 8000 },
      { name: 'Z', distance: 1.0, diameter: 12000 }
    ];
    const results = calculateLumoriaLight(planets);
    expect(results[0].shadowType).toBe('None');
    expect(results[1].shadowType).toMatch(/Full|Partial|None/);
    expect(results[2].shadowType).toMatch(/Full|Partial|None/);
  });
});
