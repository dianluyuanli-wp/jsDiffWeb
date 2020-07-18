import React from 'react';
import ReactDom from 'react-dom';
import Com from './component';
// import StyleContext from 'isomorphic-style-loader/StyleContext';

// const insertCss = (...styles) => {
//     const removeCss = styles.map(style => style._insertCss())
//     return () => removeCss.forEach(dispose => dispose())
//   }

//  挂载组件
const mountNode = document.getElementById('main');

//  原始前端渲染 在html的节点上挂载组件
ReactDom.render((
    <Com />
),mountNode);

// ReactDom.hydrate(
//     <StyleContext.Provider value={{ insertCss }}>
//       <Com obj={{name: 1}}/>
//     </StyleContext.Provider>,
//     mountNode
// );