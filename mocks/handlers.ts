import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://randomfox.ca/floof/", () =>
    HttpResponse.json({ image: "https://randomfox.ca/images/108.jpg" })
  ),

  http.get("https://api.thecatapi.com/v1/images/search?limit=8", () =>
    HttpResponse.json(
      Array(10)
        .fill(null)
        .map(() => ({ url: "https://cdn2.thecatapi.com/images/17q.jpg" }))
    )
  ),
];
