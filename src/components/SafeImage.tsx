import { useState } from 'react';
import { Building2 } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  lazy?: boolean;
  priority?: boolean;
}

export function SafeImage({
  src,
  alt,
  className = '',
  lazy = true,
  priority = false,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0B1F3A] via-[#132D52] to-[#1D3E6D] text-white/80 p-6 ${className}`}
      >
        <Building2 className="w-10 h-10 text-[#C9A24B] mb-2" aria-hidden="true" />
        <span className="text-xs font-medium text-center max-w-[220px]">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : lazy ? 'lazy' : 'eager'}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
