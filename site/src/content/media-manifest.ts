/** 자동 생성 — `node scripts/build-media.mjs` 가 씁니다. 손으로 고치지 마세요. */

/** 아직 안 들어온 그림을 화면이 건너뛰게 하려고 둡니다. */
export const BAKED_WORK_MEDIA = new Set<string>([
  'ai-cc-1',
  'ai-cc-2',
  'ai-cc-3',
  'ai-cc-4',
  'ai-cc-5',
  'autoever-cp-admin-1',
  'autoever-cp-admin-2',
  'autoever-mapgpt',
  'autoever-poi-admin',
  'blackvue-web',
  'cj-thekitchen-1',
  'dcg-shop-1',
  'dgb-capital-m-1',
  'dgb-capital-web',
  'hyundai-driving-1',
  'hyundai-driving-2',
  'hyundai-driving-3',
  'hyundai-driving-4',
  'hyundai-driving-web',
  'im-capital-mobile',
  'im-capital-web-1',
  'im-capital-web-2',
  'im-capital-web-live',
  'kt-cbs-geofencing-web',
  'kt-geofencing-osca-1',
  'kt-geofencing-osca-2',
  'kt-lbs-smart-rental-1',
  'kt-lbs-smart-rental-2',
  'kt-loc-quality-arch',
  'kt-rtk-eagleeye-1',
  'kt-rtk-eagleeye-2',
  'kt-smart-zone-cast-arch',
  'kt-szc-service',
  'kt-usafe-1',
  'mycar-history-1',
  'psnet-wps-1',
  'psnet-wps-2',
  'renault-my-1',
  'renault-my-2',
  'renault-my-3',
  'skt-zone-cast',
  'testworks-tfs',
])

/** 그림의 실제 크기 — `<img>` 에 width/height 를 박아 레이아웃이 안 흔들리게 합니다. */
const MEDIA_SIZE: Record<string, readonly [number, number]> = {
  '/media/brand/service_sol.webp': [1100, 1100],
  '/media/credentials/award-kcc.webp': [456, 698],
  '/media/credentials/award-partner-2025.webp': [546, 836],
  '/media/credentials/patent-1674367.webp': [455, 696],
  '/media/credentials/patent-2226683.webp': [454, 695],
  '/media/credentials/rnd-center.webp': [454, 696],
  '/media/credentials/sw-provider.webp': [456, 697],
  '/media/credentials/venture.webp': [456, 697],
  '/media/works/ai-cc-1.webp': [750, 1000],
  '/media/works/ai-cc-2.webp': [750, 1000],
  '/media/works/ai-cc-3.webp': [750, 1000],
  '/media/works/ai-cc-4.webp': [750, 1000],
  '/media/works/ai-cc-5.webp': [750, 1000],
  '/media/works/autoever-cp-admin-1.webp': [1229, 660],
  '/media/works/autoever-cp-admin-2.webp': [1229, 660],
  '/media/works/autoever-mapgpt.webp': [1540, 1124],
  '/media/works/autoever-poi-admin.webp': [1392, 1096],
  '/media/works/blackvue-web.webp': [1500, 767],
  '/media/works/cj-thekitchen-1.webp': [1324, 736],
  '/media/works/dcg-shop-1.webp': [1324, 736],
  '/media/works/dgb-capital-m-1.webp': [1600, 981],
  '/media/works/dgb-capital-web.webp': [1524, 1216],
  '/media/works/hyundai-driving-1.webp': [497, 884],
  '/media/works/hyundai-driving-2.webp': [497, 884],
  '/media/works/hyundai-driving-3.webp': [497, 884],
  '/media/works/hyundai-driving-4.webp': [497, 884],
  '/media/works/hyundai-driving-web.webp': [1352, 1216],
  '/media/works/im-capital-mobile.webp': [1600, 845],
  '/media/works/im-capital-web-1.webp': [1600, 879],
  '/media/works/im-capital-web-2.webp': [1600, 879],
  '/media/works/im-capital-web-live.webp': [1400, 925],
  '/media/works/kt-cbs-geofencing-web.webp': [1524, 1216],
  '/media/works/kt-geofencing-osca-1.webp': [1468, 865],
  '/media/works/kt-geofencing-osca-2.webp': [1310, 726],
  '/media/works/kt-lbs-smart-rental-1.webp': [1600, 731],
  '/media/works/kt-lbs-smart-rental-2.webp': [1600, 727],
  '/media/works/kt-loc-quality-arch.webp': [1425, 763],
  '/media/works/kt-rtk-eagleeye-1.webp': [1600, 998],
  '/media/works/kt-rtk-eagleeye-2.webp': [1036, 666],
  '/media/works/kt-smart-zone-cast-arch.webp': [1600, 662],
  '/media/works/kt-szc-service.webp': [1500, 767],
  '/media/works/kt-usafe-1.webp': [1578, 978],
  '/media/works/mycar-history-1.webp': [1324, 736],
  '/media/works/psnet-wps-1.webp': [1425, 763],
  '/media/works/psnet-wps-2.webp': [1546, 827],
  '/media/works/renault-my-1.webp': [720, 1280],
  '/media/works/renault-my-2.webp': [720, 1280],
  '/media/works/renault-my-3.webp': [720, 1280],
  '/media/works/skt-zone-cast.webp': [1524, 1216],
  '/media/works/testworks-tfs.webp': [1292, 1216],
}

/**
 * `<img {...imgSize(src)} />` 로 쓴다.
 *
 * ⚠ 모르는 주소면 **아무것도 안 돌려준다.** 어림값을 넣으면 비율이 틀려서
 *   `object-contain` 이 엉뚱한 여백을 만든다 — 없는 편이 낫다.
 * ⚠ 화면에서 크기를 CSS 로 정하더라도 이 속성은 그대로 둔다. 브라우저는 이 둘의 **비율**만
 *   써서 자리를 미리 잡고, 실제 크기는 CSS 가 이긴다.
 */
export function imgSize(src: string): { width: number; height: number } | Record<string, never> {
  const hit = MEDIA_SIZE[src]
  return hit ? { width: hit[0], height: hit[1] } : {}
}
