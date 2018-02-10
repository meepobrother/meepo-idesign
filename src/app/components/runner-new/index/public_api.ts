import { CreateLib, uuid } from 'ng-react-component';
const props = [];

props.push(new CreateLib('meepo-mobile', '页面', {
    children: [
        new CreateLib('weui-body', '主体', {
            children: [
                new CreateLib('weui-body', '主体', {
                    children: [],
                    style: {}
                },[],'body1','body11')
            ],
            style: {}
        }, [], 'page1', 'body1'),
    ],
    style: {
        [`background-color`]: '#efefef'
    }
}, [], null, 'page1'));

export const indexProps = props;

console.log(indexProps);
