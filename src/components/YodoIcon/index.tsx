import React, { memo, useEffect, useState } from "react";
import { IconType } from "./types";

import { cx } from "@utils";
import "./css.css";

interface Props {
  type: IconType;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  pointer?: boolean;
  spin?: boolean;
  onClick?: () => void;
}

const local: Record<string, string> = {};

const SageIcon: React.FC<Props> = memo(
  ({ type, size = 16, className, style, pointer, spin, onClick }) => {
    const [svgContent, setSvgContent] = useState(local[type] || "");

    useEffect(() => {
      if (local[type]) {
        setSvgContent(local[type]);
        return;
      }

      fetchAndCacheSVG(type)
        .then((data) => {
          local[type] = data;
          setSvgContent(data);
        })
        // eslint-disable-next-line no-console
        .catch((error) => console.error("Error fetching SVG:", error));
    }, [type, svgContent]);

    return (
      <div
        style={{
          width: size,
          height: size,
          minWidth: size,
          ...(style || {}),
        }}
        className={cx("SageIcon", className, pointer && "cursor-pointer", spin && "animate-spin")}
        dangerouslySetInnerHTML={{ __html: svgContent }}
        onClick={onClick}
      />
    );
  },
);

SageIcon.displayName = "SageIcon";

const fetchAndCacheSVG = async (type: string) => {
  const cacheName = "svg-icons-cache";
  const url = `/icons/${type}.svg`;
  const ttl = process.env.NODE_ENV === "development" ? 1 : 86400000;

  // Open the specified cache
  const cache = await caches.open(cacheName);

  // Try to get the SVG from the cache
  const cachedResponse = await cache.match(url);

  if (cachedResponse) {
    const cachedTime = await cache.match(`${url}-timestamp`);

    if (cachedTime) {
      const timeStored = await cachedTime.text();
      const currentTime = Date.now();

      if (currentTime - parseInt(timeStored, 10) < ttl) {
        return cachedResponse.text();
      }
      // Cached item is old, delete it
      await cache.delete(url);
      await cache.delete(`${url}-timestamp`);
    }
  }

  // Fetch the SVG from the network
  const networkResponse = await fetch(url);

  if (!networkResponse.ok) {
    throw new Error(`Network response was not ok for ${url}`);
  }

  // Cache the newly fetched SVG
  await cache.put(url, networkResponse.clone());

  return networkResponse.text();
};

export default SageIcon;
