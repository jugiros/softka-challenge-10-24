import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {getMinDateRevision, marginErrorValidator} from "../../functions/common";
import {ProductDto} from "../../models/productDto";
import {ProductService} from "../../services/product/product.service";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";
import {ToastService} from "../../services/common/toast.service";
import {debounceTime, distinctUntilChanged, of, Subscription, switchMap} from "rxjs";
import {ProductDataService} from "../../services/product/productData.service";

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent implements OnInit, OnDestroy{

  form!: FormGroup;
  today: string = '';
  minDateRevision: string = '';
  productToEdit: ProductDto | null = null;

  idValidationSubscription$: Subscription = new Subscription();
  private productSubscription$: Subscription = new Subscription();

  private readonly endpointCreate = environment.endpoints.postProducts;
  private readonly endpointValidateId = environment.endpoints.verificationProduct;
  private readonly endpointUpdateId = environment.endpoints.putProducts;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private productDataService: ProductDataService,
    private toastService: ToastService
  ) {
  }

  private initializeForm() {
    this.form = this.formBuilder.group({
      id: ["", [Validators.required, marginErrorValidator(3, 10)]],
      name: ["", [Validators.required, marginErrorValidator(5, 100)]],
      description: ["", [Validators.required, marginErrorValidator(10, 200)]],
      logo: ["", [Validators.required]],
      date_release: ["", [Validators.required]],
      date_revision: ["", [Validators.required]]
    });

    this.form.patchValue({
      date_release: this.today
    });
    this.minDateRevision = getMinDateRevision(this.today);

    this.setupIdValidation();
  }

  setupIdValidation() {
    const idControl = this.form.get('id');
    if (idControl) {
      this.idValidationSubscription$.unsubscribe();

      let previousId: string | null = null;

      this.idValidationSubscription$ = idControl.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap(id => {
          if (!id || id === previousId) {
            return of(null);
          }

          previousId = id;

          idControl.setErrors({
            ...idControl.errors,
            validating: true
          });
          return this.productService.getValidationId(this.endpointValidateId, id).pipe(
            switchMap(validationResult => {
              if (validationResult && !this.productToEdit) {
                idControl.setErrors({
                  ...idControl.errors,
                  idTaken: true
                });
              } else {
                idControl.clearValidators();
                idControl.setValidators([Validators.required, marginErrorValidator(3, 10)]);
                idControl.updateValueAndValidity();
              }

              return of(null);
            })
          );
        })
      ).subscribe();
    }
  }

  resetForm() {
    this.form.reset({
      id: this.productToEdit ? this.productToEdit.id : '',
      name: this.productToEdit ? this.productToEdit.name : '',
      description: this.productToEdit ? this.productToEdit.description : '',
      logo: this.productToEdit ? this.productToEdit.logo : '',
      date_release: this.productToEdit ? this.productToEdit.date_release : this.today,
      date_revision: this.productToEdit ? this.productToEdit.date_revision : ''
    });
    if (this.productToEdit) {
      this.form.controls["id"].disable();
    } else {
      this.form.controls["id"].enable();
    }
  }

  onDateReleaseChange(event: Event) {
    const dateRelease = (event.target as HTMLInputElement).value;
    this.minDateRevision = getMinDateRevision(dateRelease);
  }

  goBack() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.form.markAsTouched();
    this.form.markAllAsTouched();
    this.form.markAsDirty();

    if (!this.form.valid) {
      return;
    }

    const product: ProductDto = this.form.getRawValue();

    if (this.productToEdit) {
      this.productService.updateProduct(this.endpointUpdateId, product.id, product).subscribe({
        next: (response) => {
          this.toastService.showToast('Producto actualizado con éxito!', 'success');
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.toastService.showToast('Error al actualizar el producto!', 'error');
        }
      });
    } else {
      this.productService.createProduct(this.endpointCreate, product).subscribe({
        next: (response) => {
          this.toastService.showToast('Producto creado con éxito!', 'success');
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.toastService.showToast('Error al crear el producto!', 'error');
        }
      });
    }
  }

  ngOnInit() {
    this.today = new Date().toISOString().split('T')[0];
    this.productSubscription$ = this.productDataService.currentProduct.subscribe(product => {
      this.productToEdit = product || null;
      this.initializeForm();
      this.resetForm();
    });
  }

  ngOnDestroy() {
    if (this.productSubscription$) {
      this.productSubscription$.unsubscribe();
    }
    if (this.idValidationSubscription$) {
      this.idValidationSubscription$.unsubscribe();
    }
    this.productDataService.setProduct(null);
  }

}
