const request = () => {
    return fetch('http://www-2.munimadrid.es/RPGCS_RSPLAN/rest/getInfo.iam?x=442879&y=4475446')
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            console.log(myJson);
        });
};

console.log(request());
