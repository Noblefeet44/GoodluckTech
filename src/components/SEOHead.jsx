import { useEffect } from 'react';

export default function SEOHead({ title, description, keywords, ogImage, jsonLd }) {
  useEffect(() => {
    const defaultTitle = 'Goodluck Tech Service — Buy, Sell, Swap & Repair Phones in Port Harcourt';
    const defaultDesc = "Goodluck Tech Service - Port Harcourt's #1 phone store for UK used iPhones, Samsung, trade-in swaps, and expert repairs at UPTH 18 Everyday Plaza, Choba.";
    const defaultKeywords = "Goodluck Tech Service, Buy Phone Port Harcourt, Sell Phone Choba, Swap Phone UPTH 18 Everyday Plaza, Phone Repair Choba, UK Used iPhones Nigeria, Samsung Galaxy Port Harcourt";
    const defaultImage = "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=1200&auto=format&fit=crop&q=80";

    const fullTitle = title ? `${title} | Goodluck Tech Service` : defaultTitle;
    const finalDesc = description || defaultDesc;
    const finalKeywords = keywords || defaultKeywords;
    const finalImage = ogImage || defaultImage;
    const currentUrl = window.location.href;

    // Title
    document.title = fullTitle;

    // Helper function to update or create meta tags
    const setMetaTag = (selector, attrName, attrValue, content) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper function to update link tags (e.g., canonical)
    const setLinkTag = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Standard Meta Tags
    setMetaTag('meta[name="description"]', 'name', 'description', finalDesc);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', finalKeywords);

    // Canonical Tag
    setLinkTag('canonical', currentUrl);

    // OpenGraph Meta Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', finalDesc);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', finalImage);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', currentUrl);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Goodluck Tech Service');

    // Twitter Card Meta Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', finalDesc);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', finalImage);

    // Dynamic JSON-LD Injection
    let scriptTag = document.getElementById('dynamic-jsonld');
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'dynamic-jsonld';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, keywords, ogImage, jsonLd]);

  return null;
}
