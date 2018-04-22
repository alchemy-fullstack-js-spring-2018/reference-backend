const mongoose = require('mongoose');

const updateById = (schema) => {
    schema.static('updateById', function(id, update){ 
        return this.findByIdAndUpdate(id, update, {
            new: true,
            runValidators: true
        });
    });
};
const updateOne = (schema) => {
    schema.static('updateOne', function(query, update){ 
        return this.findOneAndUpdate(query, update, {
            new: true,
            runValidators: true
        });
    });
};

mongoose.plugin(updateById);
mongoose.plugin(updateOne);