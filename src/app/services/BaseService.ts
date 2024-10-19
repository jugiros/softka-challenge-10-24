import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from '../environments/environment';
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService<T> {
  protected baseUrlApi: string;

  constructor(protected http: HttpClient) {
    this.baseUrlApi = environment.baseUrlApi;
  }

  private getEndpointUrl(endpoint: string, id?: string): string {
    let url = `${this.baseUrlApi}${endpoint}`;
    if (id !== undefined) {
      url = url.replace('{id}', id);
    }
    return url;
  }

  getAll(endpointKey: string): Observable<T[]> {
    const url = this.getEndpointUrl(endpointKey);
    return this.http.get<T[]>(url);
  }

  getValidateById(endpointKey: string, id: string): Observable<boolean> {
    const url = this.getEndpointUrl(endpointKey, id);
    return this.http.get<boolean>(url);
  }

  create(endpointKey: string, item: T): Observable<T> {
    const url = this.getEndpointUrl(endpointKey);
    return this.http.post<T>(url, item);
  }

  update(endpointKey: string, id: string, item: T): Observable<T> {
    const url = this.getEndpointUrl(endpointKey, id);
    return this.http.put<T>(url, item);
  }

  delete(endpointKey: string, id: string): Observable<void> {
    const url = this.getEndpointUrl(endpointKey, id);
    return this.http.delete<void>(url);
  }
}
