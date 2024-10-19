import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductDto } from "../../models/productDto";
import {BaseService} from "../BaseService";

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService<ProductDto> {

  createProduct(endpointKey: string, product: ProductDto): Observable<ProductDto> {
    return this.create(endpointKey, product);
  }

  getAllProducts(endpointKey: string): Observable<any> {
    return this.getAll(endpointKey);
  }

  getValidationId(endpointKey: string, id: string): Observable<boolean> {
    return this.getValidateById(endpointKey, id);
  }

  deleteProduct(endpointKey: string, id: string) {
    return this.delete(endpointKey, id);
  }

  updateProduct(endpointKey: string, id: string, product: ProductDto) {
    return this.update(endpointKey, id, product);
  }
}
