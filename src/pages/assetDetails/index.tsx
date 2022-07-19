import { useParams } from "react-router-dom";

import { useLifeCycle, withStart } from "shared/libs/page-routing";

import { AssetInfo } from "../../features/assets";
import { ListingForm } from "../../features/assets/ui/ListingForm";
import { MetamaskGuard } from "../../features/metamask";

import * as pageModel from "./model";

// import styles from "./styles.module.scss";
const styles: any = {};

export const AssetDetails = withStart(pageModel.mounted, () => {
  const params = useParams<pageModel.PageParams>();

  useLifeCycle(
    {
      mount: pageModel.mounted,
      unmount: pageModel.unmounted,
    },
    [params.contractAddress, params.tokenId],
  );

  return (
    <MetamaskGuard key={`${params.contractAddress}${params.tokenId}`}>
      <section className={styles.layout}>
        <AssetInfo />
        <ListingForm />
      </section>
    </MetamaskGuard>
  );
});
