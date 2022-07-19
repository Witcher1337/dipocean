import { useStore } from "effector-react/scope";

import { $assetDetails, fetchAssetsMetadata } from "../../model";

// import styles from "./styles.module.scss";
const styles: any = {};

export const AssetInfo = () => {
  const details = useStore($assetDetails);
  const loading = useStore(fetchAssetsMetadata.pending);

  const loadingView = loading && "loading...";

  const defaultView = !loading && details && (
    <article>
      <img className={styles.image} src={details.metadata?.image} alt="asset image" />
      <ul>
        <li>
          <span>
            <b>Last Update: </b>
          </span>
          {details.timeLastUpdated}
        </li>
        <li>
          <span>
            <b>Name: </b>
          </span>
          {details?.title}
        </li>
        <li>
          <span>
            <b>Description: </b>
          </span>
          {details?.description}
        </li>
      </ul>
    </article>
  );

  return (
    <section>
      <h2>Details</h2>
      {loadingView}
      {defaultView}
    </section>
  );
};
