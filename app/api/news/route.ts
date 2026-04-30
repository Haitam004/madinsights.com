export async function GET() {
  try {
    const API_KEY = "d7kv8u9r01qiqbcvskl0d7kv8u9r01qiqbcvsklg";

    const res = await fetch(
      `https://finnhub.io/api/v1/news?category=general&token=${API_KEY}`
    );

    const data = await res.json();

    if (!data || data.length === 0) {
      return Response.json([]);
    }

    const formatted = data.slice(0, 10).map((n: any) => {
      const title = n.headline.toLowerCase();

      let impact = "Faible";
      let score = 0;

      if (title.includes("inflation") || title.includes("cpi")) {
        impact = "Haut";
        score += 9;
      }

      if (title.includes("rate") || title.includes("fed")) {
        impact = "Haut";
        score += 10;
      }

      if (title.includes("gdp") || title.includes("growth")) {
        impact = "Moyen";
        score += 5;
      }

      return {
        title: n.headline,
        source: n.source,
        impact,
        score
      };
    });

    return Response.json(formatted);

  } catch (error) {
    console.error(error);
    return Response.json([]);
  }
}