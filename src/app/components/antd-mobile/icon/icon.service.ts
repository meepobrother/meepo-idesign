import { Injectable, InjectionToken, Inject, Injector, ReflectiveInjector } from '@angular/core';
export const ICONS = new InjectionToken('ICONS');
export const ICON_ROOT = new InjectionToken('ICON_ROOT');
import { HttpClient } from '@angular/common/http';
import { merge, from, of, Observable } from 'meepo-common';
@Injectable()
export class IconStore {
    root: any;
    icons: any;
    http: HttpClient;
    allIcons: any[] = [];
    loadedIcons: any[] = [];
    key: string = '__meepo.icons'
    constructor(
        public injector: Injector
    ) {
        // 获取缓存svgg
        const icons = localStorage.getItem(this.key);
        if (icons) {
            this.allIcons = this.strToJson(icons);
        }
        this.root = this.injector.get(ICON_ROOT);
        this.icons = this.injector.get(ICONS);
        // 去掉重复
        this._unique();
        this.http = this.injector.get(HttpClient);
        // 加载svg
        this.loadSvg();
        this.loadSprite();
    }
    strToJson(str: string) {
        const json = (new Function("return " + str))();
        return json;
    }

    checkExist(name: string) {
        let has = false;
        this.allIcons.map(res => {
            if (res.name === name) {
                has = true;
            }
        });
        return has;
    }

    checkLoaded(naem: string) {
        let has = false;
        this.loadedIcons.map(res => {
            if (res.name === name) {
                has = true;
            }
        });
        return has;
    }

    addIcon(icon: any) { }

    svgSprite(contents: any) {
        return `
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                id="__ANTD_MOBILE_SVG_SPRITE_NODE__"
                style="position:absolute;width:0;height:0"
            >
                <defs>
                ${contents}
                </defs>
            </svg>`;
    }

    renderSvgSprite() {
        const symbol = this.allIcons.map((res: any) => {
            const { name, content } = res;
            if (!this.checkLoaded(name)) {
                this.loadedIcons.push(res);
                const svgContent = content.split('svg')[1];
                return `<symbol id=${name}${svgContent}symbol>`;
            }
        }).join('');
        return this.svgSprite(symbol);
    }

    loadSprite() {
        if (!document) {
            return;
        }
        const existing = document.getElementById('__ANTD_MOBILE_SVG_SPRITE_NODE__');
        const mountNode = document.head;
        if (!existing) {
            mountNode.insertAdjacentHTML('afterbegin', this.renderSvgSprite());
        }
    }
    // 去掉重复房间号
    private _unique() {
        const res = [];
        const json: Object = {};
        this.icons.map((icons) => {
            icons.map(name => {
                if (!json[name]) {
                    json[name] = true;
                    res.push(name);
                }
            });
        });
        this.icons = res;
    }
    // http
    loadIcon(name: string): Observable<{content: any, name: string}> {
        return this.http.get(this.root + name + '.svg', { responseType: 'text' })
            .map(res => ({ content: res, name: name }));
    }
    // http 
    loadSvg() {
        const iconses: any[] = [];
        const load$: any = [];
        this.icons.map(icon => {
            load$.push(this.loadIcon(icon));
        });
        // 去掉已经加载的
        of(...this.icons)
            .filter(res => {
                return !this.checkExist(res)
            })
            .subscribe((res: any) => {
                iconses.push({
                    name: res.name,
                    content: res.content
                });
                this.allIcons = iconses;
                localStorage.setItem(this.key, JSON.stringify(this.allIcons));
            });
    }
}
