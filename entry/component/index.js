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
        } else {
            const hLenght = hidden.length;
            targetGroup.content.tail = hidden.slice(hLenght - BLOCK_LENGTH).concat(tail);
            targetGroup.content.hidden = hidden.slice(0, hLenght - BLOCK_LENGTH);
        }
        copyOfLG[index] = targetGroup;
        this.setState({
            lineGroup: copyOfLG
        });
    }

    getHiddenBtn = (hidden, isNormal, index) => {
        const isSingle = hidden.length < BLOCK_LENGTH;
        return <div key='collapse'>
            <div className={s.colLeft}></div>
            <div className={s.collRight}></div>
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
                {hidden.length && isNormal && <div className={s.button} key={'up'} onClick={this.openBlock.bind(this, 'head', index)}>up 点我查看更多</div> || null}
                {hidden.length && isNormal && <div className={s.button} key={'down'} onClick={this.openBlock.bind(this, 'tail', index)}>down 点我查看更多</div> || null}
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
        // return <div className={s.color}>
        //     <div>
        //         {this.getRenderContent()}
        //     </div>
        // </div>
    }
}

export default ShowComponent;