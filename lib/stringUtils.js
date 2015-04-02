if (require.main) {
    define = function (moduleName, demands, valueGenerator) {
        var imported = [];

        for (var i = demands.length; i--;) {
            imported.unshift(require("./" + demands[i]));
        }

        module.exports = valueGenerator.apply(this, imported);
    }
}

define("stringUtils", ["events"], function (events) {
    return {
        config: {
            equalLetters: { 'ё': 'е', 'Ё': 'Е' }
        },

        trim: function (str) {
            return str.replace(/^\s+|\s+$/g, '');
        },

        removeExtraSpaces: function (str) {
            return str.replace(/\s+/gi, ' ');
        },

        has: function (str, value) {
            return !!~str.indexOf(value);
        },

        startsWith: function (str, value) {
            return !str.indexOf(value);
        },

        endsWith: function (str, value) {
            if (str.length < value.length) return false;
            return str.lastIndexOf(value) === (str.length - value.length);
        },

        clean: function (str) {
            str = str || "";
            str = this.removeExtraSpaces(this.trim(str));

            var letters = this.config.equalLetters || {};

            for (var letter in letters) {
                if (letters.hasOwnProperty(letter)) {
                    str = str.replace(letter, letters[letter]);
                }
            }

            return str;
        },

        cleanAndLow: function (str) {
            return this.clean(str).toLocaleLowerCase();
        },

        findInString: function (where, what, algorithm) {
            if (!algorithm && this.startsWith(what, '"') && this.endsWith(what, '"')) {
                what = what.slice(1, -1);
                algorithm = "exact";
            }

            switch (algorithm) {
                case "exact":
                    return where === what;
                case "contains":
                    what = this.cleanAndLow(what);
                    where = this.cleanAndLow(where);
                    return ~where.indexOf(what);
                case "equals":
                    what = this.cleanAndLow(what);
                    where = this.cleanAndLow(where);
                    return where === what;
                case "tags":
                default:
                    what = this.cleanAndLow(what);
                    where = this.cleanAndLow(where);

                    var requestWords = what.split(' ');

                    for (var i = requestWords.length; i--;) {
                        if (!~where.indexOf(requestWords[i])) {
                            return false;
                        }
                    }

                    return true;
            }
        }
    }
});