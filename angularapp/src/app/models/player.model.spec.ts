import { Player } from './player.model';

describe('Player Models', () => {
  fit('Frontend_day29_should_create_Player_instance', () => {
    const player: Player = {
      name: 'John',
      age: 25,
      category: 'A',
      biddingPrice: 100,
    };
    expect(player).toBeTruthy();
    expect(player.name).toBe('John');
    expect(player.age).toBe(25);
    expect(player.category).toBe('A');
    expect(player.biddingPrice).toBe(100);
  });

});
