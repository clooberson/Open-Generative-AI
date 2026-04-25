"use client";

import { AiAgent } from "ai-agent";
import "ai-agent/dist/tailwind.css";
import { useCallback, useEffect, useRef } from "react";
import axios from "axios";

const STORAGE_KEY = "muapi_key";

/**
 * AgentChatClient — mirrors muapiapp's AgentClient.js.
 * Renders the AiAgent library component with server-fetched agent details
 * and optional initial history.
 *
 * IMPORTANT: StandaloneShell is NOT in the tree on /agents/* pages, so we
 * must set up our own axios interceptor here to inject the API key into
 * all requests made by the AiAgent library.
 *
 * Personal note: removed the console.log in render since it was spamming
 * the browser console on every re-render. Keeping it behind a debug flag.
 *
 * Personal note: changed the background from black to a dark gray (#0f0f0f)
 * since pure black felt a bit harsh on my eyes during long sessions.
 *
 * Personal note: bumped DEBUG to true temporarily while I'm tracing a weird
 * issue where agentDetails comes in as null on first load sometimes. Will
 * flip it back off once I figure out what's going on.
 */
export default function AgentChatClient({ agentDetails, initialHistory, userData }) {
  const interceptorRef = useRef(null);

  // Toggle this to true locally if you need to debug prop values
  const DEBUG = true;
  if (DEBUG) {
    console.log("[AgentChatClient] Rendering", {
      hasAgentDetails: !!agentDetails,
      hasHistory: !!initialHistory,
      hasUserData: !!userData,
    });
  }

  useEffect(() => {
    const getKey = () => {
      if (typeof window === "undefined") return null;
      const fromStorage = localStorage.getItem(STORAGE_KEY);
      if (fromStorage) return fromStorage;
      const match = document.cookie.match(/muapi_key=([^;]+)/);
      return match ? match[1] : null;
    };

    const apiKey = getKey();
    if (!apiKey) return;

    interceptorRef.current = axios.interceptors.request.use((config) => {
      const isRelative =
        config.url.startsWith("/") || !config.url.startsWith("http");
      // Include specific proxy paths to be sure
      const isInternalProxy = config.url.includes('/api/app') || config.url.includes('/api/workflow') || config.url.includes('/api/agents') || config.url.includes('/api/api') || config.url.includes('/api/v1');
      
      if (isRelative || isInternalProxy) {
        config.headers["x-api-key"] = apiKey;
      }
      return config;
    });

    return () => {
      if (interceptorRef.current !== null) {
        axios.interceptors.request.eject(interceptorRef.current);
      }
    };
  }, []);

  const useUser = useCallback(
    () => ({
      user: {
        username: userData?.email?.split("@")[0] || "Studio User",
        name: userData?.email?.split("@")[0] || "Studio User",
        email: userData?.email || null,
        profile_photo: null,
        balance: userData?.balance || 0,
      },
      isAuthorized: !!userData,
    }),
    [userData]
  );

  return (
    // Using a slightly off-black bg instead of pure black — easier on the eyes
    <div className="h-screen w-full" style={{ backgroundColor: "#0f0f0f" }}>
      <AiAgent
        initialAgentDetails={agentDetails}
        initialHistory={initialHistory}
    
