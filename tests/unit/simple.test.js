describe('Simple Test Suite', () => {
  test('Basic math operation', () => {
    expect(1 + 1).toBe(2);
  });

  test('String operations', () => {
    const str = 'LightningChart';
    expect(str.length).toBe(14);
    expect(str.includes('Chart')).toBe(true);
  });

  test('Array operations', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(arr.length).toBe(5);
    expect(arr[0]).toBe(1);
  });
});