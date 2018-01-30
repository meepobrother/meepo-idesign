import { Type, Injector, NgModuleFactory } from '@angular/core';
function flatten<T>(arr: T[][]): T[] {
    return Array.prototype.concat.apply([], arr);
}
// 页面组件结构
export interface DesignLibraryProp {
    children: DesignLibraryProp[];
    name: string;
    uuid?: string;
    props: any,
    state?: any,
    title: string;
    father?: string;
}
// 历史记录结构
export interface DesignHistoryProp {
    name: string;
    data: DesignLibraryProp[];
}




import { Injectable, InjectionToken, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/switchMap';
import { guid } from './guid';

export const DESIGN_LIBRARYS = new InjectionToken('DESIGN_LIBRARYS');
export const instancesMap: Map<string, { setting: any, view: any }> = new Map();

export class InstanceComponent {
    constructor(
        public guid: string,
        public props: DesignLibraryProp,
        public instance: any
    ) { }
}

@Injectable()
export class DesignApiService {
    constructor() { }
    // 获取一个页面参数
    get(id: string) {
        return instancesMap.get(id);
    }
    // 保存一个页面参数
    save(instance: any, designLibraryProp: any, isPreview) {
        const instanceComponent = new InstanceComponent(instance.guid, designLibraryProp, instance);
        if (isPreview) {
            let map = instancesMap.get(instance.guid);
            if (map) {
                map.view = instanceComponent;
            } else {
                map = {
                    setting: null,
                    view: instanceComponent
                }
            }
            instancesMap.set(instance.guid, map);
        } else {
            let map = instancesMap.get(instance.guid);
            if (map) {
                map.setting = instanceComponent;
            } else {
                map = {
                    setting: instanceComponent,
                    view: null
                }
            }
            instancesMap.set(instance.guid, map);
        }
    }
}
export const DESIGN_COMPONENTS = new InjectionToken('DESIGN_COMPONENTS');
import 'rxjs/add/operator/map';

@Injectable()
export class DesignPropsService {
    // 所有props
    props: any[] = [];
    // 当前页面
    pageProps: DesignLibraryProp[] = [];
    // 设置
    _settingProps: DesignLibraryProp;
    set settingProps(val: DesignLibraryProp) {
        this._settingProps = val;
        try {
            if (!this._settingProps) {
                this.fathersProps = [];
            }
            this.fathers = this.getFather(this.settingProps);
            if (this.fathers && this.fathers.length > 0) {
                this.fathersProps = [];
                this.fathers.map(res => {
                    const props = this.getPropsByUid(res);
                    if (props) {
                        this.fathersProps.push(props);
                    }
                });
            }
        } catch (err) { }
    }
    get settingProps() {
        return this._settingProps;
    }
    instance: any;
    // 多级
    fathers: any;
    fathersProps: DesignLibraryProp[] = [];

    historyKey: string = 'historyKey';
    // 历史记录
    historys: any[] = [];

    removePosition: number[] = [];

    constructor(
        @Inject(DESIGN_COMPONENTS) props: any,
        public library: DesignLibraryService
    ) {
        this.props = flatten(props);
        try {
            this.backToHistory();
        } catch (err) {
            localStorage.clear();
        }
    }

    setActiveSettingProps(designLibraryProp: any, instance: any) {
        this.settingProps = designLibraryProp;
        if (this.instance) {
            this.instance.removeClass('is-focus');
        }
        this.instance = instance;
        instance.addClass('is-focus');
        // instance.render.addClass(instance.ele.nativeElement,'is-focus');
    }

    getPropsByName(name: string): DesignLibraryProp {
        let com: DesignLibraryProp;
        this.props.forEach((item) => {
            if (name === item.name) {
                com = item;
            }
        });
        return com;
    }

    addPropByName(name: string, father?: string) {
        const com = this.getPropsByName(name);
        const deepCopyCom: DesignLibraryProp = this.deepCopy(com);
        if (deepCopyCom) {
            if (deepCopyCom.uuid) {
                // 交换位置
            } else {
                deepCopyCom.uuid = guid();
                deepCopyCom.father = father || '';
                const lib = this.library.get(deepCopyCom.name);
                deepCopyCom.props = new lib.default();
                this.pageProps.push(deepCopyCom);
                this.updateHistory();
            }
        }
    }

    addPropsToInstanceByName(name: string) {
        let props = this.getPropsByName(name);
        if (props) {
            if (this.instance) {
                const deepProps = this.deepCopy(props);
                deepProps.father = this.instance.guid;
                const lib = this.library.get(deepProps.name);
                deepProps.props = new lib.default();
                deepProps.uuid = guid();
                this.instance.props.children = this.instance.props.children || [];
                this.instance.props.children.push(deepProps);
            } else {
                const deepProps = this.deepCopy(props);
                deepProps.father = null;
                const lib = this.library.get(deepProps.name);
                deepProps.props = new lib.default();
                deepProps.uuid = guid();
                this.pageProps.push(deepProps);
            }
        }
    }

    toFatherProps() {
        console.log(this.fathersProps);
    }

    deepCopy(obj: any) {
        try {
            return JSON.parse(JSON.stringify(obj));
        } catch (err) {
            console.dir(obj);
        }
    }

    private isGuid(name: string) {
        return name.indexOf('guid_') > -1;
    }

    private trimGuid(name: string) {
        return name.replace('guid_', '');
    }

    removePropsByUid(uuid: string) {
        uuid = this.trimGuid(uuid);
        let props = this.getPropsByUid(uuid);
        if (props) {
            if (props.father) {
                let father: any = this.getPropsByUid(props.father);
                let index = father.props.children.indexOf(props);
                if (index > -1) {
                    father.props.children.splice(index, 1);
                }
            } else {
                let index = this.pageProps.indexOf(props);
                if (index > -1) {
                    this.pageProps.splice(index, 1);
                }
            }
        }
        this.updateHistory();
    }

    getFather(props: DesignLibraryProp, ids: any[] = []) {
        ids.push(props.uuid);
        if (props.father) {
            let father = this.getPropsByUid(props.father);
            if (father) {
                ids = this.getFather((<DesignLibraryProp>father), ids);
            }
        }
        return ids;
    }

    getPropsByUid(uuid: string, data?: DesignLibraryProp[]): DesignLibraryProp | false {
        data = data || this.pageProps;
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (item.uuid + '' === uuid + '') {
                return item;
            } else if (item.props.children) {
                const res = this.getPropsByUid(uuid, item.props.children);
                if (res) {
                    return res;
                }
            }
        }
        return false;
    }

    getHistory(): DesignHistoryProp[] {
        let local = localStorage.getItem(this.historyKey);
        if (local) {
            const items = JSON.parse(local) as DesignHistoryProp[];
            this.historys = items;
            return items;
        } else {
            return [];
        }
    }

    updateHistory(): void {
        this.historys.unshift({
            name: new Date().toISOString(),
            data: this.pageProps
        });
        if (this.historys.length > 50) {
            this.historys = this.historys.splice(this.historys.length, this.historys.length - 50);
        }
        localStorage.setItem(this.historyKey, JSON.stringify(this.historys));
    }

    backToHistory(item: DesignHistoryProp = null) {
        if (!item) {
            item = this.getHistory()[0];
        }
        this.pageProps = item.data;
    }
}

@Injectable()
export class DesignLibraryService {
    private components: { [key: string]: Type<any> }[] = [];
    constructor(
        @Inject(DESIGN_LIBRARYS) components: any
    ) {
        this.components = flatten(components);
    }
    get(name: string) {
        let com: any;
        this.components.map(item => {
            if (item[name]) {
                com = item[name];
            }
        });
        return com;
    }
}