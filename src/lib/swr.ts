type Fetcher = <T>(input: RequestInfo, init?: RequestInit) => Promise<T>;

const fetcher: Fetcher = async <T>(input: RequestInfo, init?: RequestInit): Promise<T> => {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

export { fetcher }