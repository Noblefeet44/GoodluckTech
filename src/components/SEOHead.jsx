import { useEffect } from 'react';

export default function SEOHead({ title, description, keywords, ogImage, jsonLd }) {
  useEffect(() => {
    // Update Title
    const fullTitle = title ? `${title} | Goodluck Tech Service` : 'Goodluck Tech Service — Buy, Sell, Swap & Repair Phones in Port Harcourt';
    document.title = fullTitle;

    // Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description || "Goodluck Tech Service - Port Harcourt's #1 phone store for UK used iPhones, Samsung, trade-in swaps, and expert repairs.");
    }

    // Update OG Title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', fullTitle);
    }

    // Update OG Description
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description || "Visit UPTH 18 Everyday Plaza Choba or order nationwide.");
    }
  }, [title, description, keywords, ogImage]);

  return null;
}
