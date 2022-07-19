import { useGate, useStore } from "effector-react/scope";

import { AssetCard } from "../../../../entities/assets";
import { $ownAssets, fetchOwnAssetsFx, ownAssetsListGate } from "../../model";

// import styles from "./styles.module.scss";
const styles: any = {};

export const OwnAssets = () => {
  const ownAssets = useStore($ownAssets);
  const isLoading = useStore(fetchOwnAssetsFx.pending);

  useGate(ownAssetsListGate, []);

  const loadingView = isLoading && "loading...";

  const defaultView =
    !isLoading &&
    ownAssets.map((asset) => (
      <AssetCard
        key={asset.id}
        title={asset.title}
        image={asset.image}
        link={`/assets/${asset.contract.address}/${Number(asset.tokenId)}`}
      />
    ));

  return (
    <section>
      <h1>Your own NFTs</h1>
      <div className={styles.listLayout}>
        {loadingView}
        {defaultView}
      </div>
    </section>
  );
};
