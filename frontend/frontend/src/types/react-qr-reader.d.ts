declare module 'react-qr-reader' {
  import * as React from 'react';
  export interface QrReaderProps {
    delay?: number | false;
    onError?: (error: any) => void;
    onScan?: (data: string | null) => void;
    style?: React.CSSProperties;
    facingMode?: 'user' | 'environment';
    legacyMode?: boolean;
    className?: string;
    showViewFinder?: boolean;
    constraints?: MediaStreamConstraints;
  }
  const QrReader: React.FC<QrReaderProps>;
  export default QrReader;
}
