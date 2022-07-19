import { FunctionComponent } from "react";
import { Link } from "react-router-dom";

// import styles from "./styles.module.scss";

const styles:any = {};

type Props = {
  title: string;
  image?: string;
  link: string;
};

export const AssetCard: FunctionComponent<Props> = ({ title, image, link }) => (
  <article className={styles.box}>
    <img className={styles.image} src={image} alt={title} />

    <div className={styles.details}>
      <h3>{title}</h3>

      <Link to={link}>Show details</Link>
    </div>
  </article>
);
