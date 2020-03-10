import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    };

    additem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        };
        this.items.push(item);
    };


    // returns index of element with matching id
    // splice() removes said element from items array --> splice() (unlike slice()) mutates an array
    deleteItem(id) {  
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1);
    };


    // sets count property of object (which is found by it's id property) in items array to newCount
    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    };
};
