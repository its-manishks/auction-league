import { Team } from './team.model';

describe('Team Models', () => {
  fit('Frontend_day29_should_create_Team_instance', () => {
    const team: Team = {
      name: 'Team A',
      maximumBudget: 1000000
    };
    expect(team).toBeTruthy();
    expect(team.name).toBe('Team A');
    expect(team.maximumBudget).toBe(1000000);
  });


});
