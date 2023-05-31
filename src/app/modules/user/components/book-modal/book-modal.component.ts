import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormErrorsComponent } from '~modules/shared/components/form-errors/form-errors.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { translations } from '../../../../../locale/translations';
import { Subject, takeUntil } from 'rxjs';
import { User } from '~modules/user/shared/user.model';
import { HeroService } from '~modules/hero/shared/hero.service';
import { Modal } from 'bootstrap';
import { Book } from '~modules/book/shared/book.model';

@Component({
  selector: 'app-book-modal',
  templateUrl: './book-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, FormErrorsComponent, ReactiveFormsModule, NgClass, NgForOf],
})
export class BookModalComponent implements OnChanges, OnDestroy {
  @Input() modal: Modal | undefined;
  @Input() user: User | undefined;
  @Input() bookSelected: Book | undefined;
  @Input() booksList: Book[] | undefined;

  destroy$: Subject<boolean> = new Subject<boolean>();
  translations: typeof translations;
  bookForm: FormGroup | undefined;
  isButtonLoading: boolean;
  bookName: FormControl | undefined;
  category: FormControl | undefined;
  price: FormControl | undefined;
  releaseDate: FormControl | undefined;
  author: FormControl | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private heroService: HeroService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.translations = translations;
    this.isButtonLoading = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['bookSelected']) {
      this.bookSelected = changes['bookSelected'].currentValue;
      if (this.bookSelected) {
        if (!this.bookForm) {
          this.createForm();
        } else {
          this.bookForm.reset();
        }
      }
    }
  }

  createForm() {
    this.bookName = new FormControl<string>('', [Validators.required]);
    this.category = new FormControl<string>('', [Validators.required]);
    this.price = new FormControl<string>('', [Validators.required]);
    this.releaseDate = new FormControl<string>('', [Validators.required]);
    this.author = new FormControl<string>('', [Validators.required]);
    this.bookForm = this.formBuilder.group({
      bookName: this.bookName,
      category: this.category,
      price: this.price,
      releaseDate: this.releaseDate,
      author: this.author,
    });
  }

  sendForm() {
    // if (this.bookForm?.valid) {
    //   this.heroService
    //     .createHero(this.bookForm.getRawValue())
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe(book => {
    //       if (book) {
    //         this.heroesList?.push(book);
    //         this.closeModal();
    //         this.changeDetectorRef.detectChanges();
    //       }
    //     });
    // }
  }

  closeModal() {
    this.modal?.hide();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
