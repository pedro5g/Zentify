import { codeGenerate } from '../code-generate';

test('Generate random code', async () => {
  const codes: string[] = [];

  for (let i = 0; i < 10; i++) {
    codes.push(codeGenerate());
  }

  expect(codes).toHaveLength(10);
  codes.forEach((code) => {
    expect(code.length).toBe(10);
  });
});
