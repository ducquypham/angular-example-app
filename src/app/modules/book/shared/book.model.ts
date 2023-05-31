export class Book {
    id: string;
    bookName: string;
    category: string;
    price: string;
    releaseDate: Date;
    author: string;
    
  
    // eslint-disable-next-line complexity
    constructor(book: Book) {
      this.id = book?.id;
      this.bookName = book?.bookName;
      this.category = book?.category;
      this.price = book?.price;
      this.releaseDate = book?.releaseDate;
      this.author = book?.author;
    }
  }
  