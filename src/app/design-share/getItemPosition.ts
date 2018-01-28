import { guid } from './guid';
export class Item {
    private _children: Item[];
    uuid: string = guid();
    father: Item;
    constructor(
        children: Item[],
        father: Item
    ) {
        this.children = children;
        this.father = father;
    }
    set children(children: Item[]) {
        this._children = children;
    }
    get children() {
        return this._children;
    }
    checkSelf(uuid: string) {
        return this.uuid == uuid;
    }
    checkChild(uuid: string) {
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].checkSelf(uuid)) {
                return this.children[i];
            }
            let res = this.children[i].checkChild(uuid);
            if (res) { 
                return res;
            }
        }
        return false;
    }
    checkChildAndSelf(uuid: string) {
        if (this.checkSelf(uuid)) {
            return this;
        }
        let checkChild = this.checkChild(uuid);
        if (checkChild) {
            return checkChild;
        }
    }
}

const item = new Item([], null);
const item1 = new Item([], item);
const item2 = new Item([], item1);
const item3 = new Item([], item2);

item2.children = [item3];
item1.children = [item2];
item.children = [item1];
const res = item.checkChildAndSelf(item3.uuid);
function getPosition(item, uuids: string[]) {
    uuids.push(item.uuid);
    if (item.father) {
        getPosition(item.father, uuids);
    }
    return uuids;
}