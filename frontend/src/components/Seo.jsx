import { useEffect } from "react";

function setMeta(name, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setOg(property, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href) {
  if (!href) return;
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function Seo({ title, description, image, path, jsonLd }) {
  useEffect(() => {
    const url = path?.startsWith("http")
      ? path
      : `${window.location.origin}${path || window.location.pathname}`;
    if (title) document.title = title;
    setMeta("description", description);
    setMeta("robots", "index,follow");
    setOg("og:title", title);
    setOg("og:description", description);
    setOg("og:type", "website");
    setOg("og:url", url);
    if (image) setOg("og:image", image);
    setCanonical(url);
  }, [title, description, image, path]);

  useEffect(() => {
    let scriptEl = document.getElementById("__jsonld");
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.type = "application/ld+json";
        scriptEl.id = "__jsonld";
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }
  }, [jsonLd]);

  return null;
}
