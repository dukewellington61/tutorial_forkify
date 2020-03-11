import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    };

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        };
        this.items.push(item);
        return item;
    };


    // returns index of element with matching id
    // splice() removes said element from items array --> splice() (unlike slice()) mutates an array
    deleteItem(id) {  
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1);
    };

    // sets count property of object (which is found by its id property) in items array to newCount
    updateCount(id, newCount) {
        console.log(id);
        console.log(this.items.find(el => el.id === id));
        this.items.find(el => el.id === id).count = newCount;
    };
};
