import { ExampleEntityDto, ExampleEnum, PageResultOfExampleEntityDto } from "./nswagts";

export const exampleClientOfflineData = new PageResultOfExampleEntityDto({
  hasMore: false,
  results: [
    new ExampleEntityDto({
      id: 1,
      name: "mock-1",
      exampleEnum: ExampleEnum.A,
      createdAt: "001",
      updatedAt: "002"
    })
  ]
});
