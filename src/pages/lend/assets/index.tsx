import { useStore } from "effector-react";

import { $listedAssets, fetchListedAssetsFx } from "../../../features/assets";

export const LendAssets = () => {
  const listedAssets = useStore($listedAssets);
  const isLoading = useStore(fetchListedAssetsFx.pending);

  const loadingView = isLoading && "loading...";

  const defaultView = !isLoading && (
    <div>
      {listedAssets.map((asset) => (
        <div key={asset.id}>
          <code>{JSON.stringify(asset, null, 4)}</code>
          <br />
          <br />
        </div>
      ))}
    </div>
  );

  return (
    <section>
      <h1>Listed Assets</h1>

      {loadingView}
      {defaultView}
    </section>
  );
};
