import mutations from "../../../../src/store/image/mutations";

describe("user mutations", () => {
  it("user object", () => {
    const state = { images: [] };

    const input = [
      {
        _id: "25253235235",
        fileName: "234243234234",
        author: "aehrrhaeta5aet5ga3453636",
        likes: [
          {
            _id: "ehaethaey5ae5yaey5"
          }
        ]
      }
    ];

    mutations.ADD_IMAGES(state, input);

    expect(state.images).toEqual(input);
  });
});
