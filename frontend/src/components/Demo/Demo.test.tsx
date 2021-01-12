import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FetchMock from "fetch-mock";
import _fetchMock from "isomorphic-unfetch";
import { ExampleEntityDto, PageResultOfExampleEntityDto } from "services/backend/nswagts";
import { exampleClientOfflineData } from "services/backend/offline.data";

import Demo from "./Demo";

const fetchMock = (_fetchMock as unknown) as typeof FetchMock;

describe("AppName render", () => {
  const OLD_ENV = process.env;
  const OLD_DOCUMENT_EVENT = document.createEvent;
  const OLD_WINDOW_EVENT = window.addEventListener;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    (process as any).browser = false;
    document.createEvent = OLD_DOCUMENT_EVENT;
    window.addEventListener = OLD_WINDOW_EVENT;

    fetchMock.restore();
    fetchMock.reset();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("renders with offline data", async () => {
    process.env.TEST_NAME = "renders with offline data";
    process.env.NEXT_PUBLIC_OFFLINE = "true";

    render(<Demo buildTime={1001} />);
    await waitFor(() => expect(fetchMock.called()).toEqual(false));

    expect(screen.getByTestId("buildTime")).toHaveAttribute("data-value", "1001");
    expect(screen.getByTestId("data")).toHaveAttribute("data-value", "1");
  });

  it("renders on browser with offline data", async () => {
    process.env.TEST_NAME = "renders with offline data";
    process.env.NEXT_PUBLIC_OFFLINE = "true";

    const map: any = {};
    window.addEventListener = jest.fn((event, cb) => {
      map[event] = cb;
    });

    document.createEvent = jest.fn((event: string) => {
      return new Event(event);
    }) as any;

    fetchMock.mock(/.*/, {
      status: 200,
      body: exampleClientOfflineData
    });

    render(<Demo buildTime={1001} />);
    await waitFor(() => expect(fetchMock.called()).toEqual(false));

    expect(screen.getByTestId("buildTime")).toHaveAttribute("data-value", "1001");
    expect(screen.getByTestId("data")).toHaveAttribute("data-value", "1");
  });

  it("renders with mock data", async () => {
    process.env.TEST_NAME = "renders with mock data";
    render(<Demo buildTime={1001} />);

    fetchMock.mock(/.*/, {
      status: 200,
      body: exampleClientOfflineData
    });

    await waitFor(() => expect(fetchMock.calls().length).toEqual(3));

    expect(screen.getByTestId("data")).toHaveAttribute("data-value", "1");
  });

  it("renders even with no data", async () => {
    process.env.TEST_NAME = "renders even with no data";
    fetchMock.mock(/.*/, {
      status: 204,
      body: null
    });

    render(<Demo buildTime={1001} />);

    await waitFor(() => expect(fetchMock.calls().length).toEqual(3));

    expect(screen.getByTestId("data")).toHaveAttribute("data-value", "0");
  });

  it("renders even with error", async () => {
    process.env.TEST_NAME = "renders even with error";
    fetchMock.mock(/.*/, {
      status: 404,
      ok: false,
      body: null
    });

    render(<Demo buildTime={1001} />);

    await waitFor(() => expect(fetchMock.calls().length).toEqual(3));

    expect(screen.getByTestId("data")).toHaveAttribute("data-value", "0");
  });

  it("renders even with empty data", async () => {
    process.env.TEST_NAME = "renders even with empty data";

    fetchMock.mock(/.*/, {
      body: new PageResultOfExampleEntityDto({
        results: []
      })
    });

    render(<Demo buildTime={1001} />);

    await waitFor(() => expect(fetchMock.calls().length).toEqual(3));

    expect(screen.getByTestId("data")).toHaveAttribute("data-value", "0");
  });

  it("renders even continuos page", async () => {
    process.env.TEST_NAME = "renders even with empty data";
    process.env.NEXT_PUBLIC_MAX_FETCH_PAGES = "2";

    fetchMock.mock(/.*/, {
      body: new PageResultOfExampleEntityDto({
        hasMore: true,
        newNeedle: "0",
        results: [new ExampleEntityDto({})]
      })
    });

    render(<Demo buildTime={1001} />);

    await waitFor(() => expect(fetchMock.calls().length).toEqual(3));

    expect(screen.getByTestId("data")).toHaveAttribute("data-value", "1");
  });

  it("Clicks button successfully", async () => {
    process.env.TEST_NAME = "Clicks button successfully";

    fetchMock.mock(/.*/, {
      body: exampleClientOfflineData
    });

    render(<Demo buildTime={1001} />);

    await waitFor(() => expect(fetchMock.calls().length).toEqual(3));

    const asb = screen.getByTestId("addNewBtn");

    await act(async () => {
      userEvent.click(asb);
    });

    expect(fetchMock.calls().length).toEqual(5);
  });
});
