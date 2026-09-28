export type ResultData = {
  message: string;
  deviceId: string;
};

export type PushResponse = {
  resultCode: string;
  resultData: ResultData;
};
