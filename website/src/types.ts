export interface CaptchaImage {
  id: string;
  text: string;
  imageUrl: string;
}

export interface Dataset {
  id: string;
  name: string;
  captchas: CaptchaImage[];
}