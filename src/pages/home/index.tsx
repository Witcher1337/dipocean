import { Link } from "react-router-dom";
import "../../shared/libs/effector-ethers";

export const Home = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/borrow/assets">Own NFTs</Link>
        </li>
        <li>
          <Link to="/lend/assets">Listed NFTs</Link>
        </li>
      </ul>
    </div>
  );
};
