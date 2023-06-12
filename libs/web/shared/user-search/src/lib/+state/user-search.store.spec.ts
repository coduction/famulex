import { UserSearchStore } from './user-search.store';

describe('UserSearchStore', () => {
  const componentStore = new UserSearchStore();

  it('should be created', () => {
    expect(componentStore).toBeTruthy();
  });
});
