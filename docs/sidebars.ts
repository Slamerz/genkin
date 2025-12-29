import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '@genkin/core',
      items: [
        'core/getting-started',
        'core/creating-amounts',
        'core/operations',
        'core/currencies',
        'core/precision-and-rounding',
        'core/custom-calculators',
      ],
    },
    {
      type: 'category',
      label: '@genkin/currencies',
      items: [
        'currencies/getting-started',
        'currencies/iso4217',
      ],
    },
    {
      type: 'category',
      label: '@genkin/dinero (Dinero.js v1)',
      items: [
        'dinero/migration-guide',
        'dinero/api-reference',
      ],
    },
    {
      type: 'category',
      label: '@genkin/dinero-v2 (Dinero.js v2)',
      items: [
        'dinero-v2/migration-guide',
        'dinero-v2/api-reference',
        'dinero-v2/generic-types',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/genkin-class',
        'api/operations',
        'api/types',
      ],
    },
  ],
};

export default sidebars;
