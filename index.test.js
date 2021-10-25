// const index = require('./index');
const oldOrder = require('./previousOrder')
const newOrder = require('./newOrder')
/**
 * @jest-environment jsdom
 */
console.log(oldOrder);
console.log(newOrder);

// test('adds 1 + 2 to equal 3', () => {
//     expect(sum(1, 2)).toBe(3);
//   });