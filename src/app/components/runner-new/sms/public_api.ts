import { CreateLib, uuid } from 'ng-react-component';
import { smsConfigs } from './config';
const props = [];
props.push(new CreateLib('meepo-sms', '短信', {
    children: [],
    style: {},
    items: smsConfigs
}, [], null, 'sms'));
export const smsProps = props;
