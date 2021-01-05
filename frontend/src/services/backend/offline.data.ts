import {
  ExampleEntitiesViewModel,
  ExampleEntityDto,
  ExampleEntityListDto,
  ExampleEnum
} from "./nswagts";

export const exampleClientOfflineData = new ExampleEntitiesViewModel({
  exampleEntities: [
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
