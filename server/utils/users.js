class Users {
    constructor() {
        this.users = [];
    }
    addUser(id,name,room) {
        let find = this.getUserName(name);
        if(!find) {
            let user ={id,name,room};
            this.users.push(user);
            return user;
        }
        throw 'Error'
    }
    removeUser(id) {
        let user = this.getUser(id);
        if(user) {
            this.users = this.users.filter((user) => user.id != id)
        }
        return user;
    }
    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }
    getUserName(name) {
        return this.users.filter((user) => user.name === name)[0];
    }
    getUserList(room){
        let users = this.users.filter((user) => user.room === room);
        let namesArray = users.map((user) => user.name);
        return namesArray;
    }
    getLists(){
        let rooms = this.users.map((user) => user.room);
        let duplicates = [...new Set(rooms)];
        return duplicates;
    }
}

module.exports = {Users};