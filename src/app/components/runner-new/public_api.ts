import { indexProps } from './index/public_api';
import { smsProps } from './sms/public_api';

const pages = [{
    title: '首页',
    props: indexProps,
    children: []
},{
    title: '短信设置',
    props: smsProps,
    children: []
}];

export const runnerPage = pages;
