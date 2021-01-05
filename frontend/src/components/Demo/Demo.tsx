import { FC, useCallback, useEffect, useState } from "react";
import { genExampleClient } from "services/backend/apiClients";
import {
  CreateExampleEntityCommand,
  ExampleEntitiesViewModel,
  ExampleEnum
} from "services/backend/nswagts";
import { logger } from "utils/logger";

import styles from "./styles.module.css";

type Props = {
  buildTime: number;
};

const Demo: FC<Props> = ({ buildTime }) => {
  const [data, setData] = useState<ExampleEntitiesViewModel["exampleEntities"]>([]);

  const fetchData = useCallback(async () => {
    try {
      const exampleClient = genExampleClient();
      const data = await exampleClient.get();
      if (data?.exampleEntities && data.exampleEntities.length > 0) setData(data.exampleEntities);
      else logger.info("exampleClient.get no data");
    } catch (err) {
      // logger.warn("exampleClient.get Error", err);
      console.error(err);
    }
  }, []);

  const addNewData = useCallback(async () => {
    const exampleClient = genExampleClient();
    await exampleClient.create(
      new CreateExampleEntityCommand({
        exampleEnum: ExampleEnum.A,
        name: Date.now().toString(32)
      })
    );
    await fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <main>
      <h1 className={styles.title}>Hello World</h1>
      <h2 data-testid="buildTime" data-value={buildTime}>
        Build Time: {buildTime}
      </h2>
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
