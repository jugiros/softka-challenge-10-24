import {Injectable} from "@angular/core";
import {ProductDto} from "../../models/productDto";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductDataService {
  private productSource = new BehaviorSubject<ProductDto | null>(null);
  currentProduct = this.productSource.asObservable();

  setProduct(product: ProductDto | null) {
    this.productSource.next(product);
  }
}
