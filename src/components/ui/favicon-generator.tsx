import React from 'react';

// Utility component to generate favicon from HITAM tree logo
export const generateHITAMFavicon = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return null;
  
  // Set canvas size for favicon
  canvas.width = 32;
  canvas.height = 32;
  
  // Fill with HITAM green background
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(0, 0, 32, 32);
  
  // Draw simplified tree icon
  ctx.strokeStyle = '#ffffff';
  ctx.fillStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  
  // Tree trunk
  ctx.beginPath();
  ctx.moveTo(16, 28);
  ctx.lineTo(16, 20);
  ctx.stroke();
  
  // Tree canopy (simplified)
  ctx.beginPath();
  ctx.arc(16, 16, 8, 0, Math.PI * 2);
  ctx.fill();
  
  // Convert to data URL
  return canvas.toDataURL('image/png');
};

// Component to update favicon dynamically
export const HITAMFaviconUpdater: React.FC = () => {
  React.useEffect(() => {
    const faviconUrl = generateHITAMFavicon();
    if (faviconUrl) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (link) {
        link.href = faviconUrl;
      }
    }
  }, []);

  return null;
};