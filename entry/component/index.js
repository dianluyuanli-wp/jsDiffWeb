import React from 'react';
import s from './color.css';
var jsDiff = require('diff');
import cx from 'classnames';
import { Upload, Button, Layout, Menu } from 'antd';

const { Header, Content, Footer } = Layout;
import w1 from '../../w1';
import w2 from '../../w2';

let a = {
    name: 'wang',
    xxx: 2,
    sex: 1,
    info: {
      love: 1
    },
    arr: [
        1, 3,
        2,
        7,
        4
    ]
};

let b = {
    sex: 1,
    xxx: 2,
    name: 'wang2',
    info: {
      love: 1,
      from: 'z'
    },
    arr: [
        1,
        3,
        3,
        4
    ]
}

//  react hooks 写法
// const ShowComponent = () => {
//     useStyles(s);
//     return <div className={s.color}>英雄的中国人民万岁万岁！</div>
// }
// export default ShowComponent;
const BLOCK_LENGTH = 5;

//  传统写法
class ShowComponent extends React.Component {
    state = {
        lineGroup: []
    }

    componentDidMount() {
        // let a1 = 'wefewf\nwefefwe';
        // let a2 = 'wefewf\nwefefw2e';
        // let co = jsDiff.createTwoFilesPatch('old', 'new', a1, a2);
        // console.log(co);
        // console.log(jsDiff.parsePatch(co));
        // return;
        let c = jsDiff.diffJson(w1, w2);
        const initLineGroup = c.map((item, index, originArr) => {
            const { added, removed, value, count } = item;
            const strArr = value.split('\n').filter(item => item);
            const type = (added && '+') || (removed && '-') || ' ';
            let head, hidden, tail;
            if (type !== ' ') {
                hidden = [];
                tail = [];
                head = strArr;
            } else {
                const strLength = strArr.length;
                if (strLength <= BLOCK_LENGTH * 2) {
                    hidden = [];
                    tail = [];
                    head = strArr;
                } else {
                    head = strArr.slice(0, BLOCK_LENGTH)
                    hidden = strArr.slice(BLOCK_LENGTH, strLength - BLOCK_LENGTH);
                    tail = strArr.slice(strLength - BLOCK_LENGTH);
                }
            }
            return {
                type,
                count,
                content: {
                    hidden,
                    head,
                    tail
                }
            }
        });
        let lStartNum = 1;
        let rStartNum = 1;
        initLineGroup.forEach(item => {
            const { type, count } = item;
            item.leftPos = lStartNum;
            item.rightPos = rStartNum;
            lStartNum += type === '+' ? 0 : count;
            rStartNum += type === '-' ? 0 : count;
        })
        this.setState({
            lineGroup: initLineGroup
        });
    }

    openBlock = (type, index) => {
        const copyOfLG = this.state.lineGroup.slice();
        const targetGroup = copyOfLG[index];
        const { head, tail, hidden } = targetGroup.content;
        if (type === 'head') {
            targetGroup.content.head = head.concat(hidden.slice(0, BLOCK_LENGTH));
            targetGroup.content.hidden = hidden.slice(BLOCK_LENGTH);
        } else if (type === 'tail') {
            const hLenght = hidden.length;
            targetGroup.content.tail = hidden.slice(hLenght - BLOCK_LENGTH).concat(tail);
            targetGroup.content.hidden = hidden.slice(0, hLenght - BLOCK_LENGTH);
        } else {
            targetGroup.content.head = head.concat(hidden);
            targetGroup.content.hidden = [];
        }
        copyOfLG[index] = targetGroup;
        this.setState({
            lineGroup: copyOfLG
        });
    }

    getHiddenBtn = (hidden, index) => {
        const isSingle = hidden.length < BLOCK_LENGTH * 2;
        return <div key='collapse' className={s.cutWrapper}>
            <div className={s.colLeft}>
                {isSingle ? <div className={s.arrow} onClick={this.openBlock.bind(this, 'all', index)}>
                    <svg className={s.octicon} viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fillRule="evenodd" d="M8.177.677l2.896 2.896a.25.25 0 01-.177.427H8.75v1.25a.75.75 0 01-1.5 0V4H5.104a.25.25 0 01-.177-.427L7.823.677a.25.25 0 01.354 0zM7.25 10.75a.75.75 0 011.5 0V12h2.146a.25.25 0 01.177.427l-2.896 2.896a.25.25 0 01-.354 0l-2.896-2.896A.25.25 0 015.104 12H7.25v-1.25zm-5-2a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM6 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 016 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM12 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 0112 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5z"></path></svg>
                </div>
                    : <React.Fragment>
                        <div className={s.arrow} onClick={this.openBlock.bind(this, 'head', index)}>
                            <svg className={s.octicon} viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fillRule="evenodd" d="M8.177 14.323l2.896-2.896a.25.25 0 00-.177-.427H8.75V7.764a.75.75 0 10-1.5 0V11H5.104a.25.25 0 00-.177.427l2.896 2.896a.25.25 0 00.354 0zM2.25 5a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM6 4.25a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5a.75.75 0 01.75.75zM8.25 5a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM12 4.25a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5a.75.75 0 01.75.75zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5z"></path></svg>
                        </div>
                        <div className={s.arrow} onClick={this.openBlock.bind(this, 'tail', index)}>
                            <svg className={s.octicon} viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fillRule="evenodd" d="M7.823 1.677L4.927 4.573A.25.25 0 005.104 5H7.25v3.236a.75.75 0 101.5 0V5h2.146a.25.25 0 00.177-.427L8.177 1.677a.25.25 0 00-.354 0zM13.75 11a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zm-3.75.75a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zM7.75 11a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM4 11.75a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zM1.75 11a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5z"></path></svg>
                        </div>
                    </React.Fragment>
                }
            </div>
        <div className={s.collRight}><div className={cx(s.colRContent, isSingle ? '' : s.cRHeight)}>{`当前隐藏内容:${hidden.length}行`}</div></div>
        </div>
    }

    getRenderContent = () => {
        return this.state.lineGroup.map((item, index) => {
            const { type, content: { head, tail, hidden }, leftPos, rightPos} = item;
            const cls = cx(s.normal, type === '+' ? s.add : '', type === '-' ? s.removed : '');
            const isNormal = type === ' ';
            const space = "     ";
            const headLine = head.map((sitem, sindex) => {
                let posMark = '';
                if (isNormal) {
                    posMark = (space + (leftPos + sindex)).slice(-5)
                        + (space + (rightPos + sindex)).slice(-5);
                } else {
                    posMark = type === '-' ? (space + (leftPos + sindex)).slice(-5) + space
                        : space + (space + (rightPos + sindex)).slice(-5);
                }
                return <div key={'h-' + sindex} className={cls}>
                    <pre className={cx(s.pre, s.line)}>{posMark}</pre>
                    <pre className={s.pre}>{' ' + type}{sitem}</pre>
                </div>
            })
            const tailLine = tail.map((sitem, sindex) => {
                let posMark = '';
                const posShift = head.length + hidden.length;
                if (isNormal) {
                    posMark = (space + (leftPos + sindex + posShift)).slice(-5)
                        + (space + (rightPos + sindex + posShift)).slice(-5);
                } else {
                    posMark = type === '-' ? (space + (leftPos + sindex + posShift)).slice(-5) + '|' + space
                        : space + (space + (rightPos + sindex + posShift)).slice(-5);
                }
                return <div key={'t-' + sindex} className={cls}>                    
                    <pre className={cx(s.pre, s.line)}>{posMark}</pre>
                    <pre className={s.pre}>{' ' + type}{sitem}</pre>
                </div>
            })
            return <div key={index}>
                {headLine}
                {hidden.length && isNormal && this.getHiddenBtn(hidden, index) || null}
                {tailLine}
            </div>
        })
    }

    changeFile = async (info) => {
        const { file } = info;
        const content = await file.originFileObj.text();
        console.log(content);
    }

    render() {
        // return <div>
        //     <Upload
        //         onChange={this.changeFile}
        //         //  不要跑默认的智障上传方法，每上传一次就搞个post请求，有的时候还会卡状态
        //         customRequest={() => {}}
        //     >
        //         点我上传
        //     </Upload>
        // </div>;
        return <Layout>
            <Menu theme='dark' mode='horizontal'>
                <Menu.Item key="1">nav 1</Menu.Item>
                <Menu.Item key="2">nav 2</Menu.Item>
                <Menu.Item key="3">nav 3</Menu.Item>
            </Menu>
            <Content className={s.content}>
                <div className={s.color}>
                    <div>
                        {this.getRenderContent()}
                    </div>
                </div>
            </Content>
        </Layout>
    }
}

export default ShowComponent;