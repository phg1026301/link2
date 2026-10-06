import { ImageResponse } from 'next/og';
import { OG_IMAGE } from './shared-metadata';

// 링크 공유 시 표시되는 썸네일 (모든 페이지 공통)
// 기본 폰트가 한글을 지원하지 않아 이미지 내 텍스트는 영문으로 구성
export const alt = OG_IMAGE.alt;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

const ACCENT = '#2AC1BC';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${ACCENT} 0%, #1E9C98 100%)`,
          color: 'white',
        }}
      >
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: 40,
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 48,
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          }}
        >
          <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -2 }}>LINK</div>
        <div style={{ fontSize: 40, marginTop: 16, opacity: 0.9 }}>
          Save and organize your bookmarks by folder
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
