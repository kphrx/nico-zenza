import {CrossDomainLoader, isGateLocation} from "@nico-zenza/cross-domain-gate";

export default function loader() {
  const currentUrl = new URL(location.pathname, location.origin).toString();

  if (isGateLocation(currentUrl)) {
    const fragment = new URLSearchParams(location.hash.substring(1));
    const token = fragment.get("token"),
      origin = fragment.get("origin");

    if (token == null || origin == null) {
      console.debug("missing token/origin");
      return;
    }
    console.log("ZenzaWatch cross domain loader");
    const loader = new CrossDomainLoader({token, origin});
    loader
      .start(currentUrl)
      .then(() => {
        console.log("Cross domain loader started");
      })
      .catch((err: unknown) => {
        console.error("Cross domain loader failed", err);
      });
    return;
  }
}
