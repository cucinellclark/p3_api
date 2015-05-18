define([
    'intern!object',
    'intern/chai!assert',
    'intern/dojo/request'
], function (registerSuite, assert, request) {
    var suite = {
        name: "SOLR Data Query"
    };

    var basicQueries = [
    ];

    var dataModel = {
        "genome_feature": {
            queries: [
                    assert.isTrue(data.response.numFound == 28357);
                }]
            ]
        }
    };

    var filter = [
        "user", "collection", "client", "genome_sequence", "host-resp", "misc_niaid_gsc",
        "proteomics_peptide", "proteomics_protein", "proteomics_experiment"
    ];

    Object.keys(dataModel).filter(function (x) {
        return filter.indexOf(x) == -1
    }).forEach(function (model) {
        var Model = dataModel[model];
        var queries = Model.queries ? basicQueries.concat(Model.queries) : basicQueries;
        queries.forEach(function (bq) {
            var query = bq[0];
            var handler = bq[1];
            suite["POST /" + model + "/" + query] = function () {
		console.log("Do Large POST Query: ", query);
                var dfd = this.async(240000);
                request('http://localhost:3001/' + model + '/', {
                    method: "POST",
                    headers: {
                        accept: "application/solr+json",
                        "content-type": "application/solrquery+x-www-form-urlencoded"
                    },
                    handleAs: "json",
                    data: query
                }).then(dfd.callback(handler),
			dfd.reject.bind(dfd)
		);
                return dfd;
            }
        });
    });

    registerSuite(suite);
});