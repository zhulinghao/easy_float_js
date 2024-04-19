# Install

`npm i easy-float`

example:
```js
import EasyFloat from 'easy-float';
const container = document.querySelector('body');
const targetBtn = document.querySelector('.btn');

const options = {
  container,
  targetBtn,
  padding: 10,
  initBottom: 10,
  initLeft: 10,
  fadeOutEnable: true,
  fadeOutTime: 1000,
};

easyFloat.init();
```

# options

| params    | type      | default   | desc   |
|---------- |-------- |---------- |-------------  |
| options.container  | HTMLElement |   | container area |
| options.targetBtn  | HTMLElement |   | floating button |
| options.padding   |  number | 10 |   distance from edge   |
| options.initTop   |  number | 0 |  Initialize the distance from the top border  |
| options.initBottom   |  number | null |  Initialize the distance from the bottom border  |
| options.initLeft   |  number | 0 |  Initialize the distance from the left border  |
| options.initRight   |  number | null |  Initialize the distance from the right border  |
| options.fadeOutEnable   |  boolean | false |  Whether to allow hiding  |
| options.fadeOutTime   |  number | 4000 |  Hide delay, Effective when options.fadeOutEnable is true |
