import React from 'react';
import s from './color.css';
import cx from 'classnames';
import { Upload, Button, Layout, Menu, Radio } from 'antd';
import ContentDiff from '../contentDiff';
import DiffPanel from '../diffPanel';
var jsDiff = require('diff');

const { Header, Content, Footer } = Layout;

// import w1 from '../../w1';
// import w2 from '../../w2';

import w1 from '../../testContent1';
import w2 from '../../testContent2';

const TAB = {
    CONTENT: '0',
    WORD: '1',
    LINES: '2',
    FILE: '3'
}

//  传统写法
class ShowComponent extends React.Component {
    state = {
        currentTab: TAB.WORD
    }

    getContent = () => {
        const contentMap = {
            [TAB.CONTENT]: () => {
                const diffRes = jsDiff.diffJson(w1, w2);
                return <ContentDiff diffArr={diffRes}/>
            },
            [TAB.WORD]: () => <DiffPanel type='words'/>,
            [TAB.LINES]: () => <div><DiffPanel type='lines'/></div>,
        };
        return contentMap[this.state.currentTab]();
    }

    navChange = (e) => {
        this.setState({
            currentTab: e.key
        })
    }

    render() {
        return <Layout>
            <Menu onClick={this.navChange} mode='horizontal' defaultSelectedKeys={[this.state.currentTab]}>
                <Menu.Item key={TAB.CONTENT}>json diff</Menu.Item>
                <Menu.Item key={TAB.WORD}>单词diff</Menu.Item>
                <Menu.Item key={TAB.LINES}>行内容diff</Menu.Item>
            </Menu>
            {this.getContent()}
            <Footer style={{ textAlign: 'center' }}>Produced by 广兰路地铁</Footer>
        </Layout>
    }
}

export default ShowComponent;