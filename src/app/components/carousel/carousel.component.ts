import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent
{
  @Input() items: any[] = [
    { title: 'lorem Ipsum', description: 'Lorem Ipsum in Lorem Ipsum dolor sit amet, consectetur adipiscing elit', image: 'https://cdn2.unrealengine.com/egs-fall-guys-season-4-desktop-1248x702-59af3c5b2e50.jpg?h=720&quality=medium&resize=1&w=1280' },
    { title: 'lorem Ipsum dolor', description: 'Lorem Ipsum in Lorem Ipsum dolor sit amet, consectetur adipiscing elit', image: 'https://dummyimage.com/600x400/FBAF00/aaa&text=2' },
    { title: 'consectetur adipiscing elit', description: 'Lorem Ipsum in Lorem Ipsum dolor sit amet, consectetur adipiscing elit', image: 'https://dummyimage.com/700x300/FFD639/aaa&text=3' },
    { title: 'lorem Ipsum', description: 'Lorem Ipsum in Lorem Ipsum dolor sit amet, consectetur adipiscing elit', image: 'https://dummyimage.com/1920x1080/E8985E/aaa&text=4' },
    { title: 'lorem Ipsum sit amet', description: 'Lorem Ipsum in Lorem Ipsum dolor sit amet, consectetur adipiscing elit', image: 'https://dummyimage.com/700x300/2D848A/aaa&text=5' },
  ];
  mainConfig = {
    lazyLoad: 'ondemand',
    infinite: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 250,
  }
  active = 0;

  slickInit (e: any)
  {
    console.log(e);

  }

  beforeChange (e: any)
  {
    this.active = e.currentSlide;
  }
}
