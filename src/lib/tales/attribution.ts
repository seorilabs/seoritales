/**
 * Amazon Attribution 링크. 책마다 다른 maas 해시가 붙는다.
 *
 * 출처: Amazon Ads 콘솔 > Campaign Manager > Measurement & Reporting >
 * Amazon Attribution, 캠페인 `seoritales-website` (2026-09-11 생성).
 * 콘솔이 내려준 URL 을 **그대로** 둔다 — 조립하지 않는다. 형식이 바뀌어도
 * 다시 받아 붙이기만 하면 된다.
 *
 * 비밀값이 아니다. 사이트에 그대로 노출되는 공개 링크다.
 */
export const attributionUrls: Record<string, string> = {
	// book-1-sun-and-moon (B0H7QQ9KZT)
	'the-sun-and-the-moon':
		'https://www.amazon.com/dp/B0H7QQ9KZT?maas=maas_adg_24F05E0356AA4FF5EECEE1BB38BCE070_afap_abs&ref_=aa_maas&tag=maas',
	// book-2-rabbit-dragon-king (B0H7HC9CH1)
	'the-rabbit-and-the-dragon-king':
		'https://www.amazon.com/dp/B0H7HC9CH1?maas=maas_adg_5A37216AF0275CB1C305FAF3923CE411_afap_abs&ref_=aa_maas&tag=maas',
	// book-3-heungbu-nolbu (B0H82MZZWY)
	'heungbu-and-nolbu':
		'https://www.amazon.com/dp/B0H82MZZWY?maas=maas_adg_72BE2D89CC8FE63BFB593A699E1BD2FA_afap_abs&ref_=aa_maas&tag=maas',
	// book-4-fairy-woodcutter (B0H68ZCNDJ)
	'the-fairy-and-the-woodcutter':
		'https://www.amazon.com/dp/B0H68ZCNDJ?maas=maas_adg_EA0D3587FF574544AEC298D70B603AF1_afap_abs&ref_=aa_maas&tag=maas'
};
