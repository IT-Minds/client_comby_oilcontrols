import { usePagedFetched } from "hooks/usePagedFetched";
import { FC, useCallback, useReducer } from "react";
import ListReducer from "react-list-reducer";
import { genExampleClient } from "services/backend/apiClients";
import {
  CreateExampleEntityCommand,
  ExampleEntityDto,
  ExampleEnum
} from "services/backend/nswagts";

import styles from "./styles.module.css";

type Props = {
  buildTime: number;
  preLoadedData?: ExampleEntityDto[];
};

const Demo: FC<Props> = ({ buildTime, preLoadedData = [] }) => {
  const [data, dataDispatch] = useReducer(ListReducer<ExampleEntityDto>("id"), preLoadedData);

  const { done, error, fetchData } = usePagedFetched(
    (x, y, z) => genExampleClient().get(x, y, z),
    dataDispatch
  );

  const addNewData = useCallback(async () => {
    await genExampleClient().create(
      new CreateExampleEntityCommand({
        exampleEnum: ExampleEnum.A,
        name: Date.now().toString(32)
      })
    );
    await fetchData(0);
  }, []);

  return (
    <main>
      <h1 className={styles.title}>Hello World</h1>
      <h2 data-testid="buildTime" data-value={buildTime}>
        Build Time: {buildTime}
      </h2>
      <h3>Done loading: {done ? "yes" : error ? "error" : "no"}.</h3>
      <p>When data is loading it is displayed below</p>

      <pre data-testid="data" data-value={data.length}>
        {data.map(dat => (
          <div key={dat.id}>
            id: {dat.id} name: {dat.name} enum: {ExampleEnum[dat.exampleEnum]}
          </div>
        ))}
      </pre>
      <button data-testid="addNewBtn" onClick={addNewData}>
        Add new data element
      </button>
    </main>
  );
};

export default Demo;
