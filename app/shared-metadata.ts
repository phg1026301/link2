import type { Metadata } from 'next';

export const SITE_NAME = '링크';
export const SITE_DESCRIPTION = '흩어진 즐겨찾기 링크를 폴더별로 모아 체계적으로 관리하는 북마크 앱';

// app/opengraph-image.tsx 로 생성되는 공유 썸네일
export const OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: '링크 - 즐겨찾기 링크를 폴더별로 관리하는 북마크 앱',
  type: 'image/png',
};

export const baseOpenGraph = {
  type: 'website',
  locale: 'ko_KR',
  siteName: SITE_NAME,
} satisfies Metadata['openGraph'];

// 페이지에서 openGraph/twitter를 지정하면 루트 값과 파일 기반 썸네일을 통째로 덮어쓰므로
// 공통 값과 썸네일을 함께 채워서 반환
export const pageSocialMetadata = (
  title: string,
  description: string,
  url: string
): Pick<Metadata, 'openGraph' | 'twitter'> => ({
  openGraph: {
    ...baseOpenGraph,
    title: `${title} | ${SITE_NAME}`,
    description,
    url,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${title} | ${SITE_NAME}`,
    description,
    images: [OG_IMAGE],
  },
});
