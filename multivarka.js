module.exports = {
    server: function (url) {
        if (!url) {
            console.error('Not url');
            process.exit(1);
        }
        this.url = url;
        this.query = {};
        this.isNegative = false;
        return this;
    },

    collection: function (collection) {
        if (!this.url) {
            console.error('Not db');
            process.exit(1);
        }
        this.collect = collection;
        return this;
    },

    where: function (property) {
        this.property = property;
        return this;
    },

    not: function () {
        this.isNegative = true;
        return this;
    },

    equal: function (value) {
        this.query[this.property] = !this.isNegative ? value : {$ne: value};
        return this;
    },

    lessThan: function (value) {
        this.query[this.property] = this.isNegative ? {$gte: value} : {$lt: value};
        return this;
    },

    greatThan: function (value) {
        this.query[this.property] = this.isNegative ? {$lte: value} : {$gt: value};
        return this;
    },

    include: function (value) {
        this.query[this.property] = this.isNegative ? {$nin: value} : {$in: value};
        return this;
    },

    set: function (filde, value) {
        var set_query = {};
        set_query[filde] = value;
        this.set = {$set: set_query};
        return this;
    },

    find: function (callback) {
        mongo_manager('find', this, callback);
        return this;
    },

    remove: function (callback) {
        mongo_manager('remove', this, callback);
        return this;
    },

    update: function (callback) {
        mongo_manager('update', this, callback);
        return this;
    },

    insert: function (data, callback) {
        if (!data) {
            console.error('Error insert');
            process.exit(1);
        }
        this.data = data;
        mongo_manager('insert', this, callback);
        return this;
    }
};

function mongo_manager(type, multivarka, callback) {
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect(multivarka.url, (err, db) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        switch (type) {
            case 'find':
                var cursor = db.collection(multivarka.collect).find(multivarka.query);
                cursor.toArray(
                    (err, date)=> {
                        callback(err, date);
                        db.close();
                    });
                break;
            case 'remove':
                db.collection(multivarka.collect).remove(
                    multivarka.query,
                    (err, date)=> {
                        callback(err, date);
                        db.close();
                    });
                break;
            case 'update':
                db.collection(multivarka.collect).update(
                    multivarka.query,
                    multivarka.set,
                    (err, date)=> {
                        callback(err, date);
                        db.close();
                    });
                break;
            case 'insert':
                db.collection(multivarka.collect).insert(
                    multivarka.data,
                    (err, date)=> {
                        callback(err, date);
                        db.close();
                    });
                break;
        }
    });
}
