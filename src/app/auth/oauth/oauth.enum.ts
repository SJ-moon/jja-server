export enum SocialProvider {
  GOOGLE = 'google',
  NAVER = 'naver',
  KAKAO = 'kakao',
}

export type SocialProviderValues = typeof SocialProvider[keyof typeof SocialProvider];

export enum SocialProviderUrl {
  GOOGLE_AUTH = 'https://oauth2.googleapis.com',
  GOOGLE_API = 'https://www.googleapis.com',
}
