import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product/product.service';
import { ToastService } from '../../services/common/toast.service';
import { ModalService } from '../../services/common/modal.service';
import { ProductDataService } from '../../services/product/productData.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

class MockProductService {
  getAllProducts(endpointKey: string) {
    return of({ data: [] });
  }
  deleteProduct(endpointKey: string, id: string) {
    return of({});
  }
}

class MockToastService {
  showToast() {}
}

class MockModalService {
  open() {
    return Promise.resolve(true);
  }
}

class MockProductDataService {
  setProduct() {}
}

class MockRouter {
  navigate() {}
}

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: ProductService;
  let toastService: ToastService;
  let modalService: ModalService;
  let productDataService: ProductDataService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent, CommonModule, FormsModule],
      providers: [
        { provide: ProductService, useClass: MockProductService },
        { provide: ToastService, useClass: MockToastService },
        { provide: ModalService, useClass: MockModalService },
        { provide: ProductDataService, useClass: MockProductDataService },
        { provide: Router, useClass: MockRouter }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    toastService = TestBed.inject(ToastService);
    modalService = TestBed.inject(ModalService);
    productDataService = TestBed.inject(ProductDataService);
    router = TestBed.inject(Router);
    fixture.detectChanges();


    spyOn(productService, 'getAllProducts').and.callThrough();
    spyOn(productService, 'deleteProduct').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadProducts', () => {
    it('should load products and filter them', () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', description: 'Description 1', logo: '', date_release: new Date(), date_revision: new Date() },
        { id: '2', name: 'Product 2', description: 'Description 2', logo: '', date_release: new Date(), date_revision: new Date() }
      ];

      (productService.getAllProducts as jasmine.Spy).and.returnValue(of({ data: mockProducts }));

      component.loadProducts();

      expect(component.products).toEqual(mockProducts);
      expect(component.paginatedProducts).toEqual(mockProducts.slice(0, component.pageSize));
    });

    it('should handle error when loading products', () => {
      (productService.getAllProducts as jasmine.Spy).and.returnValue(throwError(() => new Error('Error')));

      spyOn(toastService, 'showToast');

      component.loadProducts();

      expect(toastService.showToast).toHaveBeenCalledWith('Error al consumir el servicio!', 'error');
    });
  });
});
