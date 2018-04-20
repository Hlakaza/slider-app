import { Directive, HostListener, ElementRef, Renderer2, Output, EventEmitter, Input, OnInit, ContentChildren, QueryList, ViewChild, forwardRef } from '@angular/core';
// import { SlideItemComponent } from '../components/slide-item/slide-item.component';

const ZERO = 0.000000000001;

@Directive({
    selector: '[appSSwiper]',
    exportAs: 'appSwiper'
})
export class SwiperDirective implements OnInit {
    static canISwipe = true;
    isDown = false;
    initialPos: number = ZERO;
    lastPos: number = ZERO;
    swipeDistance: number = ZERO;
    firstSwipeDate = Date.now();
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onSwipeRight: EventEmitter<any> = new EventEmitter<any>();
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onSwipeLeft: EventEmitter<any> = new EventEmitter<any>();
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onSwipeStart: EventEmitter<any> = new EventEmitter<any>();
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onSwipeEnd: EventEmitter<any> = new EventEmitter<any>();
    @Output() swipeLeft: EventEmitter<any> = new EventEmitter<any>();
    @Output() swipeRight: EventEmitter<any> = new EventEmitter<any>();
    // @ViewChild(forwardRef(() => SlideItemComponent))
    //  private items: SlideItemComponent;
    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) { }


    ngOnInit() {
        this.onSwipeEnd.subscribe(() => {

        });
        this.swipeLeft.subscribe(() => {
            // SwiperDirective.canISwipe = false;
            setTimeout(() => {
                SwiperDirective.canISwipe = true;
            }, 350);
        });
        this.swipeRight.subscribe(() => {
            // SwiperDirective.canISwipe = false;
            setTimeout(() => {
                SwiperDirective.canISwipe = true;
            }, 350);
        });
    }



    @HostListener('mousedown', ['$event'])
    onMouseDown(event: any) {
        if (!SwiperDirective.canISwipe) {
            return;
        }
        this.firstSwipeDate = Date.now();
        this.isDown = true;
        this.initialPos = event.clientX;
        this.swipeDistance = 0;
        this.onSwipeStart.emit();
        console.log('mouse down');
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: any) {
        if (!this.isDown) {
            return;
        }
        this.initialPos = this.lastPos = ZERO;
        this.isDown = false;

        if (this.swipeDistance > 100) {
            this.swipeLeft.emit();
        } else if (this.swipeDistance < -100) {
            this.swipeRight.emit();
        } else {
            this.onSwipeEnd.emit();
        }
        this.swipeDistance = ZERO;
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: any) {
        if (this.isDown) {
            const swipeFrameDistance = event.clientX - this.initialPos - this.lastPos;
            this.swipeDistance += swipeFrameDistance;
            this.lastPos = event.clientX - this.initialPos;

            if (swipeFrameDistance > 0) {
                this.onSwipeLeft.emit(swipeFrameDistance);
                console.log('swiped', swipeFrameDistance);
            } else {
                this.onSwipeRight.emit(swipeFrameDistance);
            }
        }
    }

    @HostListener('touchmove', ['$event'])
    onTouchMove(event: any) {
        if (!SwiperDirective.canISwipe) {
            return;
        }
        const touch = event.touches[0] || event.changedTouches[0];
        let swipeFrameDistance = touch.clientX - this.initialPos - this.lastPos;
        swipeFrameDistance = swipeFrameDistance < 30 ? swipeFrameDistance : 30;
        this.swipeDistance += swipeFrameDistance;
        this.lastPos = touch.clientX - this.initialPos;

        if (swipeFrameDistance > 0) {
            this.onSwipeLeft.emit(swipeFrameDistance);
        } else {
            this.onSwipeRight.emit(swipeFrameDistance);
        }
    }

    @HostListener('touchstart', ['$event'])
    onTouchStart(event: any) {
        if (!SwiperDirective.canISwipe) {
            return;
        }
        const touch = event.touches[0] || event.changedTouches[0];
        this.firstSwipeDate = Date.now();
        this.initialPos = touch.clientX;
        this.swipeDistance = ZERO;
        this.onSwipeStart.emit();
    }

    @HostListener('touchend', ['$event'])
    onTouchEnd(event: any) {
        this.initialPos = this.lastPos = ZERO;
        if (this.swipeDistance > 100) {
            this.swipeLeft.emit();
            // this.fadeLeft();
            console.log('slide to the left',  this.swipeLeft.emit());
        } else if (this.swipeDistance < -100) {
            this.swipeRight.emit();
            // this.fadeRight();
            console.log('slide to the Right',  this.swipeRight.emit());
        } else {
            this.onSwipeEnd.emit();
        }
        this.swipeDistance = ZERO;
    }

}
