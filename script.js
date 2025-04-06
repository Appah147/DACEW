var maxPrice = 250; // Prix maximum pour le slider au départ

// Script pour mettre à jour la valeur du prix affiché lorsque le slider est ajusté
document.getElementById('price-range').addEventListener('input', function() {
    document.getElementById('price-value').textContent = this.value;
    maxPrice = this.value; // Met à jour la valeur maximale du prix
});
//aapah miss fina 
function filterPrice(){
    console.log("La classe de products sont: ", document.getElementsByClassName('products'))
    const produits = document.getElementsByClassName('product-card');
    console.log("Les produits sont: ", produits)
    for (let i = 0; i < produits.length; i++) {
        const product = produits[i];
        
        const price = parseFloat(product.getElementsByClassName('data-price'));
        if (price > maxPrice) {
            product.style.display = 'none'; // Masquer le produit si le prix est supérieur à maxPrice
            console.log('Masquer le produit : ' + product.getElementsByClassName('product-name'));
        } else {
            product.style.display = 'block'; // Afficher le produit si le prix est inférieur ou égal à maxPrice
            console.log('Afficher le produit : ' + product.getElementsByClassName('product-name'));
        }
        console.log(product.getElementsByClassName('product-name'));
        console.log(parseFloat(product.getElementsByClassName('data-price')));
    }
}
// Fonction pour filtrer les produits en fonction de la catégorie sélectionnée