import { GroupSearchStore } from "./group-search.store";

describe("UserSearchStore", () => {
  const componentStore = new GroupSearchStore();

  it("should be created", () => {
    expect(componentStore).toBeTruthy();
  });
});
