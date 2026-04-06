"use client";

import { useLayoutEffect, useState } from "react";

type PrimaryDownloadLinkProps = {
  windowsUrl: string | null;
  linuxUrl: string | null;
  fallbackUrl: string;
  className?: string;
  children: React.ReactNode;
};

type NavigatorUAData = { platform?: string };

function pickDownloadHref(
  windowsUrl: string | null,
  linuxUrl: string | null,
  fallbackUrl: string,
): string {
  const ua = navigator.userAgent.toLowerCase();
  const uaData = (navigator as Navigator & { userAgentData?: NavigatorUAData })
    .userAgentData;
  const platform = uaData?.platform?.toLowerCase() ?? "";

  const isWindows =
    /windows|win32|win64|wow64|wince/i.test(ua) || platform === "windows";
  if (isWindows) {
    return windowsUrl || fallbackUrl;
  }

  if (/android/i.test(ua)) {
    return fallbackUrl;
  }

  const isLinux = /linux/i.test(ua) || platform === "linux";
  if (isLinux) {
    return linuxUrl || fallbackUrl;
  }

  return fallbackUrl;
}

export function PrimaryDownloadLink({
  windowsUrl,
  linuxUrl,
  fallbackUrl,
  className,
  children,
}: PrimaryDownloadLinkProps) {
  const ssrHref = linuxUrl || fallbackUrl;
  const [href, setHref] = useState(ssrHref);

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- First paint must match SSR (linux); then set OS-specific URL after mount.
    setHref(pickDownloadHref(windowsUrl, linuxUrl, fallbackUrl));
  }, [windowsUrl, linuxUrl, fallbackUrl]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
