import { type APIRoute } from "astro";
import { stationSearch } from "../../utils/entur/stationSearch";

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const search = (await request.formData()).get("search") as string;

  const res = await stationSearch(search);

  if (res && res[0]) {
    return redirect(`/station/${res[0].id}`);
  }

  return redirect(`/404`);
};
