var maxPrice = 250; // Prix maximum pour le slider au départ

// Script pour mettre à jour la valeur du prix affiché lorsque le slider est ajusté
document.getElementById('price-range').addEventListener('input', function() {
    document.getElementById('price-value').textContent = this.value;
    maxPrice = this.value; // Met à jour la valeur maximale du prix
});
//aapah miss fina 
function filterPrice(){
    const products = document.getElementsByClassName('product-card');
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const price = parseFloat(product.getAttribute('data-price'));
        if (price > maxPrice) {
            product.style.display = 'none'; // Masquer le produit si le prix est supérieur à maxPrice
        } else {
            product.style.display = 'block'; // Afficher le produit si le prix est inférieur ou égal à maxPrice
        }
    }
}
// Fonction pour filtrer les produits en fonction de la catégorie sélectionnée