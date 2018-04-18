import {
    Component,
    Renderer2,
    ViewChild,
    ContentChildren,
    QueryList,
    ElementRef,
    Input,
    ChangeDetectorRef
} from '@angular/core';

import { SwiperDirective } from '../../directives/swiper.directive';

@Component({
    selector: 'app-slide-item',
    template : `
        <div #slideItem class="slide-item fade" [ngStyle]="transition" appSwiper tabindex="-1" style="outline: none">
        <ng-content></ng-content>
        </div>
   `,
    styles: [`
        :host{
            width: 100%;
        }

        .slide-item{
            user-select: none;
            -moz-user-select: none;
            -khtml-user-select: none;
            -webkit-user-select: none;
            -o-user-select: none;
            -ms-user-select: none;
        }

        .transition{
            transition: transform;
            -moz-transition: transform;
            -webkit-transition: transform;
            -o-transition: transform;
            -ms-transition: transform;
            transition-timing-function: ease;
            -moz-transition-timing-function: ease;
            -o-transition-timing-function: ease;
            -ms-transition-timing-function: ease;
        }

        .slide-item{
            height: 100%;
            width: 100%;
            background: orange;
            position: absolute;
            overflow: hidden;
        }

        .fade{
            opacity: 1;
            -webkit-transition: opacity .5s ease-in;
               -moz-transition: opacity .5s ease-in;
                -ms-transition: opacity .5s ease-in;
                 -o-transition: opacity .5s ease-in;
                    transition: opacity .5s ease-in;
        }

        .fade-out{
            opacity: 0;
        }
    `]
})
export class SlideItemComponent {
    static transitionStyle: any = {};
    @ViewChild('slideItem') el: ElementRef;
    @ViewChild('appSwiper') appSwiper: SwiperDirective;
    // @ContentChildren(UILazyloadDirective) lazyLoadedImages: QueryList<UILazyloadDirective>;
    speed: number;
    currentPosition = 0;
    position = 0;
    zIndex: number;
    constructor(
        private renderer: Renderer2,
        private ref: ChangeDetectorRef
    ) { }


    get transition() {
        return SlideItemComponent.transitionStyle;
    }
    set transition(transitionStyle) {
        SlideItemComponent.transitionStyle = transitionStyle;
    }

    moveTo(position: number) {
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translate3d(' + position + 'px, 0px, 0px)');
        this.renderer.setStyle(this.el.nativeElement, '-webkit-transform', 'translate3d(' + position + 'px, 0px, 0px)');
        this.renderer.setStyle(this.el.nativeElement, '-moz-transform', 'translate3d(' + position + 'px, 0px, 0px)');
        this.renderer.setStyle(this.el.nativeElement, '-o-transform', 'translate3d(' + position + 'px, 0px, 0px)');
        this.renderer.setStyle(this.el.nativeElement, '-ms-transform', 'translate3d(' + position + 'px, 0px, 0px)');
    }

    moveBy(distance: number) {
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translate3d(' + distance + 'px, 0px, 0px)');
        this.renderer.setStyle(this.el.nativeElement, '-webkit-transform', 'translate3d(' + distance + 'px, 0px, 0px)');
        this.renderer.setStyle(this.el.nativeElement, '-moz-transform', 'translate3d(' + distance + 'px, 0px, 0px)');
        this.renderer.setStyle(this.el.nativeElement, '-o-transform', 'translate3d(' + distance + 'px, 0px, 0px)');
        this.renderer.setStyle(this.el.nativeElement, '-ms-transform', 'translate3d(' + distance + 'px, 0px, 0px)');
    }

    setzIndex(zIndex: number) {
        this.renderer.setStyle(this.el.nativeElement, 'z-index', zIndex);
    }

    disableTransition() {
        this.renderer.setStyle(this.el.nativeElement, 'transition', 'none');
        this.renderer.setStyle(this.el.nativeElement, '-moz-transition', 'none');
        this.renderer.setStyle(this.el.nativeElement, '-webkit-transition', 'none');
        this.renderer.setStyle(this.el.nativeElement, '-o-transition', 'none');
        this.renderer.setStyle(this.el.nativeElement, '-ms-transition', 'none');
    }

    enableTransition() {
        this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform');
        this.renderer.setStyle(this.el.nativeElement, '-moz-transition', 'transform');
        this.renderer.setStyle(this.el.nativeElement, '-webkit-transition', 'transform');
        this.renderer.setStyle(this.el.nativeElement, '-o-transition', 'transform');
        this.renderer.setStyle(this.el.nativeElement, '-ms-transition', 'transform');

        this.renderer.setStyle(this.el.nativeElement, 'transition-duration', this.speed + 'ms');
        this.renderer.setStyle(this.el.nativeElement, '-moz-transition-duration', this.speed + 'ms');
        this.renderer.setStyle(this.el.nativeElement, '-webkit-transition-duration', this.speed + 'ms');
        this.renderer.setStyle(this.el.nativeElement, '-o-transition-duration', this.speed + 'ms');
        this.renderer.setStyle(this.el.nativeElement, '-ms-transition-duration', this.speed + 'ms');
    }

    fadeOut(duration: number) {
        return new Promise(resolve => {
            this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
            setTimeout(() => {
                this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
                resolve();
            }, duration);
        });
    }

    fadeIn(duration: number) {
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        setTimeout(() => {
            this.renderer.setStyle(this.el.nativeElement, 'transition', 'opacity ' + duration + 'ms');
            // this.renderer.setStyle(this.el.nativeElement, "transition-duration", duration+ "ms");
            this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
        }, 0);
    }

    // lazyLoad() {
    //     this.lazyLoadedImages
    //         .forEach((img) => {
    //             img.load();
    //         });
    // }

}
