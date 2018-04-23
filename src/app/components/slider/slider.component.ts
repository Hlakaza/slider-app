import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit, Input } from '@angular/core';
@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit, AfterViewInit {

  // selector: '.siema';
  duration: 200;
  easing: 'ease-out';
  perPage: 1;
  startIndex: 0;
  draggable: true;
  multipleDrag: true;
  threshold: 20;
  loop: false;
  rtl: false;
  selectorWidth: number;
  currentSlide: number;
  innerElements: any;
  transformProperty: any;
  pointerDown: boolean;
  drag: any;
  sliderFrame: any;
  // tslint:disable-next-line:no-input-rename
  @Input('siema') el: ElementRef;
  constructor(

  ) {
        console.log('My element', this.el.nativeElement);
  }

  ngAfterViewInit() {
         // update perPage number dependable of user value
         this.resolveSlidesNumber();

         // Create global references
         this.selectorWidth = this.el.nativeElement.offsetWidth;
         this.innerElements = [].slice.call(this.el.nativeElement.children);
         this.currentSlide = this.loop ?
           this.startIndex % this.innerElements.length :
           Math.max(0, Math.min(this.startIndex, this.innerElements.length - this.perPage));
          this.transformProperty =  this.webkitOrNot();
         // Bind all event handlers for referencability
         // tslint:disable-next-line:max-line-length
        //  ['resizeHandler', 'touchstartHandler', 'touchendHandler', 'touchmoveHandler', 'mousedownHandler', 'mouseupHandler', 'mouseleaveHandler', 'mousemoveHandler', 'clickHandler'].forEach(method => {
        //    this[method] = this[method].bind(this);
        //  });
  }

   /**
   * Determine if browser supports unprefixed transform property.
   * Google Chrome since version 26 supports prefix-less transform
   * @returns {string} - Transform property supported by client.
   */
  webkitOrNot() {
    const style = document.documentElement.style;
    if (typeof style.transform === 'string') {
      return 'transform';
    }
    return 'WebkitTransform';
  }

    /**
   * Attaches listeners to required events.
   */
  attachEvents() {
    // Resize element on window resize
    // window.addEventListener('resize', this.resizeHandler);

    // If element is draggable / swipable, add event handlers
    if (this.draggable) {
      // Keep track pointer hold and dragging distance
      this.pointerDown = false;
      this.drag = {
        startX: 0,
        endX: 0,
        startY: 0,
        letItGo: null,
        preventClick: false,
      };

      // Touch events
      // this.el.nativeElement.addEventListener('touchstart', this.touchstartHandler);
      // this.selector.addEventListener('touchend', this.touchendHandler);
      // this.selector.addEventListener('touchmove', this.touchmoveHandler);

      // Mouse events
      // this.selector.addEventListener('mousedown', this.mousedownHandler);
      // this.selector.addEventListener('mouseup', this.mouseupHandler);
      // this.selector.addEventListener('mouseleave', this.mouseleaveHandler);
      // this.selector.addEventListener('mousemove', this.mousemoveHandler);

      // Click
      // this.selector.addEventListener('click', this.clickHandler);
    }
  }

  

  ngOnInit() {

    this.attachEvents();

    // hide everything out of selector's boundaries
    this.el.nativeElement.style.overflow = 'hidden';

    // rtl or ltr
    this.el.nativeElement.style.style.direction = this.rtl ? 'rtl' : 'ltr';

    // build a frame and slide to a currentSlide
    this.buildSliderFrame();

    // this.config.onInit.call(this);
  }

    /**
   * Build a sliderFrame and slide to a current item.
   */
  buildSliderFrame() {
    const widthItem = this.selectorWidth / this.perPage;
    const itemsToBuild = this.loop ? this.innerElements.length + (2 * this.perPage) : this.innerElements.length;

    // Create frame and apply styling
    this.sliderFrame = document.createElement('div');
    this.sliderFrame.style.width = `${widthItem * itemsToBuild}px`;
    this.enableTransition();

    if (this.draggable) {
      this.el.nativeElement.style.cursor = '-webkit-grab';
    }

    // Create a document fragment to put slides into it
    const docFragment = document.createDocumentFragment();

    // Loop through the slides, add styling and add them to document fragment
    if (this.loop) {
      for (let i = this.innerElements.length - this.perPage; i < this.innerElements.length; i++) {
        const element = this.buildSliderFrameItem(this.innerElements[i].cloneNode(true));
        docFragment.appendChild(element);
      }
    }
    for (let i = 0; i < this.innerElements.length; i++) {
      const element = this.buildSliderFrameItem(this.innerElements[i]);
      docFragment.appendChild(element);
    }
    if (this.loop) {
      for (let i = 0; i < this.perPage; i++) {
        const element = this.buildSliderFrameItem(this.innerElements[i].cloneNode(true));
        docFragment.appendChild(element);
      }
    }

    // Add fragment to the frame
    this.sliderFrame.appendChild(docFragment);

    // Clear selector (just in case something is there) and insert a frame
    this.el.nativeElement.innerHTML = '';
    this.el.nativeElement.appendChild(this.sliderFrame);

    // Go to currently active slide after initial build
    this.slideToCurrent('');
  }

  buildSliderFrameItem(elm) {
    const elementContainer = document.createElement('div');
    elementContainer.style.cssFloat = this.rtl ? 'right' : 'left';
    elementContainer.style.cssFloat = this.rtl ? 'right' : 'left';
    // tslint:disable-next-line:max-line-length
    elementContainer.style.width = `${this.loop ? 100 / (this.innerElements.length + (this.perPage * 2)) : 100 / (this.innerElements.length)}%`;
    elementContainer.appendChild(elm);
    return elementContainer;
  }

  /**
   * Moves sliders frame to position of currently active slide
   */
  slideToCurrent(enableTransition) {
    const currentSlide = this.loop ? this.currentSlide + this.perPage : this.currentSlide;
    const offset = (this.rtl ? 1 : -1) * currentSlide * (this.selectorWidth / this.perPage);

    if (enableTransition) {
      // This one is tricky, I know but this is a perfect explanation:
      // https://youtu.be/cCOL7MC4Pl0
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.enableTransition();
          this.sliderFrame.style[this.transformProperty] = `translate3d(${offset}px, 0, 0)`;
        });
      });
    } else {
      this.sliderFrame.style[this.transformProperty] = `translate3d(${offset}px, 0, 0)`;
    }
  }

  /**
   * Determinates slides number accordingly to clients viewport.
   */
  resolveSlidesNumber() {
    if (typeof this.perPage === 'number') {
      this.perPage = this.perPage;
    }
    //  else if (typeof this.perPage === 'object') {
    //   this.perPage = 1;
    //   for (const viewport in this.perPage) {
    //     if (window.innerWidth >= viewport) {
    //       this.perPage = this.perPage[viewport];
    //     }
    //   }
    // }
  }

  /**
   * Disable transition on sliderFrame.
   */
  disableTransition() {
    this.sliderFrame.style.webkitTransition = `all 0ms ${this.easing}`;
    this.sliderFrame.style.transition = `all 0ms ${this.easing}`;
  }
  /**
   * Enable transition on sliderFrame.
   */
  enableTransition() {
    this.sliderFrame.style.webkitTransition = `all ${this.duration}ms ${this.easing}`;
    this.sliderFrame.style.transition = `all ${this.duration}ms ${this.easing}`;
  }
    /**
   * Go to previous slide.
   * @param {number} [howManySlides=1] - How many items to slide backward.
   * @param {function} callback - Optional callback function.
   */
  prev(howManySlides = 1, callback) {
    // early return when there is nothing to slide
    if (this.innerElements.length <= this.perPage) {
      return;
    }

    const beforeChange = this.currentSlide;

    if (this.loop) {
      const isNewIndexClone = this.currentSlide - howManySlides < 0;
      if (isNewIndexClone) {
        this.disableTransition();

        const mirrorSlideIndex = this.currentSlide + this.innerElements.length;
        const mirrorSlideIndexOffset = this.perPage;
        const moveTo = mirrorSlideIndex + mirrorSlideIndexOffset;
        const offset = (this.rtl ? 1 : -1) * moveTo * (this.selectorWidth / this.perPage);
        const dragDistance = this.draggable ? this.drag.endX - this.drag.startX : 0;

        this.sliderFrame.style[this.transformProperty] = `translate3d(${offset + dragDistance}px, 0, 0)`;
        this.currentSlide = mirrorSlideIndex - howManySlides;
      } else {
        this.currentSlide = this.currentSlide - howManySlides;
      }
    } else {
      this.currentSlide = Math.max(this.currentSlide - howManySlides, 0);
    }

    if (beforeChange !== this.currentSlide) {
      this.slideToCurrent(this.loop);
      // this.onChange.call(this);
      if (callback) {
        callback.call(this);
      }
    }
  }


  /**
   * Go to next slide.
   * @param {number} [howManySlides=1] - How many items to slide forward.
   * @param {function} callback - Optional callback function.
   */
  next(howManySlides = 1, callback) {
    // early return when there is nothing to slide
    if (this.innerElements.length <= this.perPage) {
      return;
    }

    const beforeChange = this.currentSlide;

    if (this.loop) {
      const isNewIndexClone = this.currentSlide + howManySlides > this.innerElements.length - this.perPage;
      if (isNewIndexClone) {
        this.disableTransition();

        const mirrorSlideIndex = this.currentSlide - this.innerElements.length;
        const mirrorSlideIndexOffset = this.perPage;
        const moveTo = mirrorSlideIndex + mirrorSlideIndexOffset;
        const offset = (this.rtl ? 1 : -1) * moveTo * (this.selectorWidth / this.perPage);
        const dragDistance = this.draggable ? this.drag.endX - this.drag.startX : 0;

        this.sliderFrame.style[this.transformProperty] = `translate3d(${offset + dragDistance}px, 0, 0)`;
        this.currentSlide = mirrorSlideIndex + howManySlides;
      } else {
        this.currentSlide = this.currentSlide + howManySlides;
      }
    } else {
      this.currentSlide = Math.min(this.currentSlide + howManySlides, this.innerElements.length - this.perPage);
    }
    if (beforeChange !== this.currentSlide) {
      this.slideToCurrent(this.loop);
      // this.onChange.call(this);
      if (callback) {
        callback.call(this);
      }
    }
  }

    /**
   * Go to slide with particular index
   * @param {number} index - Item index to slide to.
   * @param {function} callback - Optional callback function.
   */
  goTo(index, callback) {
    if (this.innerElements.length <= this.perPage) {
      return;
    }
    const beforeChange = this.currentSlide;
    this.currentSlide = this.loop ?
      index % this.innerElements.length :
      Math.min(Math.max(index, 0), this.innerElements.length - this.perPage);
    if (beforeChange !== this.currentSlide) {
      this.slideToCurrent(this.loop);
      // this.onChange.call(this);
      if (callback) {
        callback.call(this);
      }
    }
  }

 /**
   * Recalculate drag /swipe event and reposition the frame of a slider
   */
  updateAfterDrag() {
    const movement = (this.rtl ? -1 : 1) * (this.drag.endX - this.drag.startX);
    const movementDistance = Math.abs(movement);
    const howManySliderToSlide = this.multipleDrag ? Math.ceil(movementDistance / (this.selectorWidth / this.perPage)) : 1;

    const slideToNegativeClone = movement > 0 && this.currentSlide - howManySliderToSlide < 0;
    const slideToPositiveClone = movement < 0 && this.currentSlide + howManySliderToSlide > this.innerElements.length - this.perPage;

    if (movement > 0 && movementDistance > this.threshold && this.innerElements.length > this.perPage) {
      this.prev(howManySliderToSlide, '');
    } else if (movement < 0 && movementDistance > this.threshold && this.innerElements.length > this.perPage) {
      this.next(howManySliderToSlide, '');
    }
    this.slideToCurrent(slideToNegativeClone || slideToPositiveClone);
  }

    /**
   * When window resizes, resize slider components as well
   */
  resizeHandler() {
    // update perPage number dependable of user value
    this.resolveSlidesNumber();

    // relcalculate currentSlide
    // prevent hiding items when browser width increases
    if (this.currentSlide + this.perPage > this.innerElements.length) {
      this.currentSlide = this.innerElements.length <= this.perPage ? 0 : this.innerElements.length - this.perPage;
    }

    this.selectorWidth = this.el.nativeElement.offsetWidth;

    this.buildSliderFrame();
  }

  /**
   * Clear drag after touchend and mouseup event
   */
  clearDrag() {
    this.drag = {
      startX: 0,
      endX: 0,
      startY: 0,
      letItGo: null,
      preventClick: this.drag.preventClick
    };
  }
  /**
   * touchstart event handler
   */
  @HostListener('touchstart', ['$event'])
  touchstartHandler(event: any) {
    // Prevent dragging / swiping on inputs, selects and textareas
    const ignoreSiema = ['TEXTAREA', 'OPTION', 'INPUT', 'SELECT'].indexOf(event.target.nodeName) !== -1;
    if (ignoreSiema) {
      return;
    }

    event.stopPropagation();
    this.pointerDown = true;
    this.drag.startX = event.touches[0].pageX;
    this.drag.startY = event.touches[0].pageY;
  }

    /**
   * touchend event handler
   */
  @HostListener('touchend', ['$event'])
  touchendHandler(event: any) {
    event.stopPropagation();
    this.pointerDown = false;
    this.enableTransition();
    if (this.drag.endX) {
      this.updateAfterDrag();
    }
    this.clearDrag();
  }

    /**
   * touchmove event handler
   */

  @HostListener('touchmove', ['$event'])
  touchmoveHandler(event) {
    event.stopPropagation();

    if (this.drag.letItGo === null) {
      this.drag.letItGo = Math.abs(this.drag.startY - event.touches[0].pageY) < Math.abs(this.drag.startX - event.touches[0].pageX);
    }

    if (this.pointerDown && this.drag.letItGo) {
      event.preventDefault();
      this.drag.endX = event.touches[0].pageX;
      this.sliderFrame.style.webkitTransition = `all 0ms ${this.easing}`;
      this.sliderFrame.style.transition = `all 0ms ${this.easing}`;

      const currentSlide = this.loop ? this.currentSlide + this.perPage : this.currentSlide;
      const currentOffset = currentSlide * (this.selectorWidth / this.perPage);
      const dragOffset = (this.drag.endX - this.drag.startX);
      const offset = this.rtl ? currentOffset + dragOffset : currentOffset - dragOffset;
      this.sliderFrame.style[this.transformProperty] = `translate3d(${(this.rtl ? 1 : -1) * offset}px, 0, 0)`;
    }
  }

  /**
   * mousedown event handler
   */
  @HostListener('mousedown', ['$event'])
  mousedownHandler(event) {
    // Prevent dragging / swiping on inputs, selects and textareas
    const ignoreSiema = ['TEXTAREA', 'OPTION', 'INPUT', 'SELECT'].indexOf(event.target.nodeName) !== -1;
    if (ignoreSiema) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.pointerDown = true;
    this.drag.startX = event.pageX;
  }


  /**
   * mouseup event handler
   */
  @HostListener('document:mouseup', ['$event'])
  mouseupHandler(event: any) {
    event.stopPropagation();
    this.pointerDown = false;
    this.el.nativeElement.style.cursor = '-webkit-grab';
    this.enableTransition();
    if (this.drag.endX) {
      this.updateAfterDrag();
    }
    this.clearDrag();
  }


  /**
   * mousemove event handler
   */
  @HostListener('mousemove', ['$event'])
  mousemoveHandler(event: any) {
    event.preventDefault();
    if (this.pointerDown) {
      // if dragged element is a link
      // mark preventClick prop as a true
      // to detemine about browser redirection later on
      if (event.target.nodeName === 'A') {
        this.drag.preventClick = true;
      }

      this.drag.endX = event.pageX;
      this.el.nativeElement.style.cursor = '-webkit-grabbing';
      this.sliderFrame.style.webkitTransition = `all 0ms ${this.easing}`;
      this.sliderFrame.style.transition = `all 0ms ${this.easing}`;

      const currentSlide = this.loop ? this.currentSlide + this.perPage : this.currentSlide;
      const currentOffset = currentSlide * (this.selectorWidth / this.perPage);
      const dragOffset = (this.drag.endX - this.drag.startX);
      const offset = this.rtl ? currentOffset + dragOffset : currentOffset - dragOffset;
      this.sliderFrame.style[this.transformProperty] = `translate3d(${(this.rtl ? 1 : -1) * offset}px, 0, 0)`;
    }
  }


  /**
   * mouseleave event handler
   */
  mouseleaveHandler(e) {
    if (this.pointerDown) {
      this.pointerDown = false;
      this.el.nativeElement.style.cursor = '-webkit-grab';
      this.drag.endX = e.pageX;
      this.drag.preventClick = false;
      this.enableTransition();
      this.updateAfterDrag();
      this.clearDrag();
    }
  }


  /**
   * click event handler
   */
  clickHandler(e) {
    // if the dragged element is a link
    // prevent browsers from folowing the link
    if (this.drag.preventClick) {
      e.preventDefault();
    }
    this.drag.preventClick = false;
  }


  /**
   * Remove item from carousel.
   * @param {number} index - Item index to remove.
   * @param {function} callback - Optional callback to call after remove.
   */
  remove(index, callback) {
    if (index < 0 || index >= this.innerElements.length) {
      throw new Error('Item to remove doesn\'t exist 😭');
    }

    // Shift sliderFrame back by one item when:
    // 1. Item with lower index than currenSlide is removed.
    // 2. Last item is removed.
    const lowerIndex = index < this.currentSlide;
    const lastItem = this.currentSlide + this.perPage - 1 === index;

    if (lowerIndex || lastItem) {
      this.currentSlide--;
    }

    this.innerElements.splice(index, 1);

    // build a frame and slide to a currentSlide
    this.buildSliderFrame();

    if (callback) {
      callback.call(this);
    }
  }


  /**
   * Insert item to carousel at particular index.
   * @param {HTMLElement} item - Item to insert.
   * @param {number} index - Index of new new item insertion.
   * @param {function} callback - Optional callback to call after insert.
   */
  insert(item, index, callback) {
    if (index < 0 || index > this.innerElements.length + 1) {
      throw new Error('Unable to inset it at this index 😭');
    }
    if (this.innerElements.indexOf(item) !== -1) {
      throw new Error('The same item in a carousel? Really? Nope 😭');
    }

    // Avoid shifting content
    // const shouldItShift = index <= this.currentSlide > 0 && this.innerElements.length;
    // this.currentSlide = shouldItShift ? this.currentSlide + 1 : this.currentSlide;

    this.innerElements.splice(index, 0, item);

    // build a frame and slide to a currentSlide
    this.buildSliderFrame();

    if (callback) {
      callback.call(this);
    }
  }


  /**
   * Prepernd item to carousel.
   * @param {HTMLElement} item - Item to prepend.
   * @param {function} callback - Optional callback to call after prepend.
   */
  prepend(item, callback) {
    this.insert(item, 0, callback);
    if (callback) {
      callback.call(this);
    }
  }


  /**
   * Append item to carousel.
   * @param {HTMLElement} item - Item to append.
   * @param {function} callback - Optional callback to call after append.
   */
  append(item, callback) {
    this.insert(item, this.innerElements.length + 1, callback);
    if (callback) {
      callback.call(this);
    }
  }


  /**
   * Removes listeners and optionally restores to initial markup
   * @param {boolean} restoreMarkup - Determinants about restoring an initial markup.
   * @param {function} callback - Optional callback function.
   */
  destroy(restoreMarkup = false, callback) {
    // this.detachEvents();

    this.el.nativeElement.style.cursor = 'auto';

    if (restoreMarkup) {
      const slides = document.createDocumentFragment();
      for (let i = 0; i < this.innerElements.length; i++) {
        slides.appendChild(this.innerElements[i]);
      }
      this.el.nativeElement.innerHTML = '';
      this.el.nativeElement.appendChild(slides);
      this.el.nativeElement.removeAttribute('style');
    }

    if (callback) {
      callback.call(this);
    }
  }

}
