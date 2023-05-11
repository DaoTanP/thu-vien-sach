export class Book
{
    constructor(
        public id: string = '',
        public title: string = 'Book Title',
        public imgUrl: string = 'https://via.placeholder.com/360x480',
        public author: string = 'Author Name',
        public publisher: string = 'Publisher Name',
        public publishDate: string = '1/1/2017',
        public description: string = 'Book description',
    ) { }
}
