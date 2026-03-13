const BASE_URL = "https://api.coingecko.com/api/v3";

export default async function fetchApi() {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1`
    );

    if (!response.ok) {
      throw new Error("Error happened");
    }

    const data = await response.json();
    return data; 

  } catch (e) {
    console.log(e);
    return [];
  }
}
