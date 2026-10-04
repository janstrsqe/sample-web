import React from 'react';
import { createRoot } from 'react-dom/client';
import WeddingWebsite from './WeddingWebsite';

const params = new URLSearchParams(window.location.search);
const root = createRoot(document.getElementById('root'));
root.render(<WeddingWebsite guestName={params.get('to') || ''} />);
