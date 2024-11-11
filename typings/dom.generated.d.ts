// interface YourEventMap {
//     "yourEvent": CustomEvent
// }
//
// interface YaddaEventTarget extends EventTarget  {
//     addEventListener<K extends keyof YourEventMap>(event: K, listener: ((this: Yadda, ev: YourEventMap[K]) => any) | null, options?: AddEventListenerOptions | boolean): void;
//     addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean): void;
// }
//
// class YaddaEventTarget extends EventTarget {
// }
//
// const instance = new YaddaEventTarget();
//
// instance.addEventListener("yourEvent", (event: CustomEvent) => console.log(event));
// instance.dispatchEvent(new CustomEvent("yourEvent", {detail: "bla"}));
