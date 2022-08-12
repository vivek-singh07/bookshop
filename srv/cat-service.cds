using {my.bookshop as my} from '../db/schema';

service AdminService @(requires : 'admin') {
    entity Books   as projection on my.Books;
    entity Authors as projection on my.Authors;
}
 
service CatalogService @(path : '/browse') {
    @readonly
    entity ListOfBooks as projection on Books excluding {
        descr
    };

    @readonly
    entity Books       as projection on my.Books {
        *, 
        author.name as author 
    } excluding {
        createdAt,
        createdBy,
        modifiedAt,
        modifiedBy
    };

    action submitOrder(book : Books:ID, quantity : Integer) returns {
        stock : Integer
    };

    event OrderedBook : {
        book     : Books:ID;
        quantity : Integer;
        buyer    : String
    }
}
