import { component$, useSignal, $, noSerialize } from "@builder.io/qwik";

export default component$(() => {
  const url = useSignal("ws://localhost:8000/ws");
  const wsRef = useSignal<any | null>(null);
  const connected = useSignal(false);
  const messages = useSignal<string[]>([]);
  const input = useSignal("");

  const connect$ = $(() => {
    if (wsRef.value) return;
    const ws = new WebSocket(url.value);

    ws.onopen = () => {
      connected.value = true;
      messages.value = [...messages.value, "Connected"];
    };

    ws.onmessage = (ev) => {
      messages.value = [...messages.value, `Received: ${ev.data}`];
    };

    ws.onclose = () => {
      connected.value = false;
      messages.value = [...messages.value, "Disconnected"];
      wsRef.value = null;
    };

    ws.onerror = () => {
      messages.value = [...messages.value, "Error"];
      // leave lifecycle to onclose
    };

    wsRef.value = noSerialize(ws);
  });

  const disconnect$ = $(() => {
    if (!wsRef.value) return;
    try {
      (wsRef.value as WebSocket).close();
    } catch (e) {
      console.error("Error during WebSocket close:", e);
    }
    wsRef.value = null;
    connected.value = false;
  });

  const send$ = $(() => {
    if (!wsRef.value) {
      messages.value = [...messages.value, "Not connected"];
      return;
    }
    try {
      (wsRef.value as WebSocket).send(input.value);
      messages.value = [...messages.value, `Sent: ${input.value}`];
      input.value = "";
    } catch (e) {
      messages.value = [...messages.value, `Send error: ${String(e)}`];
    }
  });

  return (
    <div style={{ padding: "16px", fontFamily: "system-ui, sans-serif" }}>
      <h1>Test WebSocket</h1>

      <div style={{ marginBottom: "8px" }}>
        <label>
          URL: <input value={url.value} onInput$={(e: any) => (url.value = e.target.value)} style={{ width: "320px" }} />
        </label>
      </div>

      <div style={{ marginBottom: "8px" }}>
        <button onClick$={connect$} disabled={!!wsRef.value}>
          Connect
        </button>
        <button onClick$={disconnect$} disabled={!wsRef.value} style={{ marginLeft: "8px" }}>
          Disconnect
        </button>
        <span style={{ marginLeft: "12px" }}>
          Status: {connected.value ? "connected" : "disconnected"}
        </span>
      </div>

      <div style={{ marginBottom: "8px" }}>
        <input
          value={input.value}
          onInput$={(e: any) => (input.value = e.target.value)}
          placeholder="Message to send"
          style={{ width: "300px" }}
        />
        <button onClick$={send$} style={{ marginLeft: "8px" }}>
          Send
        </button>
      </div>

      <div>
        <h3>Messages</h3>
        <div style={{ maxHeight: "300px", overflow: "auto", border: "1px solid #ddd", padding: "8px" }}>
          {messages.value.length === 0 ? (
            <div style={{ color: "#666" }}>No messages yet</div>
          ) : (
            messages.value.map((m, i) => <div key={i}>{m}</div>)
          )}
        </div>
      </div>
    </div>
  );
});
