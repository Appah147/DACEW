var maxPrice = 250; // Prix maximum pour le slider au départ

// Script pour mettre à jour la valeur du prix affiché lorsque le slider est ajusté
document.getElementById('price-range').addEventListener('input', function() {
    document.getElementById('price-value').textContent = this.value;
    maxPrice = this.value; // Met à jour la valeur maximale du prix
});
//aapah miss fina 
function filterPrice(){
    const produits = document.getElementsByClassName('product-card');
    console.log(produits)
    for (let i = 0; i < products.length; i++) {
        const product = produits[i];
        console.log(product.getAttribute('product-name'));
        console.log(parseFloat(product.getAttribute('data-price')));
        const price = parseFloat(product.getAttribute('data-price'));
        if (price > maxPrice) {
            product.style.display = 'none'; // Masquer le produit si le prix est supérieur à maxPrice
            console.log('Masquer le produit : ' + product.getAttribute('product-name'));
        } else {
            product.style.display = 'block'; // Afficher le produit si le prix est inférieur ou égal à maxPrice
            console.log('Afficher le produit : ' + product.getAttribute('product-name'));
        }
    }
}
// Fonction pour filtrer les produits en fonction de la catégorie sélectionnée