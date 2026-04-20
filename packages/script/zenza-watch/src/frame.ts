import {
  CrossDomainGateWorker,
  isGateLocation,
} from "@nico-zenza/cross-domain-gate";

export default function frame() {
  const currentUrl = new URL(location.href);

  if (isGateLocation(currentUrl)) {
    const hashParams = new URLSearchParams(currentUrl.hash.substring(1));

    let worker: CrossDomainGateWorker;
    try {
      console.debug("initialize cross domain gate worker");
      worker = new CrossDomainGateWorker({
        token: hashParams.get("token"),
        origin: hashParams.get("origin"),
      });
    } catch (err: unknown) {
      console.warn("failed to initialize cross domain gate", err);
      return;
    }

    worker
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
