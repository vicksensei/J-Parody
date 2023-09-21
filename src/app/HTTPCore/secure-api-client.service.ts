import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, mergeMap, retry, tap } from 'rxjs/operators';
interface SecureApiClientFormData<T> {
  key: string;
  data: any;
}

@Injectable({
  providedIn: 'root',
})
export class SecureApiClient {
  constructor(
    private _httpClient: HttpClient,
  ) {}

  public getBinary(url: string): Observable<Blob> {
    return this._httpClient.get(url, {
      headers: this.getBinaryRequestHeaders(),
      responseType: 'blob',
    });
  }
  public uploadFile<T>(url: string, file: File): Observable<T> {
    const _formData: FormData = new FormData();
    _formData.append('file', file, file.name);
    return this._httpClient.post<T>(url, _formData, {
      headers: this.getBinaryRequestHeaders(),
    });
  }
  
  public postFormData<T>(
    url: string,
    formData: SecureApiClientFormData<T>[]
  ): Observable<T> {
    const _formData = new FormData();
    formData.forEach(d => {
      if (d.data instanceof File) {
        _formData.append(`${d.key}`, d.data, d.data.name);
      } else if (d.data instanceof Blob) {
        const blob: any = d.data;
        const file: File = <File>blob;
        _formData.append(`${d.key}`, d.data, file.name);
      } else {
        _formData.append(`${d.key}`, JSON.stringify(d.data));
      }
    });
    return this._httpClient.post<T>(url, _formData, {
      headers: this.getBinaryRequestHeaders(),
    });
  }
  
  public get<T>(url: string): Observable<T> {
    return this._httpClient.get<T>(url, { headers: this.getRequestHeaders() });
  }

  public post<T>(url: string, model: T, headers?: HttpHeaders): Observable<T> {
    return this._httpClient.post<T>(url, model, {
      headers: this.getRequestHeaders(headers),
    });
  }

  public postById<T>(url: string, id: number, headers?: HttpHeaders): Observable<T> {
    return this._httpClient.post<T>(url, id, {
      headers: this.getRequestHeaders(headers),
    });
  }

  public put<T>(url: string, model: T): Observable<T> {
    return this._httpClient.put<T>(url, model, {
      headers: this.getRequestHeaders(),
    });
  }

  public patch<T>(url: string, model: T): Observable<T> {
    return this._httpClient.patch<T>(url, model, {
      headers: this.getRequestHeaders(),
    });
  }

  public delete(url: string): Observable<any> {
    return this._httpClient.delete(url, {
      headers: this.getRequestHeaders(),
    });
  }

  private getRequestHeaders(additionalHeaders?: HttpHeaders): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Prefer', 'allowthrottleablequeries')
      .set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
      .set(
        'Access-Control-Allow-Headers',
        'Origin, Content-Type, X-Auth-Token'
      );
    if (!!additionalHeaders) {
      additionalHeaders.keys().forEach(k => {
        headers = headers.set(k, additionalHeaders.get(k)!);
      });
    }
    return headers;
  }

  private getBinaryRequestHeaders(
    additionalHeaders?: HttpHeaders
  ): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
      .set(
        'Access-Control-Allow-Headers',
        'Origin, Content-Type, X-Auth-Token'
      );
    if (!!additionalHeaders) {
      additionalHeaders.keys().forEach(k => {
        headers = headers.set(k, additionalHeaders.get(k)!);
      });
    }
    return headers;
  }
}
