import mutations from "../../../../src/store/user/mutations";

describe("user mutations", () => {
  it("user object", () => {
    const state = { user: null, token: null };

    const input = {
      id: "123132123",
      username: "test",
      scope: ["user:upload", "user:admin"],
      token: "23423423423434234<wrgaergaerg"
    };

    const user = {
      id: "123132123",
      username: "test",
      scope: ["user:upload", "user:admin"]
    };

    mutations.SET_USER(state, input);

    expect(state.user).toEqual(user);
  });
});
