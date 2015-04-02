var assert = require('assert');

describe('stringUtils', function(){
    var stringUtils = require('../lib/stringUtils');

    describe('trim', function(){
        it('should not change normal string', function(){
            assert.equal(stringUtils.trim("testString"), "testString");
        });
        it('should remove first space', function(){
            assert.equal(stringUtils.trim(" withSpace"), "withSpace");
        });
        it('should remove last space', function(){
            assert.equal(stringUtils.trim("lastSpace "), "lastSpace");
        });

        it('should remove all spaces', function(){
            assert.equal(stringUtils.trim("  spaces  "), "spaces");
        });
    });

    describe('removeExtraSpaces', function(){
        it('should left single space in string', function(){
            assert.equal(stringUtils.removeExtraSpaces("  test  String  "), " test String ");
        });
    });

    describe('has', function(){
        it('should be true if contains string', function(){
            assert.ok(stringUtils.has("abc", "abc"));
        });
        it('should be false if not contains string', function(){
            assert.ok(!stringUtils.has("abc", "xyz"));
        });
    });

    describe('startsWith', function(){
        it('should be true if starts with string', function(){
            assert.ok(stringUtils.startsWith("pomodoro", "pom"));
        });
        it('should be false if not starts string', function(){
            assert.ok(!stringUtils.startsWith("pomodoro", "oro"));
        });
        it('should not fail with empty string', function(){
            assert.ok(stringUtils.startsWith("", ""));
        });
    });

    describe('endsWith', function(){
        it('should be true if ends with string', function(){
            assert.ok(stringUtils.endsWith("pomodoro", "oro"));
        });
        it('should be false if not ends string', function(){
            assert.ok(!stringUtils.endsWith("pomodoro", "pom"));
        });
        it('should not fail with empty string', function(){
            assert.ok(stringUtils.endsWith("", ""));
        });
    });

    describe('clean', function(){
        it('should make nice string', function(){
            assert.equal(stringUtils.clean("  Test  String  "), "Test String");
        });
        it('should replace ё by е', function(){
            assert.equal(stringUtils.clean("  Ё-мобиль  -  это  наше  всё  "), "Е-мобиль - это наше все");
        });
        it('should not fail with empty string', function(){
            assert.equal(stringUtils.clean(""), "");
        });
    });
    describe('cleanAndLow', function(){
        it('should make low string', function(){
            assert.equal(stringUtils.cleanAndLow("TestString"), "teststring");
        });
        it('should make locale low string', function(){
            assert.equal(stringUtils.cleanAndLow("ПоМиДор"), "помидор");
        });
        it('should not fail with empty string', function(){
            assert.equal(stringUtils.cleanAndLow(""), "");
        });
    });
    describe('findInString exact', function(){
        it('should match exact string', function(){
            assert.ok(stringUtils.findInString("Super String Theory","Super String Theory","exact"));
        });
        it('should not match case', function(){
            assert.ok(!stringUtils.findInString("Super String Theory","super string theory","exact"));
        });
        it('should not fail if empty', function(){
            assert.ok(stringUtils.findInString("","","exact"));
        });
        it('should not find string without quotes', function(){
            assert.ok(!stringUtils.findInString("Pomodoro",'"Pomodoro"',"exact"));
        });
    });
    describe('findInString equals', function(){
        it('should match exact string', function(){
            assert.ok(stringUtils.findInString("Super String Theory","Super String Theory","equals"));
        });
        it('should match case and spaces', function(){
            assert.ok(stringUtils.findInString("  Super String Theory  ","super  string  theory","equals"));
        });
        it('should not fail if empty', function(){
            assert.ok(stringUtils.findInString("","","equals"));
        });
    });
    describe('findInString contains', function(){
        it('should match exact string', function(){
            assert.ok(stringUtils.findInString("Super String Theory","Super String Theory","contains"));
        });
        it('should match sub string', function(){
            assert.ok(stringUtils.findInString("Super String Theory","r String T","contains"));
        });
        it('should match case and spaces', function(){
            assert.ok(stringUtils.findInString("Super  String  Theory","  super string theory  ","contains"));
        });
        it('should not fail if empty', function(){
            assert.ok(stringUtils.findInString("","","contains"));
        });
    });
    describe('findInString', function(){
        it('should match exact string', function(){
            assert.ok(stringUtils.findInString("Super String Theory","Super String Theory"));
        });
        it('should match any string order', function(){
            assert.ok(stringUtils.findInString("Super String Theory","Theory Super String"));
        });
        it('should match any substring order', function(){
            assert.ok(stringUtils.findInString("Super String Theory","ory upe trin"));
        });
        it('should not match some random letters', function(){
            assert.ok(!stringUtils.findInString("Super String Theory","xyz zyx"));
        });
        it('should not good word and one wrong word', function(){
            assert.ok(!stringUtils.findInString("Super String Theory","string theX"));
        });
        it('should match sub string', function(){
            assert.ok(stringUtils.findInString("Super String Theory","r String T"));
        });
        it('should match case and spaces', function(){
            assert.ok(stringUtils.findInString("Super  String  Theory"," super string theory "));
        });
        it('should not fail if empty', function(){
            assert.ok(stringUtils.findInString("",""));
        });
        it('should find string in quotes', function(){
            assert.ok(stringUtils.findInString("Pomodoro",'"Pomodoro"'));
        });
        it('should not find substring in quotes', function(){
            assert.ok(!stringUtils.findInString("Pomodoro",'"mod"'));
        });
    });
});