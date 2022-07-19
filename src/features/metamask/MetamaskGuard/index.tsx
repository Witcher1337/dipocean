import { useEvent, useStore } from "effector-react/scope";
import { PropsWithChildren, FunctionComponent, useEffect } from "react";

import {
  $connectionStatus,
  connectFx,
  init,
  switchChainFx,
} from "../../../shared/libs/effector-metamask";
import { connectionStatuses } from "../../../shared/libs/effector-metamask/constants";

const requiredChainId = process.env.NEXT_PUBLIC_REQUIRED_CHAIN_ID;

type Props = PropsWithChildren<{}>;

export const MetamaskGuard: FunctionComponent<Props> = ({ children }) => {
  const connectionStatus = useStore($connectionStatus);

  const handlers = useEvent({
    connect: connectFx,
    switchChain: switchChainFx,
    init,
  });

  const handleConnect = () => {
    handlers.connect({
      chain: {
        id: requiredChainId,
      },
    });
  };

  useEffect(() => {
    if (connectionStatus === connectionStatuses.idle) handlers.init();
  }, []);

  const handleSwitchChain = () => {
    handlers.switchChain({ id: requiredChainId });
  };

  const noMetamaskView = connectionStatus === connectionStatuses.notDetected && (
    <div>No metamask detected</div>
  );

  const detectedView = connectionStatus === connectionStatuses.detected && (
    <div>
      Connect metamask
      <button onClick={handleConnect}>Connect</button>
    </div>
  );

  const wrongChainView = connectionStatus === connectionStatuses.wrongChain && (
    <div>
      You connected to the wrong chain
      <button onClick={handleSwitchChain}>Switch</button>
    </div>
  );

  const errorOccuredView = connectionStatus === connectionStatuses.failed && (
    <div>
      Error occured
      <button onClick={handleConnect}>Connect</button>
    </div>
  );

  const pendingView = connectionStatus === connectionStatuses.pending && (
    <div>Waiting for confirmation...</div>
  );

  const connectedView = connectionStatus === connectionStatuses.connected && children;

  return (
    <>
      {noMetamaskView}
      {detectedView}
      {wrongChainView}
      {errorOccuredView}
      {pendingView}
      {connectedView}
    </>
  );
};
