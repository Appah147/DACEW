// Script pour mettre à jour la valeur du prix affiché lorsque le slider est ajusté
document.getElementById('price-range').addEventListener('input', function() {
    document.getElementById('price-value').textContent = this.value;
});