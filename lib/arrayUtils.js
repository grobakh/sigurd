if (require.main) {
    define = function (moduleName, demands, valueGenerator) {
        var imported = [];

        for (var i = demands.length; i--;) {
            imported.unshift(require("./" + demands[i]));
        }

        module.exports = valueGenerator.apply(this, imported);
    }
}

define("arrayUtils", [], function () {
    return {
        exclude: function (array, item) {
            for(var i = 0; i < array.length; i++)
            {
                if(array[i] === item)
                {
                    array.splice(i--, 1);
                }
            }
        }
    }
});