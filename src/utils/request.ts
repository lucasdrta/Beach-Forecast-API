import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface RequestConfig extends AxiosRequestConfig{}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Response<T = any> extends AxiosResponse{}

export class Request {
  constructor(private request = axios) {}

  public get<T>(url: string, config: RequestConfig = {}): Promise<Response<T>> {
    return this.request.get<T, Response<T>>(url, config)
  }

  public static isResposeError(error: AxiosError): boolean {
    return !!(error.response && error.response.status)
  }
}
