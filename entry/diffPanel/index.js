import React from 'react';
const jsDiff = require('diff');
import s from './index.css';
import { Upload, Button, Select, Input, Form } from 'antd';
import ContentDiff from '../contentDiff';
import cx from 'classnames';

const FormItem = Form.Item;
const { TextArea } = Input;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const SeleLayout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 10 },
};

const wordsMethodArr = ['diffChars', 'diffWords', 'diffWordsWithSpace'];
const linesMethods = ['diffLines', 'diffTrimmedLines', 'diffSentences', 'structuredPatch', 'createTwoFilesPatch'];
const fileMethods = ['structuredPatch', 'createTwoFilesPatch'];

export default class WordDiff extends React.Component {
    get isWordType() {
        return this.props.type === 'words';
    }

    get isFile() {
        return fileMethods.includes(this.state.method);
    }

    get isDirectPatch() {
        return this.state.method === 'createTwoFilesPatch';
    }

    state = {
        diffArr: [],
        method: this.props.type === 'words' ? 'diffChars' : 'diffLines',
        value1: this.props.type === 'words' ? 'guanlanluditie' : '广兰路地铁\n老厉害了',
        value2: this.props.type === 'words' ? 'smartguanlanluditieYeah' : '广兰路地铁\n一般般'
    }

    componentDidMount() {
        this.actDiff();
    }

    getCharDiff = () => {
        const charColorMap = {
            'add': s.charAdd,
            'removed': s.charRemoved,
        }
        console.log(this.state.diffArr);
        return <div className={s.result}>
            比较结果: 
            {this.state.diffArr.map((item, index) => {
                const { value, added, removed } = item;
                const type = added ? 'add' : (removed ? 'removed' : '')
                return <span key={index} className={cx(charColorMap[type], s.charPreWrap)}>{value}</span>
                })
            }
        </div>
    }

    changInput = (type, e) => {
        this.setState({
            [type === 0 ? 'value1' : 'value2']: e.target.value
        })
    }

    handleSelectChange = (value) => {
        this.setState({
            method: value
        });
    }

    actDiff = () => {
        const { value1, value2, method } = this.state;
        let res;
        if (this.isFile) {
            res = method === 'structuredPatch' ? jsDiff[method]('value1', 'value2', value1, value2).hunks[0].lines : jsDiff[method]('value1', 'value2', value1, value2);
        } else {
            res = jsDiff[method](value1, value2);
        }
        this.setState({
            diffArr: res
        });
    }

    changeFile = async (type, info) => {
        const { file } = info;
        const content = await file.originFileObj.text();
        this.setState({
            [type === 0 ? 'value1' : 'value2']: content
        })
        console.log(content);
    }

    render() {
        const { method, diffArr, value1, value2 } = this.state;
        const diffMethod = this.isWordType ? wordsMethodArr : linesMethods;
        return (
            <div className={s.wrapper}>
                {/* <div>
                    <Upload
                        onChange={this.changeFile.bind(null, 0)}
                        //  不要跑默认的智障上传方法，每上传一次就搞个post请求，有的时候还会卡状态
                        customRequest={() => {}}
                    >
                        点我上传1
                    </Upload>
                </div>
                <div>
                    <Upload
                        onChange={this.changeFile.bind(null, 1)}
                        //  不要跑默认的智障上传方法，每上传一次就搞个post请求，有的时候还会卡状态
                        customRequest={() => {}}
                    >
                        点我上传2
                    </Upload>
                </div> */}
                <div className={s.inputWrapper}>
                    <FormItem {...layout} label='输入1' className={s.input}>
                        <TextArea  defaultValue={value1} onChange={this.changInput.bind(null, 0)}/>
                    </FormItem>
                    <FormItem {...layout} label='输入2'  className={s.input}>
                        <TextArea defaultValue={value2} onChange={this.changInput.bind(null, 1)}/>
                    </FormItem>
                </div>
                <div className={s.funWrapper}>
                    <FormItem {...SeleLayout} label='比较方法'>
                        <Select defaultValue={method} style={{ width: 220 }}onChange={this.handleSelectChange}>
                            {diffMethod.map((item, index) => {
                                return <Select.Option key={index} value={item}>{item}</Select.Option>
                            })}
                        </Select>
                    </FormItem>
                    <Button type='primary' onClick={this.actDiff}>比较</Button>
                </div>
                {this.isDirectPatch ? <div className={s.preWrap}>{typeof diffArr === 'string' ? diffArr : ''}</div> : this.isWordType ? this.getCharDiff() : <ContentDiff isFile={this.isFile} diffArr={diffArr}/>}
            </div>
        )
    }
}