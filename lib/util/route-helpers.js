const respond = fn => {
    return (req, res, next) => {
        fn(req)
            .then(data => {
                res.json(data);
            })
            .catch(next);
    };
};

const check404 = id => obj => {
    if(!obj) {
        throw {
            status: 404,
            error: `Id ${id} does not exist`
        };
    }
    return obj;
};

const getParam = (req, res, next, value, name) => {
    req[name] = value;
    next();
};

module.exports = {
    check404,
    getParam,
    respond
};
