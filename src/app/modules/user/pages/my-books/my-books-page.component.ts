import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { AuthRepository } from '~modules/auth/store/auth.repository';
import { Subject, takeUntil } from 'rxjs';
import { User } from '~modules/user/shared/user.model';
import { NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeroService } from '~modules/hero/shared/hero.service';
import { Hero } from '~modules/hero/shared/hero.model';
import { TrackByService } from '~modules/shared/services/track-by.service';
import { AlertId, AlertService } from '~modules/shared/services/alert.service';
import { UtilService } from '~modules/shared/services/util.service';
import { UserService } from '~modules/user/shared/user.service';
import { Modal } from 'bootstrap';
import { Book } from '~modules/book/shared/book.model';
import { BookModalComponent } from '~modules/user/components/book-modal/book-modal.component';

@Component({
  selector: 'app-my-books-page',
  templateUrl: './my-books-page.component.html',
  styleUrls: ['./my-books-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, RouterLink, NgForOf, NgOptimizedImage, BookModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MyBooksPageComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  user: User | undefined;
  window: Window;
  userHeroes: Hero[];
  trackHero: TrackByFunction<Hero>;
  bookModal: Modal | undefined;
  bookSelected: Book | undefined;

  // eslint-disable-next-line max-params
  constructor(
    private authRepository: AuthRepository,
    private heroService: HeroService,
    private userService: UserService,
    private utilService: UtilService,
    private alertService: AlertService,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(LOCALE_ID) public locale: string,
    private document: Document
  ) {
    this.trackHero = TrackByService.trackHero;
    this.window = this.document.defaultView as Window;
    this.userHeroes = [];
  }

  ngOnInit() {
    this.authRepository.$user.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        this.user = user;
      }
    });

    // this.loadUserHeroes();
    this.bookModal = new bootstrap.Modal('#book-modal', {});
    this.changeDetectorRef.detectChanges();
  }

  // loadUserHeroes() {
  //   this.userService
  //     .getMe()
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(user => {
  //       if (user) {
  //         this.userHeroes = Object.assign([], user.heroes);
  //         this.changeDetectorRef.markForCheck();
  //       }
  //     });
  // }

  openBookModal(book?: Book) {
    if (book) {
      this.bookSelected = book;
    } else {
      this.bookSelected = new Book({
        id: '',
        bookName: '',
        category: '',
        price: '',
        releaseDate: new Date(),
        author: ''
      });
    }
    this.bookModal?.show();
    this.changeDetectorRef.markForCheck();
  }

  deleteHero(hero: Hero) {
    this.heroService
      .deleteHero(hero.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.userHeroes = this.userHeroes.filter(userHero => userHero.id !== hero.id);
        this.alertService.create(AlertId.HERO_DELETED);
        this.changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
