export default class EasyFloat {
  constructor() {
    /** @type {HTMLElement} */
    this.container = null;
    /** @type {HTMLElement} */
    this.targetBtn = null;
    /** @type {boolean} */
    this.dragStart = false;
    /** @type {number} */
    this.initialX = 0;
    /** @type {number} */
    this.initialY = 0;
    /** @type {number} */
    this.fadeOutTime = 4000;
    /** @type {boolean} */
    this.fadeOutEnable = false;
    this.timer = null;
    this.fadeOutTimer = null;
    this.padding = 0;
    this.handleEndBind = this.handleEnd.bind(this);
    this.computePositionBind = this.computePosition.bind(this);
  }

  /**
   * @param {{ container: HTMLElement, targetBtn: HTMLElement, padding: number }} options
   */
  init(options) {
    this.container = options.container;
    this.targetBtn = options.targetBtn;
    this.padding = options.padding || 0;
    if (options.fadeOutTime) {
      this.fadeOutTime = options.fadeOutTime;
    }
    this.fadeOutEnable = options.fadeOutEnable;
    this.targetBtn.style.position = 'absolute';
    this.targetBtn.style.top = '0';
    this.targetBtn.style.left = '0';

    if (typeof options.initTop === 'number') {
      this.targetBtn.style.top = `${options.initTop}px`;
    }
    if (typeof options.initLeft === 'number') {
      this.targetBtn.style.left = `${options.initLeft}px`;
    }
    if (typeof options.initRight === 'number') {
      const containerWidth = this.container.offsetWidth;
      const targetBtnWidth = this.targetBtn.offsetWidth;
      const initRight = options.initRight;
      const targetLeft = containerWidth - targetBtnWidth - initRight;
      this.targetBtn.style.left = `${targetLeft}px`;
    }
    if (typeof options.initBottom === 'number') {
      const containerHeight = this.container.offsetHeight;
      const targetBtnHeight = this.targetBtn.offsetHeight;
      const initBottom = options.initBottom;
      const targetTop = containerHeight - targetBtnHeight - initBottom;
      this.targetBtn.style.top = `${targetTop}px`;
    }

    this.addListener();
    if (this.fadeOutEnable) {
      this.handleFadeOut();
    }
  }

  computePosition() {
    // 添加吸附逻辑
    const targetBtnWidth = this.targetBtn.offsetWidth;
    const targetBtnHeight = this.targetBtn.offsetHeight;
    const targetBtnLeft = this.targetBtn.offsetLeft;
    const targetBtnTop = this.targetBtn.offsetTop;
    const containerWidth = this.container.offsetWidth;
    const containerHeight = this.container.offsetHeight;
    let targetLeft, targetTop;

    // 计算目标按钮距离容器边缘的距离
    const distanceToLeft = targetBtnLeft;
    const distanceToRight = containerWidth - targetBtnLeft - targetBtnWidth;
    const distanceToTop = targetBtnTop;
    const distanceToBottom = containerHeight - targetBtnTop - targetBtnHeight;

    // 找出最小值
    const minDistance = Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);

    targetLeft = targetBtnLeft;
    targetTop = targetBtnTop;
    if (minDistance === distanceToLeft) {
      targetLeft = this.padding;
    } else if (minDistance === distanceToRight) {
      targetLeft = containerWidth - targetBtnWidth - this.padding;
    } else if (minDistance === distanceToTop) {
      targetTop = this.padding;
    } else if (minDistance !== distanceToTop) {
      targetTop = containerHeight - targetBtnHeight - this.padding;
    }

    if (minDistance === distanceToLeft || minDistance === distanceToRight) {
      // 对于左侧和右侧吸附的情况，targetTop 需要进行边界检查
      if (targetTop < this.padding) {
        targetTop = this.padding;
      } else if (targetTop > containerHeight - targetBtnHeight - this.padding) {
        targetTop = containerHeight - targetBtnHeight - this.padding;
      }
    } else {
      // 对于上侧和下侧吸附的情况，targetLeft 需要进行边界检查
      if (targetLeft > containerWidth - targetBtnWidth - this.padding) {
        targetLeft = containerWidth - targetBtnWidth - this.padding;
      } else if (targetLeft < this.padding) {
        targetLeft = this.padding;
      }
    }

    this.targetBtn.style.transition = 'all 0.3s';
    this.targetBtn.style.left = targetLeft + 'px';
    this.targetBtn.style.top = targetTop + 'px';
    this.timer = setTimeout(() => {
      this.targetBtn.style.transition = '';
    }, 300);

    if (this.fadeOutEnable) {
      this.fadeOutTimer = setTimeout(() => {
        this.handleFadeOut();
      }, this.fadeOutTime);
    }
  }

  handleEnd() {
    if (!this.dragStart) return;
    this.dragStart = false;
    this.computePosition();
  }

  // 进入隐藏状态
  handleFadeOut() {
    // 添加吸附逻辑
    const targetBtnWidth = this.targetBtn.offsetWidth;
    const targetBtnHeight = this.targetBtn.offsetHeight;
    const targetBtnLeft = this.targetBtn.offsetLeft;
    const targetBtnTop = this.targetBtn.offsetTop;
    const containerWidth = this.container.offsetWidth;
    const containerHeight = this.container.offsetHeight;

    // 计算目标按钮距离容器边缘的距离
    const distanceToLeft = targetBtnLeft;
    const distanceToRight = containerWidth - targetBtnLeft - targetBtnWidth;
    const distanceToTop = targetBtnTop;
    const distanceToBottom = containerHeight - targetBtnTop - targetBtnHeight;

    // 找出最小值
    const minDistance = Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);

    if (minDistance === distanceToLeft) {
      this.targetBtn.style.left = `-${targetBtnWidth / 2}px`;
    } else if (minDistance === distanceToRight) {
      this.targetBtn.style.left = `${containerWidth - targetBtnWidth / 2}px`;
    } else if (minDistance === distanceToTop) {
      this.targetBtn.style.top = `-${targetBtnHeight / 2}px`;
    } else if (minDistance !== distanceToTop) {
      this.targetBtn.style.top = `${containerHeight - targetBtnHeight / 2}px`;
    }
    this.targetBtn.style.transition = 'all 0.3s';
    this.timer = setTimeout(() => {
      this.targetBtn.style.transition = '';
    }, 300);
  }

  addListener() {
    let startEvent = 'mousedown';
    let moveEvent = 'mousemove';
    let endEvent = 'mouseup';
    let cancelEvent = 'mouseleave';

    if ('ontouchstart' in window) {
      // 如果是移动设备，使用触摸事件
      startEvent = 'touchstart';
      moveEvent = 'touchmove';
      endEvent = 'touchend';
      cancelEvent = 'touchcancel';
    }

    this.targetBtn.addEventListener(startEvent, (e) => {
      e.preventDefault();
      clearTimeout(this.timer);
      clearTimeout(this.fadeOutTimer);

      this.dragStart = true;

      if (startEvent === 'mousedown') {
        this.initialX = e.clientX;
        this.initialY = e.clientY;
      } else {
        const touch = e.touches[0];
        this.initialX = touch.clientX;
        this.initialY = touch.clientY;
      }
    });

    this.container.addEventListener(moveEvent, (e) => {
      if (!this.dragStart) return;

      if (moveEvent === 'mousemove') {
        const movementX = e.movementX;
        const movementY = e.movementY;
        const newLeft = this.targetBtn.offsetLeft + movementX;
        const newTop = this.targetBtn.offsetTop + movementY;
        this.targetBtn.style.left = newLeft + 'px';
        this.targetBtn.style.top = newTop + 'px';
      } else {
        const touch = e.touches[0];
        const movementX = touch.clientX - this.initialX;
        const movementY = touch.clientY - this.initialY;
        const newLeft = this.targetBtn.offsetLeft + movementX;
        const newTop = this.targetBtn.offsetTop + movementY;
        this.targetBtn.style.left = newLeft + 'px';
        this.targetBtn.style.top = newTop + 'px';
        this.initialX = touch.clientX;
        this.initialY = touch.clientY;
      }
    });

    this.container.addEventListener(endEvent, this.handleEndBind);
    this.container.addEventListener(cancelEvent, this.handleEndBind);

    window.addEventListener('resize', this.computePositionBind);
  }
}