import { Routes } from '@angular/router';
import {ProductListComponent} from "./components/product-list/product-list.component";
import {CreateProductComponent} from "./components/create-product/create-product.component";

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'create-edit', component: CreateProductComponent }
];
