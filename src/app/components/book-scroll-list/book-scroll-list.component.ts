import { Component, Input } from '@angular/core';
import { Book } from 'src/app/models/book';

@Component({
  selector: 'app-book-scroll-list',
  templateUrl: './book-scroll-list.component.html',
  styleUrls: ['./book-scroll-list.component.css']
})
export class BookScrollListComponent
{
  @Input() title: string = 'Book Scroll List';
  @Input() href: string = '';
  @Input() bookList: Book[] = [
    new Book(undefined, 'Bramble', 'https://cdn1.epicgames.com/spt-assets/ab87c9bafafd49fdaeb1069044a8d105/bramble-the-mountain-king-gs19a.png?h=480&quality=medium&resize=1&w=360'),
    new Book(undefined, 'Watch Dogs: Legion Standard Edition', 'https://cdn1.epicgames.com/0a84818055e740a7be21a2e5b6162703/offer/WatchDogs_Legion_Store_Portrait_1200x1600-1200x1600-a6b2d4cce489aeeb87bad4a6db168bed.jpg?h=480&quality=medium&resize=1&w=360'),
    new Book(undefined, 'Poker Club', 'https://cdn1.epicgames.com/spt-assets/560813614bba464385b56f43524d17f0/download-poker-club-offer-16wlj.jpg?h=480&quality=medium&resize=1&w=360'),
    new Book(undefined, 'The Legend of Heroes: Trails from Zero', 'https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_TheLegendofHeroesTrailsfromZero_NihonFalcom_S2_1200x1600-0abec058d85e9be2dedbcb10937bb3a7?h=480&quality=medium&resize=1&w=360'),
    new Book(undefined, 'Blue Lock tập 1', 'https://cf.image-cdn.k-manga.jp/cover_320/11/112330/b112330_1_320.jpg'),
    new Book(undefined, 'Bốn anh em nhà Yuzuki tập 1', 'https://cf.image-cdn.k-manga.jp/cover_320/3/38422/b38422_1_320.jpg'),
    new Book(undefined, '3000 từ vựng tiếng Anh thông dụng nhất', 'https://nhasachmienphi.com/images/thumbnail/nhasachmienphi-3000-tu-vung-tieng-anh-thong-dung-nhat.jpg'),
    new Book(undefined, 'Bramble', 'https://cdn1.epicgames.com/spt-assets/ab87c9bafafd49fdaeb1069044a8d105/bramble-the-mountain-king-gs19a.png?h=480&quality=medium&resize=1&w=360'),
    new Book(undefined, 'Watch Dogs: Legion Standard Edition', 'https://cdn1.epicgames.com/0a84818055e740a7be21a2e5b6162703/offer/WatchDogs_Legion_Store_Portrait_1200x1600-1200x1600-a6b2d4cce489aeeb87bad4a6db168bed.jpg?h=480&quality=medium&resize=1&w=360'),
    new Book(undefined, 'Poker Club', 'https://cdn1.epicgames.com/spt-assets/560813614bba464385b56f43524d17f0/download-poker-club-offer-16wlj.jpg?h=480&quality=medium&resize=1&w=360'),
    new Book(undefined, 'The Legend of Heroes: Trails from Zero', 'https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_TheLegendofHeroesTrailsfromZero_NihonFalcom_S2_1200x1600-0abec058d85e9be2dedbcb10937bb3a7?h=480&quality=medium&resize=1&w=360'),
    new Book(undefined, 'Blue Lock tập 1', 'https://cf.image-cdn.k-manga.jp/cover_320/11/112330/b112330_1_320.jpg'),
    new Book(undefined, 'Bốn anh em nhà Yuzuki tập 1', 'https://cf.image-cdn.k-manga.jp/cover_320/3/38422/b38422_1_320.jpg'),
    new Book(undefined, '3000 từ vựng tiếng Anh thông dụng nhất', 'https://nhasachmienphi.com/images/thumbnail/nhasachmienphi-3000-tu-vung-tieng-anh-thong-dung-nhat.jpg'),
  ];
  slideConfig = {
    slidesToShow: 7,
    slidesToScroll: 7,
    infinite: false,
    arrows: false,
    draggable: false,
    speed: 500,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6,
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 424,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        // breakpoint: 424,
        breakpoint: 280,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]

  };

  slickInit (e: any)
  {
    console.log('slick initialized');
  }
  breakpoint (e: any)
  {
    console.log('breakpoint');
  }
  afterChange (e: any)
  {
    console.log('afterChange');
  }
  beforeChange (e: any)
  {
    console.log('beforeChange');
  }
}
