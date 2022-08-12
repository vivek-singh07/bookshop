using {
    Currency,
    managed,
    sap,
    cuid
} from '@sap/cds/common';

namespace my.bookshop;

entity Books : managed {
    key ID       : Integer;
        title    : localized String(111);
        descr    : localized String(1111);
        stock    : Integer;
        price    : Decimal(9, 2);
        currency : Currency;
        author   : Association to Authors;
}

entity Authors : managed {
    key ID   : Integer;
        name : String(111);
        books: Association to many Books on books.author = $self
}

