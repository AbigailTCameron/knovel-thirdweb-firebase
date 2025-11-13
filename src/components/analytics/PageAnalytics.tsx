"use client"
import { getFirebaseAnalytics } from '@/lib/initAnalytics';
import { logEvent } from 'firebase/analytics';
import React, { useEffect } from 'react'

type Props = {
  pageTitle: string;
  pagePath: string;
}

function PageAnalytics({pageTitle, pagePath}: Props) {
    useEffect(() => {
    (async () => {
      const analytics = await getFirebaseAnalytics();
      if (!analytics) return;
      logEvent(analytics, "page_view", {
        page_title: pageTitle,
        page_path: pagePath,
      });
    })();
  }, [pageTitle, pagePath]);

  return null; 
}

export default PageAnalytics