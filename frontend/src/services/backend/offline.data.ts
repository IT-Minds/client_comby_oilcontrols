import {
  ExampleEntityDto,
  ExampleEntityListDto,
  ExampleEnum,
  PageResultOfExampleEntityDto
} from "./nswagts";

export const exampleClientOfflineData = new PageResultOfExampleEntityDto({
  hasMore: false,
  results: [
    new ExampleEntityDto({
      id: 1,
      name: "mock-1",
      exampleEnum: ExampleEnum.A,
      exampleEntityList: new ExampleEntityListDto({
        id: 5,
        name: "mock-list-1"
      })
    })
  ]
});
