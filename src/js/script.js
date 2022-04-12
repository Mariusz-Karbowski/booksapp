{
  'use strict';

  const select = {
    templateOf: {
      books: '#template-book' 
    },
    list: {
      booksList: '.books-list'
    },
    product: {
      name: '.book_name',      
      bookImg: 'book__image',
      filters: '.filters',
    }
  };

  const template = {
    books: Handlebars.compile(document.querySelector(select.templateOf.books).innerHTML)
  };

  class BookList{
    constructor(){
      const thisBookList = this;
      thisBookList.initData();
      thisBookList.render();
      thisBookList.getElements();
      thisBookList.initAction();
    }
    initData(){
      this.data = dataSource.books;
      this.favoriteBooks = [];
      this.titleFilters = [];
    }
    render(){
      const thisBookList = this;
      for (let book of dataSource.books){
        const ratingBgc = thisBookList.determineRating(book.rating);
        book.ratingBgc = ratingBgc;
        const ratingWidth = book.rating * 10;
        book.ratingWidth = ratingWidth;        
        const generateHTML = template.books(book);
        const generateDOM = utils.createDOMFromHTML(generateHTML);
        const booksList = document.querySelector(select.list.booksList);
        booksList.appendChild(generateDOM);
      }
    }
    getElements(){
      const thisBookList = this;
      thisBookList.dom = {};
      thisBookList.dom.booksList = document.querySelector(select.list.booksList);
      thisBookList.dom.bookFilter = document.querySelector(select.product.filters);
    }
    initAction(){
      const thisBookList = this;      
      thisBookList.dom.booksList.addEventListener('dblclick', function(event){
        event.preventDefault();    
        const clickedElement = event.target.offsetParent;    
        if(clickedElement.classList.contains('favorite')) {
          clickedElement.classList.remove('favorite');
          thisBookList.favoriteBooks.splice(clickedElement, 1);
        } else {
          clickedElement.classList.add('favorite');
          thisBookList.favoriteBooks.push(clickedElement);
        }
      });    
      thisBookList.dom.bookFilter.addEventListener('click', function(event){    
        const clickedElement = event.target;    
        if(clickedElement.tagName == 'INPUT' && clickedElement.type == 'checkbox' && clickedElement.name == 'filter'){            
          if(clickedElement.checked){
            thisBookList.titleFilters.push(clickedElement.value);
          } else {
            const filterRemove = thisBookList.titleFilters.indexOf(clickedElement.value);    
            thisBookList.titleFilters.splice(filterRemove, 1);
          }
        }
        thisBookList.filterBooks();
      }); 
    }
    filterBooks(){
      const thisBookList = this;
      for(let book of dataSource.books){
        let shouldBeHidden = false;    
        const filterBook = document.querySelector('.book__image[data-id="' + book.id + '"]');    
        for(const filter of thisBookList.titleFilters){
          if(!book.details[filter]){
            shouldBeHidden = true;
            break;
          }
        }    
        if(shouldBeHidden === true){
          filterBook.classList.add('hidden');
        } else{
          filterBook.classList.remove('hidden');
        }
      }
    }
    determineRating(rating){
      if(rating < 6){
        return 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)';
      } else if(rating > 6 && rating <= 8){
        return 'linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)';
      } else if(rating > 8 && rating <= 9){
        return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else if(rating > 9){
        return 'linear-gradient(to bottom, #ff0084 0%, #ff0084 100%)';
      }
    } 
  }

  const app = new BookList();
}