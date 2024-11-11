const THRESHOLD = 20;
// const TIMEOUT = 500;
export const TYPE_EVENT = "swiped";

export const initSwipedEvents = (window: Window, document: Document) => {
  document.addEventListener("touchstart", handleTouchStart, false);
  document.addEventListener("touchmove", handleTouchMove, false);
  document.addEventListener("touchend", handleTouchEnd, false);

  let xDown, yDown, xDiff, yDiff, timeDown, startEl, touchCount;

  function handleTouchStart(e: TouchEvent) {
    e.stopPropagation();
    // // if the element has data-swipe-ignore="true" we stop listening for swipe events
    // if (e.target.getAttribute("data-swipe-ignore") === "true") return;

    startEl = e.target;

    timeDown = Date.now();
    xDown = e.touches[0].clientX;
    yDown = e.touches[0].clientY;
    xDiff = 0;
    yDiff = 0;
    touchCount = e.touches.length;
  }

  function handleTouchMove(e) {
    e.stopPropagation();
    if (!xDown || !yDown) return;

    xDiff = xDown - e.touches[0].clientX;
    yDiff = yDown - e.touches[0].clientY;
  }

  function handleTouchEnd(e) {
    e.stopPropagation();
    // if the user released on a different target, cancel!
    if (startEl !== e.target) return;

    // let swipeThreshold = parseInt(
    //   getNearestAttribute(startEl, "data-swipe-threshold", THRESHOLD),
    //   10
    // ); // default 20 units
    // let swipeUnit = getNearestAttribute(startEl, "data-swipe-unit", "px"); // default px
    // let swipeTimeout = parseInt(
    //   getNearestAttribute(startEl, "data-swipe-timeout", "500"),
    //   10
    // ); // default 500ms
    let timeDiff = Date.now() - timeDown;
    let eventType;
    let changedTouches = e.changedTouches || e.touches || [];

    // if (swipeUnit === "vh") {
    //   swipeThreshold = Math.round(
    //     (swipeThreshold / 100) * document.documentElement.clientHeight
    //   ); // get percentage of viewport height in pixels
    // }
    // if (swipeUnit === "vw") {
    //   swipeThreshold = Math.round(
    //     (swipeThreshold / 100) * document.documentElement.clientWidth
    //   ); // get percentage of viewport height in pixels
    // }

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      // most significant
      if (Math.abs(xDiff) > THRESHOLD /*&& timeDiff < TIMEOUT*/) {
        if (xDiff > 0) {
          eventType = "swiped-left";
        } else {
          eventType = "swiped-right";
        }
      }
    } else if (Math.abs(yDiff) > THRESHOLD /*&& timeDiff < TIMEOUT*/) {
      if (yDiff > 0) {
        eventType = "swiped-up";
      } else {
        eventType = "swiped-down";
      }
    }

    if (eventType) {
      let eventData = {
        dir: eventType.replace(/swiped-/, ""),
        touchType: (changedTouches[0] || {}).touchType || "direct",
        fingers: touchCount, // Number of fingers used
        target: startEl,
        // xStart: parseInt(xDown, 10),
        // xEnd: parseInt((changedTouches[0] || {}).clientX || -1, 10),
        // yStart: parseInt(yDown, 10),
        // yEnd: parseInt((changedTouches[0] || {}).clientY || -1, 10),
      };

      // fire `swiped` event event on the element that started the swipe
      startEl.dispatchEvent(
        new CustomEvent(TYPE_EVENT, {
          bubbles: true,
          cancelable: true,
          detail: eventData,
        })
      );

      // fire `swiped-dir` event on the element that started the swipe
      // startEl.dispatchEvent(
      //   new CustomEvent(eventType, {
      //     bubbles: true,
      //     cancelable: true,
      //     detail: eventData,
      //   })
      // );
    }

    // reset values
    // xDown = null;
    // yDown = null;
    // timeDown = null;
    reset();
  }

  function reset() {
    xDown = null;
    yDown = null;
    xDiff = null;
    yDiff = null;
    timeDown = null;
    startEl = null;
    touchCount = 0;
  }

  // function getNearestAttribute(el, attributeName, defaultValue) {
  //   // walk up the dom tree looking for attributeName
  //   while (el && el !== document.documentElement) {
  //     let attributeValue = el.getAttribute(attributeName);
  //
  //     if (attributeValue) {
  //       return attributeValue;
  //     }
  //
  //     el = el.parentNode;
  //   }
  //
  //   return defaultValue;
  // }
}
