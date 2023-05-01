export function checkAllProductsFromSameRestaurant(products){
    if (products.length === 0){
        return true;
    }
    let initialRestaurant = products[0].restaurant.valueOf();
    let difference = products.filter((product) => product.restaurant.valueOf() != initialRestaurant).length === 0;
    console.log(difference);
    return difference;
}

export function formatDelivery(delivery){
    delivery.products.forEach((product) => delete product.restaurant);
    return delivery;
}
