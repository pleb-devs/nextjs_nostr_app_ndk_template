import { useEffect, useState } from "react";
import { useNDK } from "@/hooks/useNDK";
import { NDKEvent, NDKFilter, NDKKind } from "@nostr-dev-kit/ndk";

export default function Home() {
  const [mostRecentEvent, setMostRecentEvent] = useState({});

  // Import subscribeAndHandle that has our global instance of NDK
  const { subscribeAndHandle } = useNDK();

  useEffect(() => {
    // Filter for kind 1 (Text) events
    // CHALLENGE: Filter for only kind 1 posted by a specific npub
    const filter: NDKFilter = {
      kinds: [NDKKind.Text],
    };

    const handler = (event: NDKEvent) => {
      setMostRecentEvent(event.rawEvent()); // event.rawEvent() returns json without all the NDK methods
    };

    // subscribe to kind 1 events and when they are received, set the most
    // recent event. The closeOnEose option will close the subscription when the relay sends an eose event
    subscribeAndHandle(filter, handler, { closeOnEose: true });
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-1/2 mx-auto bg-gray-600 p-4 rounded-lg shadow-lg overflow-auto">
        <pre className="whitespace-pre-wrap">
          {/* Simply display the most recent event */}
          {JSON.stringify(mostRecentEvent, null, 2)}
        </pre>
      </div>
    </main>
  );
}
