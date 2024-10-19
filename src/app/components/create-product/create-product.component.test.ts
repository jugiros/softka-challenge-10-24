import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CreateProductComponent } from './create-product.component';
import { ProductService } from '../../services/product/product.service';
import { ProductDataService } from '../../services/product/productData.service';
import { ToastService } from '../../services/common/toast.service';
import { environment } from "../../environments/environment";
import {ProductDto} from "../../models/productDto";

class MockProductService {
  createProduct() {
    return of({});
  }
}

class MockProductDataService {
  currentProduct = of(null);
  setProduct() {}
}

class MockToastService {
  showToast() {}
}

class MockRouter {
  navigate() {}
}

describe('CreateProductComponent', () => {
  let component: CreateProductComponent;
  let fixture: ComponentFixture<CreateProductComponent>;
  let productService: ProductService;
  let toastService: ToastService;
  let router: Router;
  let productDataService: ProductDataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CreateProductComponent],
      providers: [
        FormBuilder,
        { provide: ProductService, useClass: MockProductService },
        { provide: ProductDataService, useClass: MockProductDataService },
        { provide: ToastService, useClass: MockToastService },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProductComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    toastService = TestBed.inject(ToastService);
    router = TestBed.inject(Router);
    productDataService = TestBed.inject(ProductDataService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should call createProduct when form is valid and no productToEdit', () => {
      const showToastSpy = jest.spyOn(toastService, 'showToast');
      const navigateSpy = jest.spyOn(router, 'navigate');

      const mockProduct: ProductDto = {
        id: '123',
        name: 'Nombre del producto',
        description: 'Descripción del producto',
        logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
        date_release: new Date('2024-01-01'),
        date_revision: new Date('2025-01-02')
      };

      const createProductSpy = jest.spyOn(productService, 'createProduct').mockReturnValue(of(mockProduct));

      component.form.setValue({
        id: '123',
        name: 'Nombre del producto',
        description: 'Descripción del producto',
        logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
        date_release: '2024-01-01',
        date_revision: '2025-01-02'
      });

      component.onSubmit();

      expect(createProductSpy).toHaveBeenCalledWith(environment.endpoints.postProducts, component.form.getRawValue());
      expect(showToastSpy).toHaveBeenCalledWith('Producto creado con éxito!', 'success');
      expect(navigateSpy).toHaveBeenCalledWith(['/']);
    });

    it('should not submit when form is invalid', () => {
      const createProductSpy = jest.spyOn(productService, 'createProduct');

      component.form.setValue({
        id: '',
        name: '',
        description: '',
        logo: '',
        date_release: '',
        date_revision: ''
      });

      component.onSubmit();

      expect(createProductSpy).not.toHaveBeenCalled();
    });
  });
});
