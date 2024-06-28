"use client";

import { Button } from "@mantine/core";
import React, { useEffect, useState } from "react";

import useSocket from "@/hooks/useSocket";
import { socket } from "@/utils/socket";

export function Socket() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const data = useSocket<Date>("time", () => {
    alert("TIME");
  });

  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <>
      {JSON.stringify(data)}
      <p>State: {"" + isConnected}</p>
      {isConnected ? (
        <Button onClick={disconnect}>Disconnect</Button>
      ) : (
        <Button onClick={connect}>Connect</Button>
      )}
    </>
  );
}
