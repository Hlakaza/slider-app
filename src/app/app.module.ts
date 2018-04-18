import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { SliderComponent } from './components/slider/slider.component';
import { SlideItemComponent } from './components/slide-item/slide-item.component';
import { SlideComponent } from './components/slide/slide.component';
import { DotsComponent } from './components/dots/dots.component';
import { ArrowComponent } from './components/arrow/arrow.component';
import { SwiperDirective } from './directives/swiper.directive';

@NgModule({
  declarations: [
    AppComponent,
    SliderComponent,
    SlideComponent,
    SlideItemComponent,
    DotsComponent,
    ArrowComponent,
    SwiperDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    SwiperDirective
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
