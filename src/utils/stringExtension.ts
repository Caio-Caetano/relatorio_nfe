// Declare uma interface para estender o protótipo da classe String
declare global {
    interface String {
        capitalize(): string;
    }
}

// Defina a função capitalize para o protótipo de String
String.prototype.capitalize = function (): string {
    return this.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

export { }; // Marca o arquivo como um módulo para evitar conflitos com o escopo global
