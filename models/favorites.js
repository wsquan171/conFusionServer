const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteEnrtySchema = new Schema({
    dish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }
});

const favoriteSchema = new Schema({
    author:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    favorites: [favoriteEnrtySchema]
});

var Favorites = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorites;