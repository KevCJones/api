import { calculateCost } from '../libs/billing-lib';

test('Lower Tier', () => {
  const amount = 1;
  expect(calculateCost(amount)).toEqual(100);
});

test('Middle Tier', () => {
  const amount = 101;
  expect(calculateCost(amount)).toEqual(8080);
});

test('Upper Tier', () => {
  const amount = 1001;
  expect(calculateCost(amount)).toEqual(50050);
});
