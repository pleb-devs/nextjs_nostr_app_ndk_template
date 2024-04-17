import React from "react";
import NDK, {
  NDKEvent,
  NDKFilter,
  NDKSubscriptionOptions,
} from "@nostr-dev-kit/ndk";

// Find relays at https://nostr.watch
const defaultRelays = ["wss://lunchbox.sandwich.farm"];

// Define the data that will be returned by useNDK();
type NDKContextType = {
  ndk: NDK;
  subscribeAndHandle: (
    filter: NDKFilter,
    handler: (event: NDKEvent) => void,
    opts?: NDKSubscriptionOptions
  ) => void;
};

// define this outside of the below NDKProvider component so that it is in scope for useNDK()
let NDKContext: React.Context<NDKContextType>;

export const NDKProvider = ({ children }: { children: React.ReactNode }) => {
  // create a new NDK instance to be used throughout the app
  const ndkLocal = new NDK({ explicitRelayUrls: defaultRelays });

  // use a ref to keep the NDK instance in scope for the lifetime of the component
  const ndk = React.useRef(ndkLocal);

  // Normally ndk.connect should be called asynchrounously, but in this case the instance will connect to the relays soon after the app loads
  ndk.current
    .connect() // connect to the NDK
    .then(() => console.log("Connected to NDK")) // log success
    .catch(() => console.log("Failed to connect to NDK")); // log failure

  /**
   *
   * @param filter An NDKFilter for specific events
   * @param handler A function that accepts an NDKEvent and does something with it
   * @param opts Optional NDKSubscriptionOptions. Set `{closeOnEose: false}` to keep subscriptions open after eose
   */
  const subscribeAndHandle = (
    filter: NDKFilter,
    handler: (event: NDKEvent) => void,
    opts?: NDKSubscriptionOptions
  ) => {
    // subscribe to the filter
    const sub = ndk.current.subscribe(filter, opts);

    // `sub` emits 'event' events when a new nostr event is received
    // our handler then processes the event
    sub.on("event", (e: NDKEvent) => handler(e));
  };

  // Define what will be returned by useNDK();
  const contextValue = {
    ndk: ndk.current,
    subscribeAndHandle,
  };

  // create a new context with the contextValue
  NDKContext = React.createContext(contextValue);

  // Return our new provider with `children` as components that will be wrapped by the provider
  return (
    <NDKContext.Provider value={contextValue}>{children}</NDKContext.Provider>
  );
};

// This is the hook that will be used in other components to access the NDK instance
export const useNDK = () => React.useContext(NDKContext);
