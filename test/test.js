/**
 * Created by hx0day on 02.03.16.
 */
/*jscs:disable maximumLineLength*/

var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var multivarka = require('../multivarka');
var url = 'mongodb://localhost/urfu-2015';

MongoClient.connect(url, function (err, db) {
    db.collection('students').drop();
    db.close();
});

var person = [
    {
        name: 'Пётр',
        group: 'ПИ-302',
        grade: 5
    },
    {
        name: 'Семен',
        group: 'КН-302',
        grade: 4
    },
    {
        name: 'Андрей',
        group: 'ПИ-302',
        grade: 4
    },
    {
        name: 'Витя',
        group: 'ПИ-301',
        grade: 5
    },
    {
        name: 'Мишв',
        group: 'ПИ-301',
        grade: 5
    },
    {
        name: 'Егор',
        group: 'ПИ-302',
        grade: 4
    },
    {
        name: 'Сергей',
        group: 'ПИ-302',
        grade: 3
    }];


describe('Check', function () {
    describe('Extra credit', function () {
        it('should check that target insert', function (done) {
            var collect = multivarka
                .server(url)
                .collection('students');
            collect.insert(person, function (err, result) {
                if (!err) {
                    assert.equal(result.ops.length, 7);
                    assert.ok(result);
                    done();
                }
            });

        });
        it('should check that target find equal', function (done) {
            multivarka
                .server(url)
                .collection('students')
                .where('group').equal('КН-302').find(function (err, result) {
                if (!err) {
                    assert.ok(result);
                    assert.equal(result.length, 1);
                    assert.equal(result[0].name, 'Семен');
                    assert.equal(result[0].group, 'КН-302');
                    assert.equal(result[0].grade, 4);
                    done();
                }
            });
        });
        it('should check that target find not equal', function (done) {
            multivarka
                .server(url)
                .collection('students')
                .where('group').not().equal('КН-302').find(function (err, result) {
                if (!err) {
                    assert.ok(result);
                    assert.equal(result.length, 6);
                    done();
                }
            });
        });
        it('should check that target find include', function (done) {
            multivarka
                .server(url)
                .collection('students')
                .where('group').include(['КН-302', 'ПИ-301']).find(function (err, result) {
                if (!err) {
                    assert.ok(result);
                    assert.equal(result.length, 3);
                    done();
                }
            });
        });
        it('should check that target find not include', function (done) {
            multivarka
                .server(url)
                .collection('students')
                .where('group').not().include(['КН-302', 'ПИ-301']).find(function (err, result) {
                if (!err) {
                    assert.ok(result);
                    assert.equal(result.length, 4);
                    done();
                }
            });
        });
        it('should check that target find lessThan', function (done) {
            multivarka
                .server(url)
                .collection('students')
                .where('grade').lessThan(4).find(function (err, result) {
                if (!err) {
                    assert.ok(result);
                    assert.equal(result.length, 1);
                    done();
                }
            });
        });
        it('should check that target find not lessThan', function (done) {
            multivarka
                .server(url)
                .collection('students')
                .where('grade').not().lessThan(5).find(function (err, result) {
                if (!err) {
                    assert.ok(result);
                    assert.equal(result.length, 3);
                    done();
                }
            });
        });
        it('should check that target find greatThan', function (done) {
            multivarka
                .server(url)
                .collection('students')
                .where('grade').greatThan(4).find(function (err, result) {
                if (!err) {
                    assert.ok(result);
                    assert.equal(result.length, 3);
                    done();
                }
            });
        });
        it('should check that target find not greatThan', function (done) {
            multivarka
                .server(url)
                .collection('students')
                .where('grade').not().greatThan(4).find(function (err, result) {
                if (!err) {
                    assert.ok(result);
                    assert.equal(result.length, 4);
                    done();
                }
            });
        });
        it('should check that target find not greatThan', function (done) {
            multivarka
                .server(url)
                .collection('students')
                .where('grade').not().greatThan(4).find(function (err, result) {
                if (!err) {
                    assert.ok(result);
                    assert.equal(result.length, 4);
                    done();
                }
            });
        });
        it('should check that target update', function (done) {
            var collect = multivarka
                .server(url)
                .collection('students');
            collect.where('group').equal('КН-302').set('group', 'ФТ-201').update(function (err, result) {
                if (!err) {

                    assert.ok(result.result.ok);

                    collect.where('group').equal('КН-302').find(function (err, result) {
                        if (!err) {
                            assert.ok(result);
                            assert.equal(result.length, 0);
                            collect.where('group').equal('ФТ-201').find(function (err, result) {
                                if (!err) {
                                    assert.ok(result);
                                    assert.equal(result.length, 1);
                                    assert.equal(result[0].name, 'Семен');
                                    assert.equal(result[0].group, 'ФТ-201');
                                    assert.equal(result[0].grade, 4);
                                    done();
                                }

                            });
                        }
                    });
                }
            });
        });

        it('should check that target remove', function (done) {
            var collect = multivarka
                .server(url)
                .collection('students');

            collect.where('group').equal('ПИ-302').remove(function (err, result) {
                if (!err) {
                    assert.ok(result.result.ok);
                    assert.equal(result.result.n, 4);
                    done();
                }
            });

        });
    });

});
